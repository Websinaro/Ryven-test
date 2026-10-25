"use client";

import { site } from "@/data/site";
import { portfolio } from "@/data/portfolio";

// Infinite horizontal marquee (CSS keyframes). Pauses on hover.
export default function Marquee() {
  const items = [...portfolio.projects.map((p) => p.title), ...site.about.services];
  const row = (
    <ul className="marquee-row" aria-hidden>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span className="font-display text-2xl font-medium uppercase tracking-tight text-primary/60 transition-colors duration-300 hover:text-accent-bright md:text-5xl">
            {t}
          </span>
          <span className="text-xs text-accent-bright/70">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee relative overflow-hidden border-t border-line bg-background py-6 md:py-10" aria-label="Selected work and services">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
