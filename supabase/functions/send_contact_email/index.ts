const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ContactPayload = {
  name?: string;
  email?: string;
  orderNumber?: string;
  message?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Metodo nao permitido" }, 405);
  }

  try {
    const payload = await req.json() as ContactPayload;
    const name = payload.name?.trim() || "";
    const email = payload.email?.trim().toLowerCase() || "";
    const orderNumber = payload.orderNumber?.trim() || "";
    const message = payload.message?.trim() || "";

    if (!name || !email || !message) {
      return json({ error: "Nome, e-mail e mensagem sao obrigatorios" }, 400);
    }

    if (!isValidEmail(email)) {
      return json({ error: "E-mail invalido" }, 400);
    }

    if (message.length > 5000) {
      return json({ error: "Mensagem muito longa" }, 400);
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const from = Deno.env.get("CONTACT_EMAIL_FROM") || Deno.env.get("RESEND_FROM_EMAIL");
    const to = Deno.env.get("CONTACT_EMAIL_TO") || Deno.env.get("SUPPORT_EMAIL") || "contato@kidsblockstore.com.br";

    if (!resendApiKey || !from) {
      console.warn("[send_contact_email] RESEND_API_KEY ou CONTACT_EMAIL_FROM nao configurado.");
      return json({ error: "Envio de e-mail nao configurado" }, 500);
    }

    const subject = orderNumber
      ? `Contato QBLOX - Pedido ${orderNumber}`
      : "Contato QBLOX - Central de Ajuda";

    const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#0057D9;color:#ffffff;padding:24px;">
                <h1 style="margin:0;font-size:22px;line-height:1.3;">QBLOX KIDS</h1>
                <p style="margin:6px 0 0;font-size:14px;">Nova mensagem da Central de Ajuda</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;">
                <p style="margin:0 0 10px;"><strong>Nome:</strong> ${escapeHtml(name)}</p>
                <p style="margin:0 0 10px;"><strong>E-mail:</strong> ${escapeHtml(email)}</p>
                ${orderNumber ? `<p style="margin:0 0 10px;"><strong>Pedido:</strong> ${escapeHtml(orderNumber)}</p>` : ""}
                <div style="margin-top:22px;padding:18px;background:#f9fafb;border-radius:10px;line-height:1.55;white-space:pre-wrap;">${escapeHtml(message)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject,
        html,
        tags: [
          { name: "type", value: "contact_form" },
          { name: "source", value: "help_center" },
        ],
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[send_contact_email] Erro ao enviar e-mail:", result);
      return json({ error: "Falha ao enviar e-mail", provider: result }, 502);
    }

    return json({ sent: true });
  } catch (error) {
    console.error("[send_contact_email] Erro:", error);
    return json({ error: error instanceof Error ? error.message : "Erro ao enviar mensagem" }, 500);
  }
});
