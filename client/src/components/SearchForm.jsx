import { useState } from "react";

const TRAVEL_STYLES = [
  { value: "sightseeing", label: "観光重視", icon: "🏛️" },
  { value: "gourmet", label: "グルメ重視", icon: "🍜" },
  { value: "nature", label: "自然・アウトドア重視", icon: "🌿" },
  { value: "balanced", label: "バランス型", icon: "⚖️" },
];

const BUDGET_OPTIONS = [
  { value: "under10k", label: "1万円以下", icon: "💴", sub: "／1日" },
  { value: "around20k", label: "2万円程度", icon: "💳", sub: "／1日" },
  { value: "30k_50k", label: "3〜5万円", icon: "💎", sub: "／1日" },
  { value: "over50k", label: "5万円以上", icon: "👑", sub: "／1日" },
];

/* インラインスタイル定数 */
const S = {
  card: {
    background: "#ffffff",
    border: "1px solid rgba(245,158,11,0.15)",
    borderRadius: "20px",
    boxShadow:
      "0 4px 6px rgba(15,23,42,0.04), 0 10px 30px rgba(15,23,42,0.08)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a8a 100%)",
    borderBottom: "1px solid rgba(245,158,11,0.3)",
  },
  label: {
    color: "#1e293b",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.03em",
  },
  input: {
    background: "#fffbeb",
    border: "1.5px solid #fde68a",
    borderRadius: "12px",
    color: "#1e293b",
    transition: "all 0.2s",
    outline: "none",
  },
  inputFocus: {
    border: "1.5px solid #f59e0b",
    boxShadow: "0 0 0 3px rgba(245,158,11,0.18)",
  },
  inputError: {
    background: "#fff5f5",
    border: "1.5px solid #fc8181",
  },
  selectBase: {
    background: "#fffbeb",
    border: "1.5px solid #fde68a",
    borderRadius: "12px",
    color: "#1e293b",
    transition: "all 0.2s",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
  },
};

function CardButton({ selected, disabled, onClick, icon, label, sub, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "14px 8px",
        borderRadius: "14px",
        border: selected ? "2px solid #f59e0b" : "2px solid #e2e8f0",
        background: selected
          ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
          : "#ffffff",
        color: selected ? "#b45309" : "#64748b",
        boxShadow: selected ? "0 2px 12px rgba(245,158,11,0.25)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>
        {label}
      </span>
      {sub && (
        <span style={{ fontSize: "0.65rem", opacity: 0.65, fontWeight: 500 }}>
          {sub}
        </span>
      )}
    </button>
  );
}

