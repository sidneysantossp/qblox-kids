import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@19.1.0";
import { sendOrderStatusEmail } from "../_shared/order-status-email.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

// Atualizar status do pedido para concluído
async function updateOrderStatus(
  sessionId: string,
  session: Stripe.Checkout.Session
): Promise<{ success: boolean; order?: any }> {
  // Buscar pedido pelo session_id
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  if (fetchError || !order) {
    console.error("Erro ao buscar pedido:", fetchError);
    return { success: false };
  }

  // Se já está concluído, retornar sucesso
  if (order.status === "completed") {
    return { success: true, order };
  }

  // Verificar se está pendente
  if (order.status !== "pending") {
    console.error(`Pedido com status ${order.status}, não pode ser concluído`);
    return { success: false };
  }

  // Atualizar pedido para concluído
  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      stripe_payment_intent_id: session.payment_intent as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("status", "pending") // Garantir que só atualiza se ainda estiver pendente
    .select()
    .single();

  if (updateError) {
    console.error("Erro ao atualizar pedido:", updateError);
    return { success: false };
  }

  const emailResult = await sendOrderStatusEmail(supabase, {
    orderId: order.id,
    previousStatus: order.status,
    newStatus: "completed",
    source: "stripe_verification",
  });
  console.log("Resultado do e-mail de status:", emailResult);

  console.log(`Pedido ${order.id} concluído com sucesso`);
  
  return { success: true, order: updatedOrder };
}

// ========== Função Principal ==========
Deno.serve(async (req) => {
  try {
    // Tratar OPTIONS para CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Parsear requisição
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("session_id é obrigatório");
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

    // Buscar sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verificar status do pagamento
    if (session.payment_status !== "paid") {
      return ok({
        verified: false,
        status: session.payment_status,
        sessionId: session.id,
        message: "Pagamento ainda não foi concluído",
      });
    }

    // Atualizar pedido no banco de dados
    const { success, order } = await updateOrderStatus(sessionId, session);

    if (!success) {
      return fail("Erro ao atualizar status do pedido", 500);
    }

    // Retornar confirmação de pagamento
    return ok({
      verified: true,
      status: "paid",
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      order: order,
      message: "Pagamento confirmado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return fail(
      error instanceof Error ? error.message : "Erro ao verificar pagamento",
      500
    );
  }
});
