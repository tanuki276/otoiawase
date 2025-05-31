import { useState } from 'react';
import { MdEmail, MdCheckBox, MdSend, MdErrorOutline, MdCheckCircleOutline } from 'react-icons/md';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [noReply, setNoReply] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!noReply && !email.trim()) {
      setError('メールアドレスは必須です。返信を希望しない場合はチェックしてください。');
      setSuccess('');
      return false;
    }
    if (message.trim().length === 0) {
      setError('お問い合わせ内容を入力してください。');
      setSuccess('');
      return false;
    }
    if (message.length > 100) {
      setError('お問い合わせ内容は100文字以内でお願いします。');
      setSuccess('');
      return false;
    }
    setError('');
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, noReply, message }),
      });
      if (res.ok) {
        setSuccess('送信が完了しました！');
        setError('');
        setEmail('');
        setNoReply(false);
        setMessage('');
      } else {
        setError('送信中にエラーが発生しました。');
        setSuccess('');
      }
    } catch {
      setError('通信エラーが発生しました。');
      setSuccess('');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 420,
        margin: '2rem auto',
        padding: '1.5rem 2rem',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #f9fafb 0%, #e0e7ff 100%)',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Helvetica, Arial, sans-serif',
        color: '#333',
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="email"
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}
        >
          <MdEmail size={20} color="#555" />
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled={noReply}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          style={{
            width: '100%',
            marginTop: 6,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1.5px solid #cbd5e1',
            fontSize: 15,
            outline: 'none',
            transition: 'border-color 0.25s ease',
            backgroundColor: noReply ? '#f0f2f7' : '#fff',
            color: '#111',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#7f9cf5')}
          onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            cursor: 'pointer',
            userSelect: 'none',
            color: '#555',
          }}
        >
          <input
            type="checkbox"
            checked={noReply}
            onChange={() => setNoReply(!noReply)}
            style={{ cursor: 'pointer', width: 18, height: 18 }}
          />
          <MdCheckBox size={20} color="#7f9cf5" />
          返信を希望しない
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="message"
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}
        >
          <MdSend size={20} color="#555" />
          お問い合わせ内容（100文字まで）
        </label>
        <textarea
          id="message"
          value={message}
          maxLength={100}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="ここにご質問・ご要望を入力してください"
          style={{
            width: '100%',
            marginTop: 6,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1.5px solid #cbd5e1',
            fontSize: 15,
            outline: 'none',
            resize: 'vertical',
            backgroundColor: '#fff',
            color: '#111',
            transition: 'border-color 0.25s ease',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#7f9cf5')}
          onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
        />
      </div>

      {error && (
        <p
          style={{
            color: '#e53e3e',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          <MdErrorOutline size={20} />
          {error}
        </p>
      )}

      {success && (
        <p
          style={{
            color: '#38a169',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          <MdCheckCircleOutline size={20} />
          {success}
        </p>
      )}

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px 0',
          borderRadius: 8,
          border: 'none',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
          transition: 'background 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(90deg, #5a67d8 0%, #6b46c1 100%)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)')}
      >
        送信
      </button>
    </form>
  );
}