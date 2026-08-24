import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        surface: {
          DEFAULT: "#0F172A",
          subtle: "#161F37",
          elevated: "#1E293B",
          highlight: "#293548",
        },
        border: {
          DEFAULT: "#1E293B",
          subtle: "#162032",
          strong: "#334155",
          highlight: "#475569",
        },
        ops: {
          cyan: {
            DEFAULT: "#06B6D4",
            dim: "#0891B2",
            glow: "rgba(6, 182, 212, 0.15)",
            light: "#67E8F9",
          },
          crimson: {
            DEFAULT: "#EF4444",
            dim: "#B91C1C",
            glow: "rgba(239, 68, 68, 0.18)",
            light: "#FCA5A5",
          },
          amber: {
            DEFAULT: "#F59E0B",
            dim: "#D97706",
            glow: "rgba(245, 158, 11, 0.15)",
            light: "#FCD34D",
          },
          emerald: {
            DEFAULT: "#10B981",
            dim: "#059669",
            glow: "rgba(16, 185, 129, 0.15)",
            light: "#6EE7B7",
          },
          indigo: {
            DEFAULT: "#6366F1",
            dim: "#4F46E5",
            glow: "rgba(99, 102, 241, 0.15)",
            light: "#A5B4FC",
          },
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
          dim: "#475569",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      boxShadow: {
        "ops-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
        "ops-md": "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)",
        "ops-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)",
        "glow-cyan": "0 0 15px rgba(6, 182, 212, 0.25)",
        "glow-crimson": "0 0 15px rgba(239, 68, 68, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
