# AI旅行プランナー

Claude AIが旅行プランを自動生成するWebアプリケーション。

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
cd travel-planner
npm run install:all
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` ファイルを編集し、`ANTHROPIC_API_KEY` に実際のAPIキーを設定してください。

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

APIキーは https://console.anthropic.com/ から取得できます。

### 3. アプリの起動

```bash
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3001

### 4. 使い方

1. 行き先（都道府県・都市名）を入力
2. 旅行日数・人数・スタイルを選択
3. 「プランを生成する」ボタンをクリック
4. AIが生成した旅行プランが表示されます

## 技術スタック

- フロントエンド: React + Vite + Tailwind CSS
- バックエンド: Express.js
- AI: Claude API (@anthropic-ai/sdk)
