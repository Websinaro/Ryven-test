"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

// Premium scroll-linked card animation — plays BOTH ways:
//   IN  (card rising into view):  drops back in 3D, slides from its side, scales up, fades in
//   OUT (card leaving the top):   tips away, drifts up, shrinks slightly, fades out
// Driven by scroll position (not a timer), then smoothed by a spring, so it
// scrubs perfectly with the smooth scroller and reverses when scrolling back.
// A cursor-following glow + border highlight rides on top (see .card-glow).
//
//   <CardReveal from="left" className="md:col-span-8 …">…</CardReveal>
//   <CardReveal soft>…</CardReveal>   -> gentler motion for small cards
type Props = {
  children: ReactNode;
  className?: string;
  /** Which side the card slides in from. */
  from?: "up" | "left" | "right";
  /** Gentler travel/tilt for small cards. */
  soft?: boolean;
};

export default function CardReveal({ children, className = "", from = "up", soft = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35, restDelta: 0.0005 });

  const k = soft ? 0.55 : 1;
  const dir = from === "left" ? -1 : from === "right" ? 1 : 0;
  const stops = [0, 0.26, 0.74, 1];

  const opacity = useTransform(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(p, stops, [90 * k, 0, 0, -70 * k]);
  const x = useTransform(p, stops, [dir * 70 * k, 0, 0, dir * -40 * k]);
  const scale = useTransform(p, stops, [1 - 0.12 * k, 1, 1, 1 - 0.06 * k]);
  const rotateX = useTransform(p, stops, [14 * k, 0, 0, -8 * k]);
  const rotateY = useTransform(p, stops, [dir * -8 * k, 0, 0, dir * 4 * k]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      className={`card-glow ${className}`}
      style={{
        opacity,
        x,
        y,
        scale,
        rotateX,
        rotateY,
        transformPerspective: 1200,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
