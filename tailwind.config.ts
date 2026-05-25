import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink:   "#04060a",
        ink2:  "#080c12",
        ink3:  "#0c1219",
        ink4:  "#111c26",
        blue:  "#0ea5ff",
        white1:"#edf2f8",
        white2:"#b8c8d8",
        muted: "#5a7080",
        muted2:"#304050",
        green: "#00d97e",
      },
      fontFamily: {
        syne:  ["Syne",          "sans-serif"],
        mono:  ["Geist Mono",    "monospace"],
        sans:  ["Instrument Sans","sans-serif"],
      },
      transitionTimingFunction: {
        expo:   "cubic-bezier(0.16,1,0.3,1)",
        spring: "cubic-bezier(0.34,1.56,0.64,1)",
      },
      animation: {
        ticker:    "ticker 28s linear infinite",
        dotPulse:  "dotPulse 2.4s ease-in-out infinite",
        blink:     "blink 1.1s step-end infinite",
        glowPulse: "glowPulse 4s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        dotPulse: {
          "0%,100%": { boxShadow: "0 0 8px #0ea5ff, 0 0 14px rgba(14,165,255,.3)" },
          "50%":     { boxShadow: "0 0 16px #0ea5ff, 0 0 32px rgba(14,165,255,.55)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
        glowPulse: {
          "0%,100%": { transform: "translate(-50%,-50%) scale(1)", opacity: "1" },
          "50%":     { transform: "translate(-50%,-50%) scale(1.1)", opacity: "0.7" },
        },
      },
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
} satisfies Config
