"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { mediaLinks } from "@/config/media-links";
import { site } from "@/data/site";

/**
 * Intro loader.
 *
 *  1. A tile grid fades in from the centre outwards. The centre "window" (logo box)
 *     uses EXACTLY the same colour as the loader background (--c-intro), so it reads
 *     as a clean cut-out rather than a separate box.
 *  2. Counter 000 → 100 + hairline progress run in the bottom bar.
 *  3. Bars slide out, the tiles wipe upwards column by column and the hero is revealed.
 *
 * All timings live in T. All colours come from CSS variables (see globals.css).
 */
const EASE_IO: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const T = {
  tilesIn: 0.9, // spread of the centre-out stagger
  count: 2.3, // counter 0 → 100
  hold: 0.35, // pause on 100
  exit: 1.0, // wipe duration
  heroLead: 0.45, // hero starts animating this long after the wipe begins
};

type Layout = { cols: number; rows: number; cStart: number; cSpan: number; rStart: number };
// Centre window is always an odd-aligned cut-out so the grid stays perfectly symmetric.
const DESKTOP: Layout = { cols: 7, rows: 5, cStart: 2, cSpan: 3, rStart: 2 };
const MOBILE: Layout = { cols: 3, rows: 7, cStart: 1, cSpan: 1, rStart: 3 };

type Props = {
  /** Fired when the wipe starts clearing – the page can begin animating in. */
  onReveal: () => void;
  /** Fired when the loader can be removed from the DOM. */
  onDone: () => void;
};

