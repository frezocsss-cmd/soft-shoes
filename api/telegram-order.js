export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!botToken || !adminChatId) {
    return res.status(500).json({ error: "Telegram not configured" });
  }

  let payload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: message,
          disable_web_page_preview: true,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok || !data.ok) {
      return res.status(502).json({ error: "Failed to send message" });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Failed to send message" });
  }
}
