import { useState } from 'react';
import {
  FiMail,
  FiMessageSquare,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [noReply, setNoReply] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');
    setIsError(false);

    if (!noReply && !email.trim()) {
      setStatus('メールアドレスを入力してください。');
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (message.trim().length === 0) {
      setStatus('お問い合わせ内容を入力してください。');
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (message.length > 100) {
      setStatus('お問い合わせ内容は100文字以内にしてください。');
      setIsError(true);
      setIsLoading(false);
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
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus('通信エラーが発生しました。');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-800 p-8 rounded-2xl shadow-2xl border border-zinc-700 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-6">お問い合わせフォーム</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              <span className="inline-flex items-center gap-1">
                <FiMail />
                メールアドレス（返信不要な場合は不要）
              </span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={noReply}
              placeholder="example@mail.com"
              className={`w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 border ${isError && !noReply && !email.trim() ? 'border-red-500' : 'border-zinc-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
          </div>

          <label htmlFor="noReply" className="flex items-center text-sm gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="noReply"
              checked={noReply}
              onChange={(e) => setNoReply(e.target.checked)}
              className="h-5 w-5 text-blue-600 bg-zinc-800 border border-zinc-500 rounded focus:ring-blue-500"
            />
            返信を希望しない
          </label>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              <span className="inline-flex items-center gap-1">
                <FiMessageSquare />
                お問い合わせ内容（100文字まで）
              </span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
              required
              placeholder="ご質問やご要望などをご記入ください"
              className={`w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-gray-400 border ${isError && message.trim().length === 0 ? 'border-red-500' : 'border-zinc-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y transition`}
            ></textarea>
            <div className="text-right text-xs text-gray-400 mt-1">{message.length} / 100</div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition text-white font-semibold shadow-md"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <FiSend />
                送信
              </>
            )}
          </button>

          {status && (
            <p
              className={`mt-2 p-4 rounded-lg flex items-center gap-2 text-sm font-medium border ${
                isError
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-emerald-100 text-emerald-700 border-emerald-300'
              }`}
            >
              {isError ? <FiAlertCircle /> : <FiCheckCircle />}
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}