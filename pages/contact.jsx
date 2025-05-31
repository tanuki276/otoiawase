import { useState } from 'react';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [noReply, setNoReply] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noReply && !email.trim()) {
      setStatus('メールアドレスを入力してください。');
      setIsError(true);
      return;
    }
    if (message.trim().length === 0) {
      setStatus('お問い合わせ内容を入力してください。');
      setIsError(true);
      return;
    }
    if (message.length > 100) {
      setStatus('お問い合わせ内容は100文字以内にしてください。');
      setIsError(true);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, noReply, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('送信が完了しました！ありがとうございます。');
        setIsError(false);
        setEmail('');
        setNoReply(false);
        setMessage('');
      } else {
        setStatus(data.message || '送信中にエラーが発生しました。');
        setIsError(true);
      }
    } catch {
      setStatus('通信エラーが発生しました。');
      setIsError(true);
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>お問い合わせフォーム</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', fontSize: '1rem' }}>
          メールアドレス（返信を希望しない場合は不要）
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={noReply}
            placeholder="example@mail.com"
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              marginTop: '0.3rem',
              borderRadius: '6px',
              border: '1.5px solid #ccc',
              fontSize: '1rem',
              outline: 'none',
              backgroundColor: noReply ? '#f5f5f5' : 'white',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#0070f3')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.95rem', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={noReply}
            onChange={(e) => setNoReply(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          返信を希望しない
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', fontSize: '1rem' }}>
          お問い合わせ内容（100文字まで）
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={100}
            required
            placeholder="ここにご質問・ご要望を入力してください"
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              marginTop: '0.3rem',
              height: '110px',
              borderRadius: '6px',
              border: '1.5px solid #ccc',
              fontSize: '1rem',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#0070f3')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: '0.8rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            fontWeight: '700',
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 112, 243, 0.5)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#005bb5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
        >
          送信
        </button>

        {status && (
          <p
            style={{
              marginTop: '1rem',
              padding: '0.7rem 1rem',
              borderRadius: '6px',
              backgroundColor: isError ? '#ffe5e5' : '#e5ffe5',
              color: isError ? '#d32f2f' : '#2e7d32',
              fontWeight: '600',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            {status}
          </p>
        )}
      </form>
    </main>
  );
}