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
};

// Bento layout: card 1 wide, card 2 narrow, card 3 full width.
const LAYOUT = [
  { span: "md:col-span-8", aspect: "aspect-video md:aspect-[16/10]", from: "left" as const },
  { span: "md:col-span-4", aspect: "aspect-video md:aspect-[4/5]", from: "right" as const },
  { span: "md:col-span-12", aspect: "aspect-video md:aspect-[21/9]", from: "up" as const },
];

export default function ProjectSection({ project, resolved, index }: Props) {
  const { span, aspect, from } = LAYOUT[index % LAYOUT.length];
  return (
    <CardReveal
      from={from}
      className={`flex flex-col gap-5 rounded-2xl border border-line bg-surface/40 p-4 md:p-5 ${span}`}
    >
      <ClipReveal>
        <ProjectMedia resolved={resolved} alt={project.title} aspect={aspect} />
      </ClipReveal>

      <div className="flex flex-1 flex-col justify-between gap-4 px-1 pb-1">
        <div className="flex items-start justify-between gap-4">
          <Reveal
            as="h3"
            className="font-display text-xl font-semibold tracking-tight text-primary md:text-3xl"
          >
            {project.title}
          </Reveal>
          <Reveal as="span" y={16} duration={0.7} className="font-display text-sm text-muted">
            {project.id}
          </Reveal>
        </div>

        <Reveal as="p" delay={0.12} className="max-w-md text-sm text-muted md:text-base">
          {project.description}
        </Reveal>

        {project.href && (
          <Reveal delay={0.2}>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-sm font-medium tracking-wide text-primary transition-colors hover:text-accent-bright"
            >
              WATCH PROJECT ↗
            </a>
          </Reveal>
        )}
      </div>
    </CardReveal>
  );
}
