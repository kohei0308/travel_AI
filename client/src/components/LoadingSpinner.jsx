export default function LoadingSpinner() {
  return (
    <div className="mt-8 animate-fade-in">
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid rgba(245,158,11,0.15)",
          boxShadow: "0 4px 6px rgba(15,23,42,0.04), 0 10px 30px rgba(15,23,42,0.08)",
          padding: "48px 40px",
        }}
      >
        <div className="flex flex-col items-center gap-5">
          {/* スピナー */}
          <div className="relative">
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "4px solid rgba(245,158,11,0.15)",
              }}
            />
            <div
              className="animate-spin"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "4px solid transparent",
                borderTopColor: "#f59e0b",
                borderRightColor: "rgba(245,158,11,0.3)",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "1.5rem",
              }}
            >
              ✈️
            </span>
          </div>

          {/* テキスト */}
          <div className="text-center">
            <p
              className="font-bold text-lg"
              style={{ color: "#1e293b" }}
            >
              旅行プランを生成中...
            </p>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              最適なプランを考えています。しばらくお待ちください。
            </p>
          </div>

          {/* プログレスバー */}
          <div
            style={{
              width: "100%",
              maxWidth: "280px",
              background: "rgba(245,158,11,0.12)",
              borderRadius: "999px",
              height: "6px",
              overflow: "hidden",
            }}
          >
            <div
              className="animate-pulse"
              style={{
                height: "100%",
                width: "70%",
                background: "linear-gradient(90deg, #f59e0b, #d97706)",
                borderRadius: "999px",
              }}
            />
          </div>

          {/* ヒント */}
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "0.875rem",
              color: "#92400e",
              textAlign: "center",
              maxWidth: "320px",
            }}
          >
            💡 生成には10〜30秒程度かかる場合があります
          </div>
        </div>
      </div>
    </div>
  );
}
