"use client";

import ProjectMedia from "./ProjectMedia";
import Reveal from "./Reveal";
import ClipReveal from "./ClipReveal";
import CardReveal from "./CardReveal";
import type { Project, ResolvedMedia } from "@/data/portfolio";

type Props = {
  project: Project;
  resolved: ResolvedMedia;
  index: number;
  /** Specialty currently selected in the tab bar; matching tags light up. */
  activeTag?: string;
};

// Three equal columns: slide in from left / bottom / right.
const FROM = ["left", "up", "right"] as const;

export default function ProjectSection({ project, resolved, index, activeTag }: Props) {
  const from = FROM[index % FROM.length];
  return (
    <CardReveal
      from={from}
      className="flex flex-col gap-5 rounded-sm border border-line bg-surface p-3 md:p-4"
    >
      <ClipReveal>
        <ProjectMedia resolved={resolved} alt={project.title} aspect="aspect-video" />
      </ClipReveal>

      <div className="flex flex-1 flex-col gap-3 px-1 pb-2">
        <Reveal as="span" y={16} duration={0.7} className="label text-accent">
          {project.id}
        </Reveal>

        <Reveal
          as="h3"
          className="font-display text-2xl font-bold uppercase tracking-tight text-primary"
        >
          {project.title}
        </Reveal>

        <Reveal as="p" delay={0.12} className="max-w-sm text-sm leading-relaxed text-muted">
          {project.description}
        </Reveal>

        <Reveal delay={0.2} className="mt-auto pt-3">
          <p className="label flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.625rem]">
            {project.tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-2">
                {i > 0 && <span className="text-line-strong">/</span>}
                <span className={`transition-colors duration-300 ${tag === activeTag ? "text-accent" : "text-muted"}`}>{tag}</span>
              </span>
            ))}
          </p>
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline label mt-4 inline-block text-primary transition-colors hover:text-accent"
            >
              WATCH PROJECT ↗
            </a>
          )}
        </Reveal>
      </div>
    </CardReveal>
  );
}
