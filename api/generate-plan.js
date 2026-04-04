import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const styleLabels = {
  sightseeing: "観光重視",
  gourmet: "グルメ重視",
  nature: "自然・アウトドア重視",
  balanced: "バランス型",
};

const budgetLabels = {
  under10k: "1万円以下（お一人様あたり1日の目安）",
  around20k: "2万円程度（お一人様あたり1日の目安）",
  "30k_50k": "3万〜5万円（お一人様あたり1日の目安）",
  over50k: "5万円以上（お一人様あたり1日の目安）",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { destination, days, style, people, budget } = req.body;

  if (!destination || destination.trim() === "") {
    return res.status(400).json({ error: "行き先を入力してください。" });
  }

  const daysNum = parseInt(days, 10);
  const peopleNum = parseInt(people, 10);
  if (isNaN(daysNum) || daysNum < 1 || daysNum > 7) {
    return res.status(400).json({ error: "旅行日数は1〜7日の範囲で指定してください。" });
  }
  if (isNaN(peopleNum) || peopleNum < 1 || peopleNum > 10) {
    return res.status(400).json({ error: "人数は1〜10名の範囲で指定してください。" });
  }
  if (destination.trim().length > 100) {
    return res.status(400).json({ error: "行き先は100文字以内で入力してください。" });
  }

  const styleLabel = styleLabels[style] || "バランス型";
  const budgetLabel = budgetLabels[budget] || "2万円程度（お一人様あたり1日の目安）";

  const prompt = `あなたはプロの旅行プランナーです。以下の条件で旅行プランを作成してください。

【旅行条件】
- 行き先: ${destination}
- 旅行日数: ${days}日間
- 旅行スタイル: ${styleLabel}
- 人数: ${people}名
- 1日あたり予算: ${budgetLabel}

【出力形式】
必ず以下の形式で、${days}日分の旅行プランを作成してください。各日程は「## Day X」の見出しで始めてください。

## Day 1
**午前**
- スポット名: [具体的なスポット名]
- アクティビティ: [詳細な説明]
- 移動手段: [アクセス方法]

**午後**
- スポット名: [具体的なスポット名]
- アクティビティ: [詳細な説明]

**夜**
- スポット名: [具体的なスポット名]
- アクティビティ: [夕食・ナイトスポットなど]

**この日のポイント**: [一言まとめ]

---

（Day 2以降も同じ形式で続ける）

【注意事項】
- 実在する具体的なスポット名・レストラン名・施設名を使用してください
- ${styleLabel}に合わせた内容にしてください
- ${people}名での旅行に適した提案をしてください
- 予算${budgetLabel}に見合った宿泊施設・飲食店・アクティビティを提案してください
- 移動手段（電車・バス・タクシー・徒歩など）を少なくとも各日1つ以上記載してください
- 日本語で回答してください
- 各日程の最後に「---」区切り線を入れてください`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: Math.min(daysNum * 800 + 1000, 4096),
      messages: [{ role: "user", content: prompt }],
    });

    const planText =
      message.content[0].type === "text" ? message.content[0].text : "";

    res.json({ plan: planText, destination, days, style: styleLabel, people, budget });
  } catch (error) {
    if (error.status === 401) {
      res.status(500).json({ error: "APIキーが無効です。" });
    } else if (error.status === 429) {
      res.status(429).json({ error: "APIのリクエスト制限に達しました。しばらく待ってから再試行してください。" });
    } else {
      res.status(500).json({ error: "旅行プランの生成中にエラーが発生しました。しばらく待ってから再試行してください。" });
    }
  }
}
