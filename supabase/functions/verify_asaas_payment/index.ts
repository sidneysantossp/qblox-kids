import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ASAAS_VERIFY_TIMEOUT_MS = 10000;

const errorResponse = (error: string, step: string, status = 400) =>
  new Response(
    JSON.stringify({ verified: false, error, step }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    }
  );

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number, step: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(`timeout:${step}`), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Timeout ao executar ${step}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
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
    const paymentResponse = await fetchWithTimeout(
      `${asaasBaseUrl}/payments/${payment_id}`,
      {
        headers: {
          access_token: asaasApiKey,
        },
      },
      ASAAS_VERIFY_TIMEOUT_MS,
      'asaas:verify_payment',
    );

    if (!paymentResponse.ok) {
      return errorResponse('Erro ao buscar pagamento no Asaas', 'asaas:verify_payment');
    }

    const asaasPayment = await paymentResponse.json();

    // Buscar pedido no banco de dados
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("asaas_payment_id", payment_id)
      .single();

    if (orderError || !order) {
      return errorResponse('Pedido não encontrado', 'database:find_order', 404);
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
    const message = error instanceof Error ? error.message : 'Erro ao verificar pagamento';
    const step = message.startsWith('Timeout ao executar') ? 'timeout' : 'unexpected';
    console.error("Erro na edge function:", { step, error });
    return errorResponse(message, step);
  }
});