export default function GridPreloader({ onReveal, onDone }: Props) {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [exiting, setExiting] = useState(false);
  const [count, setCount] = useState(0);
  // Keep callbacks in refs so a parent re-render can never restart the timeline.
  const cb = useRef({ onReveal, onDone });
  cb.current = { onReveal, onDone };

  const posters = useMemo(
    () =>
      [mediaLinks.hero.posterUrl, ...mediaLinks.projects.map((p) => p.posterUrl)].filter(
        (u): u is string => Boolean(u)
      ),
    []
  );

  useEffect(() => {
    setLayout(window.innerWidth < 768 ? MOBILE : DESKTOP);
  }, []);

  useEffect(() => {
    if (!layout) return;
    const counter = animate(0, 100, {
      duration: T.count,
      ease: [0.45, 0, 0.2, 1],
      delay: 0.2,
      onUpdate: (v) => setCount(Math.round(v)),
    });
    const startExit = (0.2 + T.count + T.hold) * 1000;
    const t1 = setTimeout(() => setExiting(true), startExit);
    const t2 = setTimeout(() => cb.current.onReveal(), startExit + T.heroLead * 1000);
    const t3 = setTimeout(() => cb.current.onDone(), startExit + (T.exit + 0.45) * 1000);
    return () => {
      counter.stop();
      [t1, t2, t3].forEach(clearTimeout);
    };
  }, [layout]);

  const tiles = useMemo(() => {
    if (!layout) return [];
    const { cols, rows, cStart, cSpan, rStart } = layout;
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    const maxD = Math.hypot(cx, cy) || 1;
    const out: { key: string; c: number; r: number; d: number; centre: boolean; n: number }[] = [];
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const inCentre = r === rStart && c >= cStart && c < cStart + cSpan;
        if (inCentre && c !== cStart) continue; // the window is one spanning cell
        n += inCentre ? 0 : 1;
        const mc = inCentre ? cStart + (cSpan - 1) / 2 : c;
        out.push({
          key: `${c}-${r}`,
          c: inCentre ? cStart : c,
          r,
          d: Math.hypot(mc - cx, r - cy) / maxD,
          centre: inCentre,
          n,
        });
      }
    }
    return out;
  }, [layout]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" aria-hidden>
      {/* Solid colour layer. Fades out at the end so the gaps between tiles clear too. */}
      <motion.div
        className="absolute inset-0 bg-intro"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.5, delay: exiting ? 0.35 : 0, ease: "easeOut" }}
      />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={exiting ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
        transition={exiting ? { duration: 0.7, ease: EASE_IO } : { duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
        className="relative z-10 flex items-center justify-between bg-intro px-4 py-3.5 md:px-8 md:py-5"
      >
        <span className="label flex items-center gap-3 text-[0.625rem] text-primary/80">
          <span className="crosshair h-3.5 w-3.5 text-accent" />
          {site.shortName}
        </span>
        <span className="label text-[0.625rem] text-muted">SHOWREEL / {new Date().getFullYear()}</span>
      </motion.div>

      {/* Grid */}
      <div className="relative flex-1 px-1.5 md:px-2">
        {layout && (
          <div
            className="absolute inset-x-1.5 inset-y-0 grid gap-1.5 md:inset-x-2 md:gap-2"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((t) => (
              <Tile
                key={t.key}
                tile={t}
                layout={layout}
                poster={posters.length ? posters[t.n % posters.length] : undefined}
                exiting={exiting}
                cols={layout.cols}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar: counter + progress */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={exiting ? { y: "100%", opacity: 0 } : { y: 0, opacity: 1 }}
        transition={exiting ? { duration: 0.7, ease: EASE_IO } : { duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
        className="relative z-10 flex items-end justify-between gap-6 bg-intro px-4 pb-4 pt-3 md:px-8 md:pb-6 md:pt-4"
      >
        <span className="font-display text-5xl font-semibold leading-none tabular-nums text-primary md:text-7xl">
          {String(count).padStart(3, "0")}
        </span>
        <div className="mb-1 flex w-40 flex-col items-end gap-3 md:w-72">
          <span className="label text-[0.625rem] text-muted">LOADING REEL</span>
          <span className="relative block h-px w-full bg-line-strong">
            <span className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${count}%` }} />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function Tile({
  tile,
  layout,
  poster,
  exiting,
  cols,
}: {
  tile: { c: number; r: number; d: number; centre: boolean; n: number };
  layout: Layout;
  poster?: string;
  exiting: boolean;
  cols: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const { c, r, d, centre, n } = tile;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={
        exiting
          ? { opacity: 1, scale: 1, clipPath: "inset(0 0 100% 0)" }
          : { opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }
      }
      transition={
        exiting
          ? { duration: T.exit, ease: EASE_IO, delay: (c / cols) * 0.35 }
          : { duration: 0.75, ease: EASE_OUT, delay: 0.15 + d * T.tilesIn }
      }
      style={{
        gridColumn: centre ? `${layout.cStart + 1} / span ${layout.cSpan}` : c + 1,
        gridRow: r + 1,
      }}
      // The centre window shares the loader colour (bg-intro): no visible "box", only a hairline.
      className={
        centre
          ? "relative flex items-center justify-center overflow-hidden border border-line bg-intro"
          : "relative overflow-hidden bg-surface"
      }
    >
      {centre ? (
        <>
          {/* corner ticks */}
          {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "left-2 bottom-2 border-b border-l", "right-2 bottom-2 border-b border-r"].map(
            (pos) => (
              <motion.span
                key={pos}
                initial={{ opacity: 0 }}
                animate={{ opacity: exiting ? 0 : 1 }}
                transition={{ delay: exiting ? 0 : 0.9, duration: 0.5 }}
                className={`absolute h-2.5 w-2.5 border-accent/70 ${pos}`}
              />
            )
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/logo-mark.png"
            alt=""
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)", y: 10 }}
            animate={{ opacity: exiting ? 0 : 1, clipPath: "inset(0 0 0% 0)", y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: exiting ? 0 : 0.7 }}
            className="h-14 w-auto md:h-24"
          />
        </>
      ) : (
        <>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              onLoad={() => setLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? "opacity-60" : "opacity-0"}`}
              style={{ objectPosition: `${(n * 37) % 100}% ${(n * 53) % 100}%` }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-surface to-section" />
          )}
          {/* One green wash over every tile keeps the mosaic cohesive */}
          <div className="absolute inset-0 bg-intro/45" />
          <span className="absolute left-1.5 top-1.5 font-mono text-[9px] tracking-[0.2em] text-primary/60 md:left-2.5 md:top-2 md:text-[10px]">
            {String(n).padStart(2, "0")}
          </span>
        </>
      )}
    </motion.div>
  );
}
