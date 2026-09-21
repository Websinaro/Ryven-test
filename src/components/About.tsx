"use client";

import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { site } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="border-t border-line px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="ABOUT">{site.about.statement}</SectionHeading>

        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4">
          {site.about.services.map((service, i) => (
            <Reveal
              as="span"
              key={service}
              y={12}
              blur={10}
              duration={0.7}
              delay={i * 0.08}
              className="text-sm font-medium tracking-[0.15em] text-muted"
            >
              {service}
            </Reveal>
          ))}
        </div>

        {site.about.stats.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {site.about.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <p className="font-display text-3xl font-semibold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs tracking-wide text-muted">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
