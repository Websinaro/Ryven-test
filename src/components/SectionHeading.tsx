"use client";

import clsx from "clsx";
import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
};

export default function SectionHeading({ eyebrow, children, className }: Props) {
  return (
    <div className={clsx("max-w-3xl", className)}>
      {eyebrow && (
        <Reveal
          as="p"
          y={12}
          blur={10}
          duration={0.7}
          className="mb-4 text-xs font-medium tracking-[0.2em] text-muted"
        >
          {eyebrow}
        </Reveal>
      )}
      <Reveal
        as="h2"
        delay={0.08}
        className="font-display text-3xl font-semibold leading-tight tracking-tight text-primary text-balance md:text-5xl"
      >
        {children}
      </Reveal>
    </div>
  );
}
