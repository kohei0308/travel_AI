import { useState } from "react";

// マークダウンをDay単位に分割してパース
function parsePlan(planText) {
  const dayRegex = /##\s*Day\s*(\d+)/gi;
  const days = [];
  const matches = [...planText.matchAll(dayRegex)];

  matches.forEach((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? planText.length;
    const content = planText.slice(start, end).trim();
    days.push({
      dayNumber: parseInt(match[1], 10),
      content: content,
    });
  });

  if (days.length === 0) {
    days.push({ dayNumber: 1, content: planText });
  }

  return days;
}

// **太字** のインラインパース
function formatInlineText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 700, color: "#1e293b" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// シンプルなマークダウン→JSX レンダラー
function renderDayContent(content) {
  const lines = content.split("\n").slice(1);
  const result = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") continue;

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      const text = trimmed.slice(2, -2);
      const isTimeSlot = ["午前", "午後", "夜"].some((t) => text.startsWith(t));
      result.push(
        <div
          key={key++}
          style={
            isTimeSlot
              ? {
                  marginTop: "20px",
                  marginBottom: "8px",
                  fontWeight: 700,
                  color: "#b45309",
                  fontSize: "0.95rem",
                  borderLeft: "3px solid #f59e0b",
                  paddingLeft: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(90deg, rgba(254,243,199,0.6) 0%, transparent 100%)",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0 6px 6px 0",
                }
              : {
                  marginTop: "12px",
                  marginBottom: "4px",
                  fontWeight: 700,
                  color: "#64748b",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }
          }
        >
          {isTimeSlot ? (
            <>
              <span>
                {text.startsWith("午前")
                  ? "☀️"
                  : text.startsWith("午後")
                  ? "🌤️"
                  : "🌙"}
              </span>
              {text}
            </>
          ) : (
            text
          )}
        </div>
      );
    } else if (trimmed.startsWith("- ")) {
      const text = trimmed.slice(2);
      const isTransport =
        text.includes("移動手段") ||
        text.includes("アクセス") ||
        text.includes("電車") ||
        text.includes("バス") ||
        text.includes("タクシー") ||
        text.includes("徒歩") ||
        text.includes("JR") ||
        text.includes("地下鉄");

      result.push(
        <div
          key={key++}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            fontSize: "0.875rem",
            paddingTop: "3px",
            paddingBottom: "3px",
            color: isTransport ? "#2563eb" : "#374151",
          }}
        >
          <span style={{ flexShrink: 0, marginTop: "2px" }}>
            {isTransport ? "🚃" : "·"}
          </span>
          <span>{formatInlineText(text)}</span>
        </div>
      );
    } else if (trimmed) {
      result.push(
        <p
          key={key++}
          style={{
            fontSize: "0.875rem",
            color: "#4b5563",
            marginTop: "4px",
            marginBottom: "4px",
            lineHeight: 1.7,
          }}
        >
          {trimmed}
        </p>
      );
    }
  }

  return result;
}

// 予算ラベル
const BUDGET_LABELS = {
  under10k: { label: "1万円以下／日", icon: "💴" },
  around20k: { label: "2万円程度／日", icon: "💳" },
  "30k_50k": { label: "3〜5万円／日", icon: "💎" },
  over50k: { label: "5万円以上／日", icon: "👑" },
};

// Day カードの差し色（ネイビー系）
const DAY_ACCENTS = [
  { from: "#1e3a8a", to: "#1e293b" },
  { from: "#0f172a", to: "#1e3a8a" },
  { from: "#1e293b", to: "#374151" },
  { from: "#1e3a8a", to: "#374151" },
  { from: "#0f172a", to: "#1e293b" },
  { from: "#1e293b", to: "#1e3a8a" },
  { from: "#374151", to: "#1e3a8a" },
];

