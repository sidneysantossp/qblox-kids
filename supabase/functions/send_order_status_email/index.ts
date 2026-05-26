import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendOrderStatusEmail } from "../_shared/order-status-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, previousStatus, newStatus, source } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!orderId || !newStatus) {
      return json({ error: "orderId e newStatus sao obrigatorios" }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceKey);

    const { data: authData, error: authError } = await serviceClient.auth.getUser(token);
    if (authError || !authData.user) {
      return json({ error: "Nao autorizado" }, 401);
    }

    const { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return json({ error: "Acesso restrito a administradores" }, 403);
    }

    const result = await sendOrderStatusEmail(serviceClient, {
      orderId,
      previousStatus,
      newStatus,
      source: source || "admin",
    });

    return json(result);
  } catch (error) {
    console.error("[send_order_status_email] Erro:", error);
    return json(
      { error: error instanceof Error ? error.message : "Erro ao enviar e-mail" },
      500,
    );
  }
});
