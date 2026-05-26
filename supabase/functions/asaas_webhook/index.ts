import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendOrderStatusEmail } from "../_shared/order-status-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, asaas-access-token",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verificar token de acesso do Asaas (opcional, para segurança adicional)
    const asaasToken = req.headers.get("asaas-access-token");
    const expectedToken = Deno.env.get("ASAAS_WEBHOOK_TOKEN");

    if (expectedToken && asaasToken !== expectedToken) {
      console.warn("Token de webhook inválido");
      // Não retornar erro para não expor informações
    }

    // Obter dados do webhook
    const webhookData = await req.json();
    console.log("Webhook recebido:", JSON.stringify(webhookData, null, 2));

    const { event, payment } = webhookData;

    if (!event || !payment) {
      throw new Error("Dados do webhook incompletos");
    }

    // Conectar ao Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar pedido no banco de dados
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("asaas_payment_id", payment.id)
      .single();

    if (orderError || !order) {
      console.error("Pedido não encontrado:", payment.id);
      // Retornar sucesso mesmo assim para não reenviar webhook
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Processar evento
    let newStatus = order.status;

    switch (event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        newStatus = "completed";
        break;

      case "PAYMENT_OVERDUE":
      case "PAYMENT_DELETED":
        newStatus = "cancelled";
        break;

      case "PAYMENT_REFUNDED":
      case "PAYMENT_REFUND_IN_PROGRESS":
        newStatus = "refunded";
        break;

      case "PAYMENT_CREATED":
      case "PAYMENT_AWAITING_RISK_ANALYSIS":
      case "PAYMENT_APPROVED_BY_RISK_ANALYSIS":
        newStatus = "pending";
        break;

      default:
        console.log("Evento não tratado:", event);
    }

    // Atualizar pedido se o status mudou
    if (newStatus !== order.status) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          completed_at:
            newStatus === "completed" ? new Date().toISOString() : order.completed_at,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Erro ao atualizar pedido:", updateError);
        throw updateError;
      }

      console.log(
        `Pedido ${order.id} atualizado de ${order.status} para ${newStatus}`
      );

      const emailResult = await sendOrderStatusEmail(supabase, {
        orderId: order.id,
        previousStatus: order.status,
        newStatus,
        source: "asaas_webhook",
      });
      console.log("Resultado do e-mail de status:", emailResult);
    }

    // Retornar sucesso
    return new Response(
      JSON.stringify({
        received: true,
        orderId: order.id,
        event,
        newStatus,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro no webhook:", error);
    // Retornar sucesso para não reenviar webhook
    return new Response(
      JSON.stringify({
        received: true,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
