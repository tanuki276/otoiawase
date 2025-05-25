// pages/api/contact.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, noReply, message } = req.body;
  if (!noReply && (!email || !email.includes('@'))) {
    return res.status(400).json({ error: 'メールアドレスが無効です。' });
  }
  if (!message || message.length > 100) {
    return res.status(400).json({ error: 'お問い合わせ内容が無効です。' });
  }

  try {
    // Discord Webhook送信
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `新しいお問い合わせがあります。\nメールアドレス: ${noReply ? '返信不要' : email}\n内容: ${message}`,
      }),
    });

    // resend.com で返信メール送信
    if (!noReply) {
      const resendApiKey = process.env.RESEND_API_KEY;
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'your-email@example.com',  // 送信元メールアドレス（env化推奨）
          to: [email],
          subject: 'お問い合わせありがとうございます',
          html: `<p>お問い合わせありがとうございます。以下の内容を受け付けました。</p><p>${message}</p>`,
        }),
      });
    }

    res.status(200).json({ message: '送信成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '送信処理でエラーが発生しました。' });
  }
}
