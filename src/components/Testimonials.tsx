"use client";

import SectionHeading from "./SectionHeading";
import { site } from "@/data/site";

// Auto-scrolling testimonial loop (CSS keyframes). Pauses on hover.
export default function Testimonials() {
  const list = site.testimonials;
  if (!list.length) return null;
  const row = (
    <ul className="marquee-row" aria-hidden>
      {list.map((t, i) => (
        <li
          key={i}
          className="flex w-[300px] shrink-0 flex-col justify-between gap-6 rounded-sm border border-line bg-surface p-6 transition-colors duration-500 hover:border-accent md:w-[380px]"
        >
          <p className="text-sm leading-relaxed text-primary md:text-base">“{t.quote}”</p>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-primary">{t.name}</p>
            <p className="label mt-1 text-[0.625rem] text-muted">{t.role}</p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="border-t border-line bg-section py-24 md:py-32">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        <SectionHeading index="03" eyebrow="TESTIMONIALS">What our clients say.</SectionHeading>
      </div>
      <div className="marquee mt-14 overflow-hidden">
        <div className="marquee-track marquee-slow">
          {row}
          {row}
        </div>
      </div>
    </section>
  );
}
