// pages/api/contact.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, noReply, message } = req.body;

  if (!message || message.length > 100) {
    return res.status(400).json({ message: 'お問い合わせ内容は100文字以内にしてください。' });
  }

  if (!noReply && !email) {
    return res.status(400).json({ message: 'メールアドレスは必須です。' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const resendApiKey = process.env.RESEND_API_KEY;

  // Discord Webhookに送信
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `**新しいお問い合わせが届きました！**\n\n**返信不要：** ${noReply ? 'はい' : 'いいえ'}\n**メール：** ${email || 'なし'}\n**内容：**\n${message}`
      }),
    });
  } catch (err) {
    console.error('Discord送信失敗:', err);
    return res.status(500).json({ message: 'Discord送信に失敗しました。' });
  }

  // 返信が必要なら Resendでメール送信
  if (!noReply) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'no-reply@yourdomain.com', // Resendで許可された送信元
          to: email,
          subject: 'お問い合わせありがとうございます',
          html: `<p>お問い合わせありがとうございます。</p><p>内容：${message}</p><p>担当より折り返しご連絡します。</p>`,
        }),
      });
    } catch (err) {
      console.error('Resend送信失敗:', err);
      return res.status(500).json({ message: 'メール送信に失敗しました。' });
    }
  }

  return res.status(200).json({ message: '送信が完了しました。ありがとうございました！' });
}
