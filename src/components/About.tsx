"use client";

import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import { site } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="border-t border-line px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
        <div className="rounded-2xl border border-line bg-surface/40 p-6 md:col-span-8 md:p-10">
          <SectionHeading eyebrow="ABOUT">{site.about.statement}</SectionHeading>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-line bg-surface/40 p-6 md:col-span-4 md:p-10">
          <p className="text-xs font-medium tracking-[0.2em] text-muted">WHAT WE DO</p>
          <div className="flex flex-col gap-3">
            {site.about.services.map((service, i) => (
              <Reveal
                as="span"
                key={service}
                y={12}
                blur={10}
                duration={0.7}
                delay={i * 0.08}
                className="border-b border-line pb-3 font-display text-lg font-medium tracking-wide text-primary"
              >
                {service}
              </Reveal>
            ))}
          </div>
        </div>

        {site.about.stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.1}
            className="rounded-2xl border border-line bg-surface/40 p-6 md:col-span-3"
          >
            <p className="font-display text-3xl font-semibold text-primary"><CountUp value={stat.value} /></p>
            <p className="mt-1 text-xs tracking-wide text-muted">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
