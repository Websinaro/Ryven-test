"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const OPEN = "inset(0% 0% 0% 0% round 14px)";
const CLOSED = "inset(16% 6% 16% 6% round 14px)";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Cinematic mask reveal for video frames — IN and OUT:
//   enter: the frame "opens" from a letterboxed crop while a light sweep glides across
//   leave: it closes back down and dims
// Replays every time (scrolling down or up). The trigger sits on an unclipped
// wrapper and the mask never starts fully closed, so the video's own
// in-view/autoplay logic keeps working. When fully open the clip is removed.
export default function ClipReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -8% 0px" });
  const inViewRef = useRef(false);
  inViewRef.current = inView;
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="relative"
        initial={{ clipPath: CLOSED, opacity: 0.35 }}
        animate={inView ? { clipPath: OPEN, opacity: 1 } : { clipPath: CLOSED, opacity: 0.35 }}
        transition={{ duration: inView ? 1.1 : 0.7, ease: EASE }}
        onAnimationComplete={() => {
          const el = ref.current?.firstElementChild as HTMLElement | null;
          if (inViewRef.current && el) el.style.clipPath = "none";
        }}
      >
        {children}

        {/* one-off light sweep across the frame as it opens */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">
          <motion.div
            initial={{ x: "-130%" }}
            animate={{ x: inView ? "280%" : "-130%" }}
            transition={inView ? { duration: 1.3, delay: 0.25, ease: EASE } : { duration: 0 }}
            className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}
