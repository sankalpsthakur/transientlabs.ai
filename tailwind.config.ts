import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--color-border)",
        paper: "var(--color-paper)",
        "paper-warm": "var(--color-paper-warm)",
        ink: "var(--color-ink)",
        "ink-light": "var(--color-ink-light)",
        "ink-muted": "var(--color-ink-muted)",
        accent: "var(--color-accent)",
        "accent-text": "var(--color-accent-text)",
        signal: "var(--color-signal)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "data-packet": "data-packet 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "data-packet-vertical": "data-packet-vertical 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
        "noodle-dash": "noodle-dash 20s linear infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "data-packet": {
          "0%": { transform: "translateX(0) scale(1)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateX(24px) scale(0.5)", opacity: "0" },
        },
        "data-packet-vertical": {
            "0%": { transform: "translateY(0) scale(1)", opacity: "0" },
            "20%": { opacity: "1" },
            "80%": { opacity: "1" },
            "100%": { transform: "translateY(24px) scale(0.5)", opacity: "0" },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(480px)", opacity: "0" },
        },
        "noodle-dash": {
          to: {
            strokeDashoffset: "-200",
          }
        },
      },
    },
  },
  plugins: [],
};
export default config;