export default function SearchForm({ onGenerate, loading, remaining, isLimitReached }) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(2);
  const [style, setStyle] = useState("balanced");
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState("around20k");
  const [touched, setTouched] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const isValid = destination.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onGenerate({ destination: destination.trim(), days, style, people, budget });
  };

  const inputStyle = (name) => {
    if (touched && !isValid && name === "destination") return { ...S.input, ...S.inputError };
    if (focusedInput === name) return { ...S.input, ...S.inputFocus };
    return S.input;
  };

  const selectStyle = (name) => {
    if (focusedInput === name) return { ...S.selectBase, ...S.inputFocus };
    return S.selectBase;
  };

  return (
    <div style={S.card}>
      {/* フォームヘッダー */}
      <div style={S.header} className="px-6 py-5">
        <h2 className="font-bold text-lg flex items-center gap-3" style={{ color: "#fff" }}>
          <span
            className="flex items-center justify-center rounded-lg text-base"
            style={{
              background: "rgba(245,158,11,0.2)",
              border: "1px solid rgba(245,158,11,0.4)",
              width: "36px",
              height: "36px",
            }}
          >
            🗺️
          </span>
          <span>
            旅行の条件を設定する
            <span
              className="block text-xs font-normal mt-0.5"
              style={{ color: "#94a3b8" }}
            >
              条件を入力してAIが最適プランを生成します
            </span>
          </span>
          <div style={{ marginLeft: "auto" }}>
            {isLimitReached ? (
              <span style={{ fontSize: "0.75rem", background: "#fee2e2", color: "#dc2626", padding: "4px 10px", borderRadius: "999px", fontWeight: 600 }}>
                今月の上限に達しました
              </span>
            ) : (
              <span style={{ fontSize: "0.75rem", background: "rgba(245,158,11,0.2)", color: "#fcd34d", padding: "4px 10px", borderRadius: "999px", fontWeight: 600 }}>
                残り {remaining} 回
              </span>
            )}
          </div>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-7">
        {/* 行き先入力 */}
        <div>
          <label className="block mb-2" style={S.label}>
            行き先
            <span className="ml-1" style={{ color: "#e53e3e" }}>*</span>
          </label>
          <div className="relative">
            <span
              className="absolute text-lg"
              style={{ left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              📍
            </span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setFocusedInput("destination")}
              onBlur={() => { setFocusedInput(null); setTouched(true); }}
              placeholder="例: 京都、北海道、沖縄、東京..."
              style={{
                ...inputStyle("destination"),
                width: "100%",
                paddingLeft: "44px",
                paddingRight: "16px",
                paddingTop: "13px",
                paddingBottom: "13px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              disabled={loading}
            />
          </div>
          {touched && !isValid && (
            <p className="mt-2 text-sm flex items-center gap-1" style={{ color: "#e53e3e" }}>
              <span>⚠️</span>
              行き先を入力してください
            </p>
          )}
        </div>

        {/* 旅行日数・人数 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 旅行日数 */}
          <div>
            <label className="block mb-2" style={S.label}>旅行日数</label>
            <div className="relative">
              <span
                className="absolute text-base"
                style={{ left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                📅
              </span>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                onFocus={() => setFocusedInput("days")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...selectStyle("days"),
                  width: "100%",
                  paddingLeft: "40px",
                  paddingRight: "32px",
                  paddingTop: "13px",
                  paddingBottom: "13px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
                disabled={loading}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>{d}日間</option>
                ))}
              </select>
              <span
                className="absolute pointer-events-none"
                style={{ right: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.75rem" }}
              >
                ▼
              </span>
            </div>
          </div>

          {/* 人数 */}
          <div>
            <label className="block mb-2" style={S.label}>人数</label>
            <div className="relative">
              <span
                className="absolute text-base"
                style={{ left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                👥
              </span>
              <select
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                onFocus={() => setFocusedInput("people")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...selectStyle("people"),
                  width: "100%",
                  paddingLeft: "40px",
                  paddingRight: "32px",
                  paddingTop: "13px",
                  paddingBottom: "13px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
                disabled={loading}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}名</option>
                ))}
              </select>
              <span
                className="absolute pointer-events-none"
                style={{ right: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.75rem" }}
              >
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* 旅行スタイル */}
        <div>
          <label className="block mb-3" style={S.label}>旅行スタイル</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRAVEL_STYLES.map((s) => (
              <CardButton
                key={s.value}
                selected={style === s.value}
                disabled={loading}
                onClick={() => setStyle(s.value)}
                icon={s.icon}
                label={s.label}
              />
            ))}
          </div>
        </div>

        {/* 1日あたり予算 */}
        <div>
          <label className="block mb-3" style={S.label}>
            1日あたりの予算
            <span
              className="ml-2 text-xs font-normal"
              style={{ color: "#94a3b8" }}
            >
              （お一人様あたり目安）
            </span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BUDGET_OPTIONS.map((b) => (
              <CardButton
                key={b.value}
                selected={budget === b.value}
                disabled={loading}
                onClick={() => setBudget(b.value)}
                icon={b.icon}
                label={b.label}
                sub={b.sub}
              />
            ))}
          </div>
        </div>

        {/* 仕切り線 */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #fde68a, transparent)" }} />

        {/* 生成ボタン */}
        <button
          type="submit"
          disabled={loading || !isValid || isLimitReached}
          style={
            loading || !isValid || isLimitReached
              ? {
                  background: "#e2e8f0",
                  color: "#94a3b8",
                  cursor: "not-allowed",
                  border: "none",
                  borderRadius: "14px",
                  padding: "16px 24px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }
              : {
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
                  color: "#ffffff",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "14px",
                  padding: "16px 24px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 20px rgba(245,158,11,0.4)",
                  transition: "all 0.2s",
                  letterSpacing: "0.03em",
                }
          }
          onMouseEnter={(e) => {
            if (!loading && isValid) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(245,158,11,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && isValid) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,158,11,0.4)";
            }
          }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              AIがプランを生成中...
            </>
          ) : (
            <>
              <span style={{ fontSize: "1.2rem" }}>✨</span>
              旅行プランを生成する
            </>
          )}
        </button>
      </form>
    </div>
  );
}
