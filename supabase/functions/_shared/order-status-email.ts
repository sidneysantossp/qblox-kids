import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";

type OrderStatusEmailOptions = {
  orderId: string;
  previousStatus?: string | null;
  newStatus: string;
  source?: string;
};

type OrderRecord = {
  id: string;
  user_id?: string | null;
  status: string;
  total_amount?: number | string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  shipping_address?: Record<string, unknown> | null;
  created_at?: string | null;
};

const statusLabels: Record<string, string> = {
  pending: "Aguardando pagamento",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  completed: "Confirmado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const statusMessages: Record<string, string> = {
  pending: "Seu pedido foi registrado e esta aguardando a confirmacao do pagamento.",
  processing: "Seu pedido ja esta em separacao e sera preparado para envio.",
  shipped: "Seu pedido foi enviado. Em breve voce podera acompanhar a entrega.",
  delivered: "Seu pedido foi marcado como entregue. Obrigado por comprar com a QBLOX KIDS.",
  completed: "O pagamento foi confirmado e seu pedido ja pode seguir para processamento.",
  cancelled: "Seu pedido foi cancelado. Caso tenha duvidas, fale com nosso atendimento.",
  refunded: "Seu pedido foi marcado como reembolsado. Caso tenha duvidas, fale com nosso atendimento.",
};

function getOrderNumber(orderId: string) {
  return `#${orderId.replace(/[^0-9a-f]/gi, "").slice(-8).toUpperCase()}`;
}

function formatCurrency(value?: number | string | null) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getCustomerEmail(supabase: SupabaseClient, order: OrderRecord) {
  if (order.customer_email) return order.customer_email;
  if (!order.user_id) return null;

  const { data, error } = await supabase.auth.admin.getUserById(order.user_id);
  if (error) {
    console.error("[order-status-email] Erro ao buscar e-mail do usuario:", error);
    return null;
  }

  return data.user?.email ?? null;
}

function getCustomerName(order: OrderRecord) {
  if (order.customer_name) return order.customer_name;

  const address = order.shipping_address ?? {};
  const name = address.name || address.full_name || address.recipient;
  return typeof name === "string" && name.trim() ? name : "Cliente";
}

function buildEmailHtml(order: OrderRecord, previousStatus: string | null | undefined, newStatus: string) {
  const orderNumber = getOrderNumber(order.id);
  const statusLabel = statusLabels[newStatus] || newStatus;
  const previousLabel = previousStatus ? statusLabels[previousStatus] || previousStatus : null;
  const siteUrl = Deno.env.get("SITE_URL") || "https://qblox.com.br";
  const orderUrl = `${siteUrl.replace(/\/$/, "")}/meus-pedidos`;
  const customerName = escapeHtml(getCustomerName(order));

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Status do pedido ${escapeHtml(orderNumber)}</title>
  </head>
  <body style="margin:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#0057D9;color:#ffffff;padding:24px;">
                <h1 style="margin:0;font-size:22px;line-height:1.3;">QBLOX KIDS</h1>
                <p style="margin:6px 0 0;font-size:14px;">Atualizacao do seu pedido</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;">
                <p style="margin:0 0 16px;font-size:16px;">Ola, ${customerName}.</p>
                <p style="margin:0 0 18px;font-size:16px;line-height:1.5;">${escapeHtml(statusMessages[newStatus] || "O status do seu pedido foi atualizado.")}</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:20px 0;background:#f9fafb;border-radius:10px;">
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#6b7280;">Pedido</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">${escapeHtml(orderNumber)}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#6b7280;">Status atual</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">${escapeHtml(statusLabel)}</td>
                  </tr>
                  ${previousLabel ? `<tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#6b7280;">Status anterior</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;text-align:right;">${escapeHtml(previousLabel)}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding:14px 16px;font-size:14px;color:#6b7280;">Total</td>
                    <td style="padding:14px 16px;text-align:right;font-weight:700;">${escapeHtml(formatCurrency(order.total_amount))}</td>
                  </tr>
                </table>
                <p style="margin:24px 0;">
                  <a href="${escapeHtml(orderUrl)}" style="display:inline-block;background:#FFD200;color:#111827;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:8px;">Acompanhar pedido</a>
                </p>
                <p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">Se voce nao reconhece este pedido ou precisa de ajuda, responda este e-mail ou fale com nosso atendimento.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendOrderStatusEmail(
  supabase: SupabaseClient,
  options: OrderStatusEmailOptions,
) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("ORDER_EMAIL_FROM") || Deno.env.get("RESEND_FROM_EMAIL");
  const replyTo = Deno.env.get("ORDER_EMAIL_REPLY_TO") || Deno.env.get("SUPPORT_EMAIL");

  if (!resendApiKey || !from) {
    console.warn("[order-status-email] RESEND_API_KEY ou ORDER_EMAIL_FROM nao configurado.");
    return { sent: false, skipped: true, reason: "missing_email_config" };
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", options.orderId)
    .single();

  if (error || !order) {
    console.error("[order-status-email] Pedido nao encontrado:", error);
    return { sent: false, skipped: true, reason: "order_not_found" };
  }

  const orderRecord = order as OrderRecord;
  const to = await getCustomerEmail(supabase, orderRecord);
  if (!to) {
    console.warn("[order-status-email] Pedido sem e-mail de cliente:", options.orderId);
    return { sent: false, skipped: true, reason: "missing_customer_email" };
  }

  const orderNumber = getOrderNumber(orderRecord.id);
  const statusLabel = statusLabels[options.newStatus] || options.newStatus;
  const subject = `Pedido ${orderNumber}: ${statusLabel}`;
  const html = buildEmailHtml(orderRecord, options.previousStatus, options.newStatus);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: replyTo || undefined,
        subject,
        html,
        tags: [
          { name: "type", value: "order_status" },
          { name: "status", value: options.newStatus },
          { name: "source", value: options.source || "unknown" },
        ],
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[order-status-email] Erro ao enviar e-mail:", result);
      return { sent: false, skipped: false, reason: "provider_error", provider: result };
    }

    return { sent: true, provider: result };
  } catch (error) {
    console.error("[order-status-email] Falha de conexao ao enviar e-mail:", error);
    return { sent: false, skipped: false, reason: "network_error" };
  }
}
