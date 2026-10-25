"use client";

import clsx from "clsx";
import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  /** Small section number shown to the left of the eyebrow, e.g. "01". */
  index?: string;
  /** Large display heading (e.g. "PROJECTS") instead of a statement. */
  big?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function SectionHeading({ eyebrow, index, big, children, className }: Props) {
  return (
    <div className={clsx(big ? "flex items-start gap-6 md:gap-10" : "max-w-3xl", className)}>
      {index && (
        <Reveal as="span" y={12} blur={10} duration={0.7} className="label mt-1 hidden w-[4.5rem] shrink-0 text-accent sm:block">
          {index}
          <span className="mt-3 block h-px w-8 bg-line-strong" />
        </Reveal>
      )}
      <div>
        {eyebrow && (
          <Reveal
            as="p"
            y={12}
            blur={10}
            duration={0.7}
            className={clsx("label mb-3 text-[0.625rem]", big ? "text-muted" : "text-accent")}
          >
            {eyebrow}
          </Reveal>
        )}
        <Reveal
          as="h2"
          delay={0.08}
          className={clsx(
            "font-display font-bold tracking-tight text-primary",
            big
              ? "text-4xl uppercase leading-none md:text-6xl"
              : "text-2xl leading-snug text-balance md:text-4xl"
          )}
        >
          {children}
        </Reveal>
      </div>
    </div>
  );
}
