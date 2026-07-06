// このファイルはブラウザではなく、Vercelのサーバー側だけで実行される。
// APIキーはここでしか使われないので、部員に配るURLやフロント側のコードには一切現れない。

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Vercelのプロジェクト設定 → Environment Variables で
  // GEMINI_API_KEY という名前で登録した値がここに入る
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(500).json({
      error: 'サーバーにAPIキーが設定されていません。Vercelの Environment Variables に GEMINI_API_KEY を登録してください。'
    });
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ブラウザ側(index.html)から送られてきた contents や tools を
        // そのままGoogleへ横流しする
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
