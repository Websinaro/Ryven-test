"use client";

import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import { site } from "@/data/site";

// Clean two-column layout: statement on the left, a hairline service index on the right.
export default function About() {
  return (
    <section id="about" className="border-t border-line bg-background px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <SectionHeading index="02" eyebrow="ABOUT">
            {site.about.statement}
          </SectionHeading>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <Reveal as="p" y={12} className="label mb-5 text-[0.625rem] text-muted">
            WHAT WE DO
          </Reveal>
          <ul className="border-t border-line">
            {site.about.services.map((service, i) => (
              <Reveal key={service} delay={i * 0.07} y={12} className="border-b border-line">
                <li className="flex items-baseline justify-between py-4">
                  <span className="font-display text-lg font-semibold uppercase tracking-wide text-primary">{service}</span>
                  <span className="label text-[0.625rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        {site.about.stats.length > 0 && (
          <dl className="grid grid-cols-2 gap-px border-y border-line md:col-span-12 md:grid-cols-4">
            {site.about.stats.map((stat) => (
              <div key={stat.label} className="py-6 md:py-8">
                <dd className="font-display text-3xl font-bold text-accent">
                  <CountUp value={stat.value} />
                </dd>
                <dt className="label mt-2 text-[0.625rem] text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
