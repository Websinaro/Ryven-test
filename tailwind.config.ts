import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        muted: "var(--color-muted)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        "accent-bright": "var(--color-accent-bright)",
        line: "var(--color-line)",
        "line-strong": "var(--color-line-strong)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
