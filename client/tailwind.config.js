/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#5c7cfa",
          500: "#3b5bdb",
          600: "#2f4ac7",
          700: "#1e3a8a",
          800: "#1e293b",
          900: "#0f172a",
          950: "#080e1a",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        cream: {
          50: "#fffdf7",
          100: "#fffbeb",
          200: "#fef3c7",
          300: "#fde68a",
        },
      },
      fontFamily: {
        sans: [
          "Noto Sans JP",
          "Hiragino Kaku Gothic ProN",
          "Meiryo",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #1e3a8a 70%, #0f172a 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
        "gold-shine":
          "linear-gradient(90deg, #f59e0b 0%, #fcd34d 50%, #d97706 100%)",
      },
      boxShadow: {
        "gold-sm": "0 1px 4px rgba(245, 158, 11, 0.3)",
        gold: "0 4px 14px rgba(245, 158, 11, 0.35)",
        "gold-lg": "0 8px 30px rgba(245, 158, 11, 0.4)",
        luxury: "0 20px 60px rgba(15, 23, 42, 0.4)",
        "card-hover": "0 20px 40px rgba(15, 23, 42, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "shimmer": "shimmer 2s infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 158, 11, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(245, 158, 11, 0)" },
        },
      },
    },
  },
  plugins: [],
};
