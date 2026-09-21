"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Scroll blur reveal:
//   • entering the screen  -> blurred + transparent + low  ➜  sharp, in place
//   • leaving the screen   -> sharp ➜ blurred + transparent (blur OUT)
// It replays every time the content enters/leaves, both scrolling down and up.
//
//   <Reveal>…</Reveal>                 -> blur in AND blur out (default)
//   <Reveal once>…</Reveal>            -> reveal a single time, then stay sharp
//   <Reveal as="h2" delay={0.15}>…</Reveal> -> render as another tag + stagger
const tags = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
} as const;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Props = {
  as?: keyof typeof tags;
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the blur-in starts (use for staggering). */
  delay?: number;
  /** Starting vertical offset in px. */
  y?: number;
  /** Blur in px at the hidden state. */
  blur?: number;
  duration?: number;
  /** true = animate in only once and never blur back out. */
  once?: boolean;
};

export default function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  y = 24,
  blur = 14,
  duration = 0.9,
  once = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const reduceMotion = useReducedMotion();
  const Tag = tags[as] as unknown as typeof motion.div;

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        // the (staggered) blur-in
        transition: { duration, delay, ease: EASE },
      }}
      // used when leaving the screen: quick blur-out, no stagger delay
      transition={{ duration: 0.6, ease: EASE }}
      viewport={{ once, margin: "-12%" }}
      onViewportEnter={() => {
        visible.current = true;
      }}
      onViewportLeave={() => {
        visible.current = false;
      }}
      onAnimationComplete={() => {
        // Fully revealed: drop the filter so it doesn't keep a needless
        // compositing layer (matters for the video cards). framer re-applies
        // it on the next blur-out.
        if (visible.current && ref.current) ref.current.style.filter = "none";
      }}
    >
      {children}
    </Tag>
  );
}
