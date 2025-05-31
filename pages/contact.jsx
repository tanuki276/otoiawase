import { useState } from 'react';
// import { FiMail, FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [noReply, setNoReply] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 送信中の状態を追加

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 送信開始
    setStatus(''); // ステータスをリセット
    setIsError(false); // エラー状態をリセット

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
      setIsLoading(false); // 送信終了
    }
  };

  return (
    <main className="max-w-md mx-auto my-8 p-6 bg-white shadow-lg rounded-lg animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">お問い合わせフォーム</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* メールアドレス入力欄 */}
        <div className="relative">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
            メールアドレス（返信不要な場合は不要）
          </label>
          {/* <FiMail className="absolute left-3 top-10 text-gray-400" /> */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={noReply}
            placeholder="example@mail.com"
            className={`w-full px-4 py-2 pl-4 border ${isError && !noReply && !email.trim() ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out ${noReply ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
        </div>

        {/* 返信を希望しないチェックボックス */}
        <label htmlFor="noReply" className="flex items-center text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            id="noReply"
            checked={noReply}
            onChange={(e) => setNoReply(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 transition-all duration-200 ease-in-out"
          />
          <span className="ml-2">返信を希望しない</span>
        </label>

        {/* お問い合わせ内容入力欄 */}
        <div className="relative">
          <label htmlFor="message" className="block text-gray-700 font-semibold mb-1">
            お問い合わせ内容（100文字まで）
          </label>
          {/* <FiMessageSquare className="absolute left-3 top-10 text-gray-400" /> */}
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={100}
            required
            placeholder="ここにご質問・ご要望を入力してください"
            className={`w-full px-4 py-2 pl-4 h-32 border ${isError && message.trim().length === 0 ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out resize-y`}
          ></textarea>
          <div className="text-sm text-gray-500 mt-1 text-right">
            {message.length} / 100
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading} // 送信中はボタンを無効化
        >
          {isLoading ? (
            <>
              {/* <FiLoader className="animate-spin" /> */}
              <span>送信中...</span>
            </>
          ) : (
            <>
              {/* <FiSend /> */}
              <span>送信</span>
            </>
          )}
        </button>

        {/* ステータスメッセージ */}
        {status && (
          <p className={`mt-4 p-4 rounded-lg flex items-center gap-2 animate-fade-in ${isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
            {isError ? (
              // <FiAlertCircle className="text-xl" />
              <span>⚠️</span> // アイコンの代替
            ) : (
              // <FiCheckCircle className="text-xl" />
              <span>✅</span> // アイコンの代替
            )}
            {status}
          </p>
        )}
      </form>
    </main>
  );
}

