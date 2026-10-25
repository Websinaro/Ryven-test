"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
import GridPreloader from "./GridPreloader";
import { getWhatsappUrl } from "@/data/site";

// Site-wide effects: intro loader, scroll progress, custom cursor, floating chat button.
export default function Effects() {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false);
  const [fine, setFine] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    if (reduce) setLoading(false);
  }, [reduce]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setFine(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHover(!!(e.target as HTMLElement)?.closest("a,button,input,[role=button]"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <>
      {loading && <GridPreloader onDone={() => setLoading(false)} />}

      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent-bright"
      />

      {fine && !reduce && (
        <motion.div
          aria-hidden
          style={{ x: sx, y: sy }}
          className="pointer-events-none fixed left-0 top-0 z-[90] -ml-3 -mt-3 hidden md:block"
        >
          <motion.div
            animate={{ scale: hover ? 2.4 : 1, opacity: hover ? 0.5 : 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="h-6 w-6 rounded-full border border-white bg-white/10 mix-blend-difference"
          />
        </motion.div>
      )}

      <motion.a
        href={getWhatsappUrl("Hi! I'd like to start a project.")}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
        transition={{ delay: 1.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.06 }}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-accent px-5 py-3 text-sm font-medium text-[#f6faf7] shadow-lg"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/40" />
        Chat with us
      </motion.a>
    </>
  );
}
