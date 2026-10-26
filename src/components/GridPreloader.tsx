"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { mediaLinks } from "@/config/media-links";
import { site } from "@/data/site";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * First-load grid intro:
 *  1. A grid of tiles pops in from the centre outward (staggered by distance).
 *  2. Tiles show your posters (media-links.ts) with a timecode label; a counter runs 000 → 100.
 *  3. Tiles wipe away column by column, revealing the hero underneath.
 * Tweak COLS/ROWS below, or the timings, to change the feel.
 */
const DESKTOP = { cols: 6, rows: 4 };
const MOBILE = { cols: 3, rows: 6 };
const REVEAL = 1.1; // seconds for tiles to pop in
const HOLD = 0.5; // pause after counter hits 100

export default function GridPreloader({ onDone }: { onDone: () => void }) {
  const [grid, setGrid] = useState<{ cols: number; rows: number } | null>(null);
  const [exiting, setExiting] = useState(false);
  const [count, setCount] = useState(0);

  const posters = useMemo(
    () =>
      [mediaLinks.hero.posterUrl, ...mediaLinks.projects.map((p) => p.posterUrl)].filter(
        (u): u is string => Boolean(u)
      ),
    []
  );

  useEffect(() => {
    setGrid(window.innerWidth < 768 ? MOBILE : DESKTOP);
  }, []);

  useEffect(() => {
    if (!grid) return;
    const counter = animate(0, 100, {
      duration: REVEAL + 0.9,
      ease: "easeInOut",
      onUpdate: (v) => setCount(Math.round(v)),
    });
    const t1 = setTimeout(() => setExiting(true), (REVEAL + 0.9 + HOLD) * 1000);
    const t2 = setTimeout(onDone, (REVEAL + 0.9 + HOLD + 1.2) * 1000);
    return () => {
      counter.stop();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [grid, onDone]);

  const cells = useMemo(() => {
    if (!grid) return [];
    const { cols, rows } = grid;
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    const maxD = Math.hypot(cx, cy) || 1;
    return Array.from({ length: cols * rows }, (_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      return { i, c, r, d: Math.hypot(c - cx, r - cy) / maxD };
    });
  }, [grid]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#071a12]" aria-hidden>
      {grid && (
        <div
          className="absolute inset-0 grid gap-[2px] p-[2px]"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
            gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
          }}
        >
          {cells.map(({ i, c, d }) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                exiting
                  ? { clipPath: "inset(0 0 100% 0)", scale: 1, opacity: 1 }
                  : { scale: 1, opacity: 1, clipPath: "inset(0 0 0% 0)" }
              }
              transition={
                exiting
                  ? { duration: 0.8, ease: EASE, delay: (c / grid.cols) * 0.35 }
                  : { duration: 0.7, ease: SOFT, delay: d * REVEAL * 0.8 + 0.1 }
              }
              className="relative overflow-hidden bg-surface"
            >
              {posters.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={posters[i % posters.length]}
                  alt=""
                  className="h-full w-full object-cover opacity-70"
                  style={{ objectPosition: `${(i * 37) % 100}% ${(i * 53) % 100}%` }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#0d2a1e] to-[#123a29]" />
              )}
              <div className="absolute inset-0 bg-[#071a12]/30" />
              <span className="absolute left-2 top-2 text-[9px] tracking-[0.2em] text-primary/70 md:text-[10px]">
                {String(i + 1).padStart(3, "0")}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Centre mark + counter */}
      <AnimatePresence>
        {!exiting && (
          <motion.div
            key="centre"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ delay: REVEAL * 0.7, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-[#071a12]/85 px-8 py-6 backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.png" alt={site.shortName} className="h-14 w-auto md:h-20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-5 left-6 z-10 font-display text-5xl font-semibold tabular-nums text-primary mix-blend-difference md:bottom-8 md:left-10 md:text-7xl">
        {String(count).padStart(3, "0")}
      </div>
    </div>
  );
}
