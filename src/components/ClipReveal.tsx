"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Clip-path wipe reveal: the content is uncovered by an expanding mask while
// the inner layer settles from a slight zoom. Plays once per entry.
export default function ClipReveal({
  children,
  className,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  from?: "bottom" | "left";
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const hidden = from === "left" ? "inset(0 100% 0 0 round 12px)" : "inset(100% 0 0 0 round 12px)";
  return (
    <motion.div
      className={className}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 12px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
