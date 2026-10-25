"use client";

import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import CardReveal from "./CardReveal";
import { site } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="border-t border-line bg-background px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <CardReveal from="left" className="rounded-sm border border-line bg-surface p-6 md:col-span-8 md:p-10">
          <SectionHeading index="02" eyebrow="ABOUT">{site.about.statement}</SectionHeading>
        </CardReveal>

        <CardReveal from="right" className="flex flex-col justify-between gap-6 rounded-sm border border-line bg-surface p-6 md:col-span-4 md:p-10">
          <p className="label text-[0.625rem] text-muted">WHAT WE DO</p>
          <div className="flex flex-col gap-3">
            {site.about.services.map((service, i) => (
              <Reveal
                as="span"
                key={service}
                y={12}
                blur={10}
                duration={0.7}
                delay={i * 0.08}
                className="border-b border-line pb-3 font-display text-lg font-semibold uppercase tracking-wide text-primary"
              >
                {service}
              </Reveal>
            ))}
          </div>
        </CardReveal>

        {site.about.stats.map((stat, i) => (
          <CardReveal
            key={stat.label}
            soft
            from={i % 2 === 0 ? "left" : "right"}
            className="rounded-sm border border-line bg-surface p-6 md:col-span-3"
          >
            <p className="font-display text-3xl font-bold text-accent"><CountUp value={stat.value} /></p>
            <p className="label mt-2 text-[0.625rem] text-muted">{stat.label}</p>
          </CardReveal>
        ))}
      </div>
    </section>
  );
}
