import { useState, useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import SearchForm from "./components/SearchForm";
import TravelPlan from "./components/TravelPlan";
import AuthModal from "./components/AuthModal";
import { useUsageLimit } from "./hooks/useUsageLimit";
import { supabase } from "./supabase";

export default function App() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastConditions, setLastConditions] = useState(null);
  const { remaining, isLimitReached, incrementUsage } = useUsageLimit();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const generatePlan = async (conditions) => {
    if (isLimitReached) {
      setError("今月の無料生成回数（3回）を使い切りました。来月またご利用ください。");
      return;
    }
    setLoading(true);
    setError(null);
    setPlan(null);
    setLastConditions(conditions);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conditions),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "プランの生成に失敗しました。");
      }

      setPlan(data);
      incrementUsage();
    } catch (err) {
      setError(
        err.message ||
          "予期せぬエラーが発生しました。しばらく待ってから再試行してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastConditions) {
      generatePlan(lastConditions);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f6f0" }}>
      {/* ヒーローヘッダー */}
      <header
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 35%, #1e3a8a 65%, #0f172a 100%)",
        }}
      >
        {/* 星のような装飾ドット */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top: "15%", left: "8%", size: "2px", opacity: 0.8 },
            { top: "25%", left: "18%", size: "1px", opacity: 0.5 },
            { top: "10%", left: "30%", size: "3px", opacity: 0.9 },
            { top: "40%", left: "5%", size: "1px", opacity: 0.6 },
            { top: "60%", left: "12%", size: "2px", opacity: 0.7 },
            { top: "20%", left: "75%", size: "2px", opacity: 0.8 },
            { top: "35%", left: "85%", size: "1px", opacity: 0.5 },
            { top: "55%", left: "92%", size: "3px", opacity: 0.9 },
            { top: "70%", left: "78%", size: "1px", opacity: 0.6 },
            { top: "80%", left: "88%", size: "2px", opacity: 0.7 },
            { top: "15%", left: "55%", size: "1px", opacity: 0.4 },
            { top: "45%", left: "45%", size: "2px", opacity: 0.6 },
            { top: "75%", left: "35%", size: "1px", opacity: 0.5 },
            { top: "85%", left: "60%", size: "2px", opacity: 0.7 },
          ].map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }}
            />
          ))}
          {/* ゴールドのグロー */}
          <div
            className="absolute rounded-full"
            style={{
              top: "-20%",
              right: "10%",
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: "-30%",
              left: "15%",
              width: "250px",
              height: "250px",
              background:
                "radial-gradient(circle, rgba(59,91,219,0.2) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            {/* アイコン */}
            <div
              className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-gold"
              style={{
                background:
                  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              }}
            >
              ✈️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(245,158,11,0.2)",
                    color: "#fcd34d",
                    border: "1px solid rgba(245,158,11,0.3)",
                  }}
                >
                  Travel Concierge
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-white">
                旅行プランナー
              </h1>
              <p
                className="text-sm md:text-base mt-2 max-w-lg"
                style={{ color: "#cbd5e1" }}
              >
                行き先・日数・スタイルを選ぶだけで、
                <span style={{ color: "#fcd34d" }}>あなただけの旅行プラン</span>
                を自動生成します
              </p>
            </div>
          </div>
        </div>

        {/* ボトムアクセント */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />

        {/* 認証ボタン */}
        <div className="absolute top-4 right-4">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.8rem", color: "#fcd34d" }}>{user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#e2e8f0", borderRadius: "8px", padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit" }}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", color: "#fcd34d", borderRadius: "8px", padding: "6px 16px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              ログイン / 登録
            </button>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* 入力フォーム */}
        <SearchForm onGenerate={generatePlan} loading={loading} remaining={remaining} isLimitReached={isLimitReached} />

        {/* ローディング */}
        {loading && <LoadingSpinner />}

        {/* エラー表示 */}
        {error && !loading && (
          <div className="mt-8 animate-fade-in">
            <div
              className="rounded-2xl p-5 flex items-start gap-4 shadow-xl"
              style={{
                background: "#fff5f5",
                border: "1px solid #fed7d7",
              }}
            >
              <span className="text-red-400 text-2xl flex-shrink-0 mt-0.5">
                ⚠️
              </span>
              <div>
                <h3 className="font-bold text-red-700 mb-1 text-base">
                  エラーが発生しました
                </h3>
                <p className="text-red-600 text-sm">{error}</p>
                {lastConditions && (
                  <button
                    onClick={handleRegenerate}
                    className="mt-3 text-sm font-semibold underline transition-colors"
                    style={{ color: "#c53030" }}
                  >
                    再試行する →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 旅行プラン表示 */}
        {plan && !loading && (
          <TravelPlan plan={plan} onRegenerate={handleRegenerate} />
        )}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* フッター */}
      <footer
        className="mt-16 py-8"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderTop: "1px solid rgba(245,158,11,0.2)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div
            className="flex items-center justify-center gap-2 mb-2"
            style={{ color: "#94a3b8" }}
          >
            <span style={{ color: "#f59e0b" }}>✦</span>
            <p className="text-sm">
              旅行プランナー
            </p>
            <span style={{ color: "#f59e0b" }}>✦</span>
          </div>
          <p className="text-xs" style={{ color: "#64748b" }}>
            生成されたプランはAIによる提案です。実際の営業時間・料金等は必ずご確認ください。
          </p>
        </div>
      </footer>
    </div>
  );
}
