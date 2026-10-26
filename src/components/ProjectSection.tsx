"use client";

import ProjectMedia from "./ProjectMedia";
import Reveal from "./Reveal";
import ClipReveal from "./ClipReveal";
import type { Project, ResolvedMedia } from "@/data/portfolio";

type Props = {
  project: Project;
  resolved: ResolvedMedia;
  index: number;
  /** Specialty currently selected in the tab bar; matching tags light up. */
  activeTag?: string;
};

// Card-less layout, as in the reference:
//   desktop – 3 equal columns, media on top, index → title → copy → tags underneath
//   mobile  – one indexed row per project (number in a narrow left column)
// Columns share one baseline: the tag row is pinned to the bottom of every column.
export default function ProjectSection({ project, resolved, index, activeTag }: Props) {
  return (
    <article className="group grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 md:flex md:flex-col md:gap-x-0">
      {/* Mobile index column */}
      <Reveal as="span" y={12} delay={index * 0.05} className="label pt-1 text-accent md:hidden">
        {project.id}
        <span className="mt-3 block h-px w-6 bg-line-strong" />
      </Reveal>

      <div className="flex min-w-0 flex-col md:flex-1">
        <ClipReveal>
          <ProjectMedia resolved={resolved} alt={project.title} aspect="aspect-video" />
        </ClipReveal>

        <div className="flex flex-1 flex-col pt-5 md:pt-6">
          <Reveal as="span" y={12} duration={0.7} delay={0.05} className="label mb-3 hidden text-accent md:block">
            {project.id}
          </Reveal>

          <Reveal
            as="h3"
            delay={0.08}
            className="font-display text-xl font-bold uppercase tracking-tight text-primary md:text-2xl"
          >
            {project.title}
          </Reveal>

          <Reveal as="p" delay={0.16} className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {project.description}
          </Reveal>

          <Reveal delay={0.24} className="mt-auto pt-6">
            <div className="border-t border-line pt-4">
              <p className="label flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.625rem]">
                {project.tags.map((tag, i) => (
                  <span key={tag} className="flex items-center gap-2">
                    {i > 0 && <span className="text-line-strong">/</span>}
                    <span className={`transition-colors duration-300 ${tag === activeTag ? "text-accent" : "text-muted"}`}>
                      {tag}
                    </span>
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
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
