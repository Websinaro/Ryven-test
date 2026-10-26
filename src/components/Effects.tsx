"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { site, getWhatsappUrl } from "@/data/site";
import { setIntroDone, useIntroDone } from "./intro";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// Site-wide effects: intro loader, scroll progress, custom cursor, floating chat button.
export default function Effects() {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false);
  const [fine, setFine] = useState(false);
  const dragArea = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.3 });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const introDone = useIntroDone();

  // Lock the page while the intro plays; skip it entirely for reduced-motion users.
  useEffect(() => {
    if (reduce) {
      setLoading(false);
      setIntroDone();
      return;
    }
    const root = document.documentElement;
    root.classList.add("intro-lock");
    window.scrollTo(0, 0);
    return () => root.classList.remove("intro-lock");
  }, [reduce]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      setIntroDone();
    }, reduce ? 0 : 1500);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (!loading) document.documentElement.classList.remove("intro-lock");
  }, [loading]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setFine(true);
    let wasHover = false;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      // only re-render when the hover state actually flips
      const h = !!(e.target as HTMLElement)?.closest("a,button,input,[role=button]");
      if (h !== wasHover) {
        wasHover = h;
        setHover(h);
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030806]"
            style={{ clipPath: "inset(0 0 0% 0)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/logo-mark.png"
              alt={site.shortName}
              initial={{ opacity: 0, scale: 0.9, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="h-24 w-auto md:h-32"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.3, ease: EASE }}
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
            />
          </motion.div>
        )}
      </AnimatePresence>

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
            className="h-6 w-6 rounded-full border border-accent/80 bg-accent/10"
          />
        </motion.div>
      )}

      {/* Floating, draggable chat button. The full-screen layer only defines the
          area it can be dragged within; it never blocks clicks on the page. */}
      <div ref={dragArea} className="pointer-events-none fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 20 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-5 right-5"
        >
          <motion.a
            href={getWhatsappUrl("Hi! I'd like to start a project.")}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            drag
            dragConstraints={dragArea}
            dragElastic={0.08}
            dragMomentum={false}
            onDragStart={() => {
              moved.current = true;
            }}
            onDragEnd={() => {
              // let the click that follows a drag pass, then re-enable clicks
              window.setTimeout(() => {
                moved.current = false;
              }, 60);
            }}
            onClick={(e) => {
              if (moved.current) e.preventDefault(); // dragging must not open the chat
            }}
            whileHover={{ scale: 1.04 }}
            whileDrag={{ scale: 1.08, cursor: "grabbing" }}
            aria-label="Chat with us (drag to move)"
            className="label pointer-events-auto flex cursor-grab touch-none select-none items-center gap-2.5 rounded-full border border-accent/40 bg-section/90 px-5 py-3.5 font-medium text-primary shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-colors hover:border-accent"
          >
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(143,203,155,0.9)]" />
            Chat with us
          </motion.a>
        </motion.div>
      </div>
    </>
  );
}
