import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--rgb-primary) / <alpha-value>)",
        muted: "rgb(var(--rgb-muted) / <alpha-value>)",
        background: "rgb(var(--rgb-background) / <alpha-value>)",
        section: "rgb(var(--rgb-section) / <alpha-value>)",
        surface: "rgb(var(--rgb-surface) / <alpha-value>)",
        accent: "rgb(var(--rgb-accent) / <alpha-value>)",
        "accent-bright": "rgb(var(--rgb-accent) / <alpha-value>)",
        line: "rgb(var(--rgb-line) / <alpha-value>)",
        "line-strong": "rgb(var(--rgb-line-strong) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