export default function TravelPlan({ plan, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const days = parsePlan(plan.plan);
  const budgetInfo = BUDGET_LABELS[plan.budget] || null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plan.plan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = plan.plan;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mt-10 animate-fade-in">
      {/* プランヘッダー */}
      <div
        className="rounded-2xl p-6 mb-8 shadow-luxury"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #1e3a8a 100%)",
          border: "1px solid rgba(245,158,11,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 背景グロー */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(245,158,11,0.15)",
                  color: "#fcd34d",
                  border: "1px solid rgba(245,158,11,0.3)",
                }}
              >
                Generated Plan
              </span>
            </div>
            <h2
              className="text-2xl font-bold flex items-center gap-2 mt-1"
              style={{ color: "#ffffff" }}
            >
              <span>🗾</span>
              {plan.destination} 旅行プラン
            </h2>

            {/* 条件バッジ群 */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                📅 {plan.days}日間
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                👥 {plan.people}名
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                🎯 {plan.style}
              </span>
              {budgetInfo && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: "rgba(245,158,11,0.2)",
                    color: "#fcd34d",
                    border: "1px solid rgba(245,158,11,0.4)",
                  }}
                >
                  {budgetInfo.icon} {budgetInfo.label}
                </span>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={onRegenerate}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#e2e8f0",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
            >
              <span>🔄</span>
              <span className="hidden sm:inline">別のプランを提案</span>
              <span className="sm:hidden">再生成</span>
            </button>

            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: copied
                  ? "rgba(34,197,94,0.8)"
                  : "linear-gradient(135deg, #f59e0b, #d97706)",
                border: "none",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: copied
                  ? "0 2px 8px rgba(34,197,94,0.3)"
                  : "0 2px 10px rgba(245,158,11,0.4)",
              }}
            >
              <span>{copied ? "✅" : "📋"}</span>
              <span className="hidden sm:inline">
                {copied ? "コピーしました！" : "プランをコピー"}
              </span>
              <span className="sm:hidden">{copied ? "完了" : "コピー"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 日程カード一覧 */}
      <div className="space-y-5">
        {days.map((day, index) => {
          const accent = DAY_ACCENTS[index % DAY_ACCENTS.length];
          return (
            <div
              key={day.dayNumber}
              className="animate-slide-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                background: "#ffffff",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow:
                  "0 4px 6px rgba(15,23,42,0.04), 0 10px 30px rgba(15,23,42,0.08)",
                border: "1px solid rgba(245,158,11,0.12)",
              }}
            >
              {/* カードヘッダー */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
                  padding: "16px 24px",
                  borderBottom: "2px solid rgba(245,158,11,0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(245,158,11,0.2)",
                    border: "2px solid rgba(245,158,11,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fcd34d",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  {day.dayNumber}
                </span>
                <h3
                  style={{
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  Day {day.dayNumber}
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "0.7rem",
                      fontWeight: 400,
                      color: "#94a3b8",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {index + 1} / {days.length}
                  </span>
                </h3>
              </div>

              {/* カード本文 */}
              <div style={{ padding: "20px 24px 24px" }}>
                {renderDayContent(day.content)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 下部ボタンエリア */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRegenerate}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
            color: "#ffffff",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "14px",
            padding: "14px 32px",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(15,23,42,0.3)",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.3)";
          }}
        >
          <span>🔄</span>
          別のプランを提案する
        </button>

        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: copied
              ? "#22c55e"
              : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "14px",
            padding: "14px 32px",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: copied
              ? "0 4px 16px rgba(34,197,94,0.35)"
              : "0 4px 16px rgba(245,158,11,0.4)",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(245,158,11,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(245,158,11,0.4)";
            }
          }}
        >
          <span>{copied ? "✅" : "📋"}</span>
          {copied ? "コピーしました！" : "プランをコピーする"}
        </button>
      </div>

      {/* 注意事項 */}
      <div
        className="mt-6"
        style={{
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "14px",
          padding: "14px 18px",
        }}
      >
        <p
          className="text-sm flex items-start gap-2"
          style={{ color: "#92400e" }}
        >
          <span style={{ flexShrink: 0 }}>ℹ️</span>
          このプランはAIが生成した提案です。実際の営業時間・定休日・料金・予約状況は必ず事前にご確認ください。
        </p>
      </div>
    </div>
  );
}
