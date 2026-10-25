"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Subtle clip-path mask reveal. The trigger sits on an unclipped wrapper and the
// mask never starts fully closed (so the video's own in-view/autoplay logic
// keeps working). Once finished, the clip is removed entirely.
export default function ClipReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ clipPath: "inset(20% 0% 20% 0% round 14px)", opacity: 0.4 }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0% round 14px)", opacity: 1 } : undefined}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={(d) => {
          if (inView && ref.current?.firstElementChild) (ref.current.firstElementChild as HTMLElement).style.clipPath = "none";
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
