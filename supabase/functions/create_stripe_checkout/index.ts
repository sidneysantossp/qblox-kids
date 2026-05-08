import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@19.1.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl!, supabaseKey!);

const successUrlPath = '/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}';
const cancelUrlPath = '/carrinho';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CheckoutRequest {
  items: OrderItem[];
  shipping_address?: any;
  shipping_cost?: number;
  discount?: number;
  coupon_code?: string;
  currency?: string;
  payment_method_types?: string[];
}

// Resposta de sucesso
function ok(data: any): Response {
  return new Response(
    JSON.stringify({ code: "SUCCESS", message: "Sucesso", data }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

// Resposta de erro
function fail(msg: string, code = 400): Response {
  return new Response(
    JSON.stringify({ code: "FAIL", message: msg }),
    {
      status: code,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

// Validar requisição
function validateCheckoutRequest(request: CheckoutRequest): void {
  if (!request.items?.length) {
    throw new Error("O carrinho está vazio");
  }
  for (const item of request.items) {
    if (!item.name || item.price <= 0 || item.quantity <= 0) {
      throw new Error("Informações do produto inválidas");
    }
  }
}

// Processar itens do pedido e calcular total
function processOrderItems(items: OrderItem[], shippingCost: number = 0, discount: number = 0) {
  const formattedItems = items.map(item => ({
    product_id: item.product_id,
    name: item.name.trim(),
    price: Math.round(item.price * 100), // Converter para centavos
    quantity: item.quantity,
    image_url: item.image_url?.trim() || "",
  }));
  
  const subtotal = formattedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const totalAmount = subtotal + Math.round(shippingCost * 100) - Math.round(discount * 100);
  
  return { formattedItems, totalAmount, subtotal };
}

// Criar sessão de checkout
async function createCheckoutSession(
  stripe: Stripe,
  userId: string | null,
  request: CheckoutRequest,
  origin: string
) {
  const { formattedItems, totalAmount, subtotal } = processOrderItems(
    request.items,
    request.shipping_cost || 0,
    request.discount || 0
  );

  // Criar pedido no banco de dados
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      items: formattedItems,
      total_amount: totalAmount / 100, // Converter de volta para reais
      shipping_cost: request.shipping_cost || 0,
      discount: request.discount || 0,
      coupon_code: request.coupon_code || null,
      shipping_address: request.shipping_address || null,
      currency: request.currency?.toLowerCase() || 'brl',
      status: "pending",
      payment_method: "card", // Stripe processa pagamentos com cartão
      payment_gateway: "stripe", // Gateway de pagamento usado
    })
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar pedido: ${error.message}`);

  // Criar line items para o Stripe
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = request.items.map(item => ({
    price_data: {
      currency: request.currency?.toLowerCase() || 'brl',
      product_data: {
        name: item.name,
        images: item.image_url ? [item.image_url] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  // Adicionar frete como item separado se houver
  if (request.shipping_cost && request.shipping_cost > 0) {
    lineItems.push({
      price_data: {
        currency: request.currency?.toLowerCase() || 'brl',
        product_data: {
          name: 'Frete',
        },
        unit_amount: Math.round(request.shipping_cost * 100),
      },
      quantity: 1,
    });
  }

  // Criar sessão do Stripe
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${origin}${successUrlPath}`,
    cancel_url: `${origin}${cancelUrlPath}`,
    payment_method_types: request.payment_method_types || ['card'],
    metadata: {
      order_id: order.id,
      user_id: userId || "guest",
    },
    // Aplicar desconto se houver
    ...(request.discount && request.discount > 0 ? {
      discounts: [{
        coupon: request.coupon_code || undefined,
      }],
    } : {}),
  });

  // Atualizar pedido com IDs do Stripe
  await supabase
    .from("orders")
    .update({
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq("id", order.id);

  return { order, session };
}

// ========== Função Principal ==========
Deno.serve(async (req) => {
  try {
    // Tratar OPTIONS para CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    if (req.method !== "POST") {
      return new Response("Método não permitido", { status: 405 });
    }

    // Parsear requisição
    const request: CheckoutRequest = await req.json();
    validateCheckoutRequest(request);

    // Obter usuário autenticado (se houver)
    let user = null;
    try {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      
      if (token) {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data?.user) {
          user = data.user;
        }
      }
    } catch (error) {
      // Token inválido ou expirado - continuar como guest
      console.log("Token inválido, processando como guest:", error);
    }

    // Verificar chave do Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY não configurada. Por favor, configure a chave no painel de administração.");
    }

    // Inicializar Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Obter origem para URLs de retorno
    const origin = req.headers.get("origin") || req.headers.get("referer")?.split('/').slice(0, 3).join('/') || "";
    
    // Criar sessão de checkout
    const { order, session } = await createCheckoutSession(
      stripe,
      user?.id || null,
      request,
      origin
    );

    return ok({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Erro no checkout:", error);
    return fail(
      error instanceof Error ? error.message : "Erro ao processar pagamento",
      500
    );
  }
});
