// pages/contact.jsx
import { useState } from 'react';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [noReply, setNoReply] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noReply && !email) {
      setStatus('メールアドレスを入力してください。');
      return;
    }
    if (message.length > 100) {
      setStatus('お問い合わせ内容は100文字以内にしてください。');
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, noReply, message }),
    });

    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>お問い合わせフォーム</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          メールアドレス（返信を希望しない場合は不要）
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={noReply}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={noReply}
            onChange={(e) => setNoReply(e.target.checked)}
          />
          返信を希望しない
        </label>

        <label>
          お問い合わせ内容（100文字まで）
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={100}
            required
            style={{ width: '100%', padding: '0.5rem', height: '100px' }}
          />
        </label>

        <button type="submit" style={{ padding: '0.7rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
          送信
        </button>

        {status && <p>{status}</p>}
      </form>
    </main>
  );
      }
