"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Scroll-linked card reveal, kept deliberately light so scrolling stays at 60fps:
// only opacity + translate + a tiny scale (all GPU-composited), driven straight
// from scroll position (the page's smooth scroller already eases the motion).
// A cursor-following glow border rides on top (see .card-glow).
type Props = {
  children: ReactNode;
  className?: string;
  /** Which side the card slides in from. */
  from?: "up" | "left" | "right";
  /** Gentler travel for small cards. */
  soft?: boolean;
};

export default function CardReveal({ children, className = "", from = "up", soft = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const k = soft ? 0.6 : 1;
  const dir = from === "left" ? -1 : from === "right" ? 1 : 0;
  const stops = [0, 0.25, 0.75, 1];

  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, stops, [60 * k, 0, 0, -40 * k]);
  const x = useTransform(scrollYProgress, stops, [dir * 36 * k, 0, 0, dir * -20 * k]);
  const scale = useTransform(scrollYProgress, stops, [0.96, 1, 1, 0.98]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const frame = useRef(0);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (frame.current) return; // at most one style write per frame
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      className={`card-glow ${className}`}
      style={{ opacity, x, y, scale }}
    >
      {children}
    </motion.div>
  );
}
