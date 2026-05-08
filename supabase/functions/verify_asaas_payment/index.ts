import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Conectar ao Supabase
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

    // Obter payment_id da requisição
    const { payment_id } = await req.json();

    if (!payment_id) {
      throw new Error("payment_id não fornecido");
    }

    // Buscar status do pagamento no Asaas
    const paymentResponse = await fetch(
      `${asaasBaseUrl}/payments/${payment_id}`,
      {
        headers: {
          access_token: asaasApiKey,
        },
      }
    );

    if (!paymentResponse.ok) {
      throw new Error("Erro ao buscar pagamento no Asaas");
    }

    const asaasPayment = await paymentResponse.json();

    // Buscar pedido no banco de dados
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("asaas_payment_id", payment_id)
      .single();

    if (orderError || !order) {
      throw new Error("Pedido não encontrado");
    }

    // Mapear status do Asaas para status do pedido
    let orderStatus = order.status;
    if (asaasPayment.status === "RECEIVED" || asaasPayment.status === "CONFIRMED") {
      orderStatus = "completed";
    } else if (asaasPayment.status === "OVERDUE" || asaasPayment.status === "REFUNDED") {
      orderStatus = "cancelled";
    }

    // Atualizar pedido se o status mudou
    if (orderStatus !== order.status) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: orderStatus,
          completed_at: orderStatus === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Erro ao atualizar pedido:", updateError);
      }
    }

    // Retornar resposta
    return new Response(
      JSON.stringify({
        verified: true,
        status: orderStatus,
        paymentId: payment_id,
        asaasStatus: asaasPayment.status,
        value: asaasPayment.value,
        dueDate: asaasPayment.dueDate,
        invoiceUrl: asaasPayment.invoiceUrl,
        bankSlipUrl: asaasPayment.bankSlipUrl,
        order: {
          ...order,
          status: orderStatus,
        },
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
        verified: false,
        error: error.message || "Erro ao verificar pagamento",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
