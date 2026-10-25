"use client";

import { site } from "@/data/site";
import { portfolio } from "@/data/portfolio";

// Infinite horizontal marquee (CSS keyframes). Pauses on hover.
export default function Marquee() {
  const items = [...portfolio.projects.map((p) => p.title), ...site.about.services];
  const row = (
    <ul className="marquee-row" aria-hidden>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-3xl font-semibold uppercase tracking-tight text-primary/80 transition-colors duration-300 hover:text-accent-bright md:text-6xl">
            {t}
          </span>
          <span className="text-accent-bright">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee relative overflow-hidden border-t border-line bg-background py-8 md:py-12" aria-label="Selected work and services">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
