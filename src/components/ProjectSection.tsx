"use client";

import ProjectMedia from "./ProjectMedia";
import Reveal from "./Reveal";
import type { Project, ResolvedMedia } from "@/data/portfolio";

type Props = {
  project: Project;
  resolved: ResolvedMedia;
  index: number;
};

export default function ProjectSection({ project, resolved, index }: Props) {
  return (
    <div className="relative border-t border-line px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Reveal as="span" y={16} duration={0.7} className="font-display text-sm text-muted">
          {project.id}
        </Reveal>

        <Reveal duration={1.1} y={32} blur={20}>
          <ProjectMedia resolved={resolved} alt={project.title} />
        </Reveal>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal
            as="h3"
            className="font-display text-2xl font-semibold tracking-tight text-primary md:text-4xl"
          >
            {project.title}
          </Reveal>

          <Reveal as="p" delay={0.12} className="max-w-md text-sm text-muted md:text-base">
            {project.description}
          </Reveal>
        </div>

        {project.href && (
          <Reveal delay={0.2}>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium tracking-wide text-primary transition-colors hover:text-accent-bright"
            >
              WATCH PROJECT ↗
            </a>
          </Reveal>
        )}
      </div>
    </div>
  );
}
