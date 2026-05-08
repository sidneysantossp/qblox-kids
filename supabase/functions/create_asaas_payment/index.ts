import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CreatePaymentRequest {
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone?: string;
    postalCode?: string;
    address?: string;
    addressNumber?: string;
    complement?: string;
    province?: string;
    city?: string;
    state?: string;
  };
  paymentMethod: "PIX" | "BOLETO" | "CREDIT_CARD";
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
  shipping_cost?: number;
  discount?: number;
  coupon_code?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Inicializar Supabase para buscar configurações
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar configurações do Asaas no banco de dados
    const { data: settings, error: settingsError } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", ["asaas_api_key", "asaas_environment"]);

    if (settingsError) {
      console.error("Erro ao buscar configurações:", settingsError);
      throw new Error("Erro ao buscar configurações do Asaas");
    }

    const asaasApiKey = settings?.find((s) => s.setting_key === "asaas_api_key")?.setting_value;
    const asaasEnvironment = settings?.find((s) => s.setting_key === "asaas_environment")?.setting_value || "sandbox";

    if (!asaasApiKey) {
      throw new Error("Chave de API do Asaas não configurada. Configure em Admin → Pagamentos");
    }

    // Determinar URL base do Asaas
    const asaasBaseUrl = asaasEnvironment === "production"
      ? "https://api.asaas.com/v3"
      : "https://sandbox.asaas.com/api/v3";

    // Obter dados da requisição
    const {
      items,
      customer,
      paymentMethod,
      creditCard,
      creditCardHolderInfo,
      shipping_cost = 0,
      discount = 0,
      coupon_code,
    }: CreatePaymentRequest = await req.json();

    // Validar dados obrigatórios
    if (!items || items.length === 0) {
      throw new Error("Nenhum item no pedido");
    }

    if (!customer || !customer.name || !customer.email || !customer.cpfCnpj) {
      throw new Error("Dados do cliente incompletos");
    }

    if (!paymentMethod) {
      throw new Error("Método de pagamento não especificado");
    }

    // Calcular total
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + shipping_cost - discount;

    // Criar cliente no Asaas (ou buscar existente)
    const customerResponse = await fetch(
      `${asaasBaseUrl}/customers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: asaasApiKey,
        },
        body: JSON.stringify({
          name: customer.name,
          email: customer.email,
          cpfCnpj: customer.cpfCnpj,
          phone: customer.phone,
          postalCode: customer.postalCode,
          address: customer.address,
          addressNumber: customer.addressNumber,
          complement: customer.complement,
          province: customer.province,
          externalReference: customer.email,
        }),
      }
    );

    if (!customerResponse.ok) {
      const errorData = await customerResponse.json();
      console.error("Erro ao criar cliente no Asaas:", errorData);
      throw new Error(
        `Erro ao criar cliente: ${errorData.errors?.[0]?.description || "Erro desconhecido"}`
      );
    }

    const asaasCustomer = await customerResponse.json();

    // Criar cobrança no Asaas
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3); // Vencimento em 3 dias

    const paymentData: any = {
      customer: asaasCustomer.id,
      billingType: paymentMethod,
      value: total,
      dueDate: dueDate.toISOString().split("T")[0],
      description: `Pedido Kids Block Store - ${items.length} item(ns)`,
      externalReference: `order_${Date.now()}`,
    };

    // Adicionar dados do cartão se for pagamento com cartão
    if (paymentMethod === "CREDIT_CARD" && creditCard && creditCardHolderInfo) {
      paymentData.creditCard = {
        holderName: creditCard.holderName,
        number: creditCard.number.replace(/\s/g, ""),
        expiryMonth: creditCard.expiryMonth,
        expiryYear: creditCard.expiryYear,
        ccv: creditCard.ccv,
      };
      paymentData.creditCardHolderInfo = creditCardHolderInfo;
    }

    const paymentResponse = await fetch(
      `${asaasBaseUrl}/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: asaasApiKey,
        },
        body: JSON.stringify(paymentData),
      }
    );

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      console.error("Erro ao criar cobrança no Asaas:", errorData);
      throw new Error(
        `Erro ao criar cobrança: ${errorData.errors?.[0]?.description || "Erro desconhecido"}`
      );
    }

    const asaasPayment = await paymentResponse.json();

    // Obter QR Code do Pix se for pagamento via Pix
    let pixQrCode = null;
    let pixCopyPaste = null;
    if (paymentMethod === "PIX") {
      const pixResponse = await fetch(
        `${asaasBaseUrl}/payments/${asaasPayment.id}/pixQrCode`,
        {
          headers: {
            access_token: asaasApiKey,
          },
        }
      );

      if (pixResponse.ok) {
        const pixData = await pixResponse.json();
        pixQrCode = pixData.encodedImage;
        pixCopyPaste = pixData.payload;
      }
    }

    // Criar pedido no banco de dados
    // Obter token de autorização
    const authHeader = req.headers.get("Authorization");
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
      } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: total,
        shipping_cost,
        discount,
        coupon_code,
        payment_method: paymentMethod.toLowerCase(),
        payment_method_type: paymentMethod.toLowerCase(),
        payment_gateway: "asaas",
        status: paymentMethod === "CREDIT_CARD" ? "completed" : "pending",
        shipping_address: {
          name: customer.name,
          email: customer.email,
          cpfCnpj: customer.cpfCnpj,
          phone: customer.phone,
          postalCode: customer.postalCode,
          address: customer.address,
          addressNumber: customer.addressNumber,
          complement: customer.complement,
          province: customer.province,
          city: customer.city,
          state: customer.state,
        },
        items,
        currency: "BRL",
        customer_email: customer.email,
        customer_name: customer.name,
        asaas_payment_id: asaasPayment.id,
        asaas_invoice_url: asaasPayment.invoiceUrl,
        asaas_bank_slip_url: asaasPayment.bankSlipUrl,
        asaas_pix_qr_code: pixQrCode,
        asaas_pix_copy_paste: pixCopyPaste,
        completed_at:
          paymentMethod === "CREDIT_CARD" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Erro ao criar pedido:", orderError);
      throw new Error("Erro ao criar pedido no banco de dados");
    }

    // Retornar resposta
    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        paymentId: asaasPayment.id,
        invoiceUrl: asaasPayment.invoiceUrl,
        bankSlipUrl: asaasPayment.bankSlipUrl,
        pixQrCode,
        pixCopyPaste,
        status: asaasPayment.status,
        paymentMethod,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro na edge function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Erro ao processar pagamento",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
