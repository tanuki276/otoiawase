// components/ContactForm.jsx
import { useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [noReply, setNoReply] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!noReply && !email) {
      setError('メールアドレスは必須です。返信を希望しない場合はチェックしてください。');
      return false;
    }
    if (message.length === 0) {
      setError('お問い合わせ内容を入力してください。');
      return false;
    }
    if (message.length > 100) {
      setError('お問い合わせ内容は100文字以内でお願いします。');
      return false;
    }
    setError('');
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, noReply, message }),
    });

    if (res.ok) {
      setSuccess('送信が完了しました！');
      setEmail('');
      setNoReply(false);
      setMessage('');
    } else {
      setError('送信中にエラーが発生しました。');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>メールアドレス</label><br />
        <input
          type="email"
          value={email}
          disabled={noReply}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={noReply}
            onChange={() => setNoReply(!noReply)}
          /> 返信を希望しない
        </label>
      </div>
      <div>
        <label>お問い合わせ内容（100文字まで）</label><br />
        <textarea
          value={message}
          maxLength={100}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button type="submit">送信</button>
    </form>
  );
    }
