# 開発メモ

## 作業日: 2026-04-04

---

## やったこと

### アプリ概要
Claude API を使った旅行プランナー Web アプリを新規作成。
行き先・日数・スタイル・人数・予算を入力すると旅行プランを自動生成する。

### 技術構成
- フロントエンド: React + Vite + Tailwind CSS
- バックエンド: Express.js → Vercel Serverless Function に変換
- AI: Anthropic Claude API（claude-haiku-4-5）
- デプロイ: Vercel + GitHub

### 開発フロー
Planner → Generator → Evaluator の3エージェントを使って開発。
- Planner: 仕様書作成
- Generator: コード実装
- Evaluator: 品質評価（全受け入れ基準クリア）

### 実装した機能
- 行き先・旅行日数・旅行スタイル・人数の入力フォーム
- 1日あたり予算選択（1万円以下 / 2万円程度 / 3〜5万円 / 5万円以上）
- Claude API によるプラン生成（Day 別カード表示）
- プランの再生成ボタン
- プランのコピーボタン

### デザイン
ネイビー × ゴールド × クリームの高級感あるカラーパレット。
星ドット装飾ヘッダー、ゴールドグラデーションボタン。

### モデル変更
claude-opus-4-5 → claude-haiku-4-5 に変更（コスト削減）。
1,000回生成あたりの推定コスト: 約 $140 → 約 $3。

### デプロイ
- GitHub: https://github.com/kohei0308/travel_AI
- Vercel: https://travel-ai-psi-five.vercel.app/
- 環境変数: ANTHROPIC_API_KEY を Vercel に設定

### ハマったこと
- vercel.json の rewrite ルールが `/api/*` も `index.html` に向けてしまいAPIが動かなかった
  → `/((?!api/).*)` に修正して解決
