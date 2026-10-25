"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ProjectSection from "./ProjectSection";
import { site } from "@/data/site";
import { portfolio, resolveProjectMedia } from "@/data/portfolio";

// Specialties tab bar + featured projects grid.
// The active tab highlights the matching tags on each project card.
export default function Work() {
  const [active, setActive] = useState(site.specialties[0]);
  const projects = portfolio.projects.map((project, index) => ({
    project,
    resolved: resolveProjectMedia(index),
  }));

  return (
    <>
      <div className="border-y border-line bg-background">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:gap-10 md:px-12 md:py-0">
          <p className="label flex shrink-0 items-center gap-3 text-[0.625rem] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent md:block" />
            OUR SPECIALTIES
          </p>
          <div role="tablist" aria-label="Our specialties" className="-mx-6 flex overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
            {site.specialties.map((name) => {
              const on = name === active;
              return (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(name)}
                  className={`label relative shrink-0 px-4 py-4 transition-colors md:px-8 md:py-6 ${
                    on ? "text-accent" : "text-muted hover:text-primary"
                  }`}
                >
                  {name}
                  <span
                    className={`absolute inset-x-4 bottom-0 h-px bg-accent transition-opacity duration-300 md:inset-x-8 ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section id="work" className="relative bg-section px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto max-w-[90rem]">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading index="01" eyebrow="FEATURED" big>
              PROJECTS
            </SectionHeading>
            <Reveal className="mb-2 hidden sm:block">
              <a
                href={site.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label group inline-flex items-center gap-3 text-[0.625rem] text-primary transition-colors hover:text-accent"
              >
                VIEW ALL WORK
                <span aria-hidden className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Reveal>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-3 md:gap-8">
            {projects.map(({ project, resolved }, index) => (
              <ProjectSection key={project.id} project={project} resolved={resolved} index={index} activeTag={active} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
