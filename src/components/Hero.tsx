"use client";

import { motion } from "framer-motion";
import BackgroundVideo from "./BackgroundVideo";
import MagneticButton from "./MagneticButton";
import { site } from "@/data/site";
import { portfolio, resolveHeroMedia } from "@/data/portfolio";

const heroMedia = resolveHeroMedia();

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const lineItem = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const lines = site.hero.headingLines;
  const total = String(portfolio.projects.length).padStart(2, "0");

  return (
    <section id="top" className="relative w-full overflow-hidden bg-background md:min-h-[34rem]">
      {/* In normal flow: the hero is exactly as tall as the full, uncropped video */}
      <BackgroundVideo src={heroMedia.url} poster={portfolio.hero.posterUrl} />

      {/* Light scrims only: a soft top fade for the navbar and a gentle left fade
          (desktop) so the headline reads. The footage stays fully visible. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/60 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-background/70 via-background/25 to-transparent md:block" />

      {/* Content: overlaps the faded bottom of the video on mobile; on desktop it
          is pinned to the bottom of the first screen (or of the video if shorter) */}
      <div className="relative z-10 -mt-24 md:absolute md:inset-x-0 md:top-0 md:mt-0 md:h-[min(100%,100svh)]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex h-full flex-col justify-end px-6 pb-16 md:justify-center md:px-12 md:pb-24 md:pt-24 text-shadow-depth"
        >
          <motion.p variants={item} className="label mb-6 !tracking-[0.22em] text-accent">
            {site.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="max-w-3xl font-display text-[2.75rem] font-bold uppercase leading-[0.98] tracking-tight text-primary md:text-7xl lg:text-[5.25rem]"
          >
            {lines.map((line, li) => {
              const isLast = li === lines.length - 1;
              const words = line.split(" ");
              const lastWord = words[words.length - 1];
              const head = words.slice(0, -1).join(" ");
              return (
                <span key={line} className="block overflow-hidden pb-1 pr-2">
                  <motion.span variants={lineItem} className="block">
                    {isLast ? (
                      <>
                        {head && <>{head} </>}
                        <em className="font-bold italic text-accent">{lastWord}</em>
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              );
            })}
          </motion.h1>

          <motion.p variants={item} className="mt-7 max-w-md text-sm leading-relaxed text-primary/75 md:text-[0.95rem]">
            {site.hero.description}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton href={site.hero.primaryCta.href} variant="primary">
              {site.hero.primaryCta.label}
            </MagneticButton>
            <MagneticButton href={site.hero.secondaryCta.href} variant="secondary" arrow="↗">
              {site.hero.secondaryCta.label}
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Frame / timecode marker (decorative) */}
        <div className="label pointer-events-none absolute right-6 top-24 hidden items-start gap-3 text-right text-[0.625rem] text-muted md:right-12 md:flex" aria-hidden>
          <div>
            <p>FRAME 0248</p>
            <p>00:14:32</p>
          </div>
          <span className="crosshair h-4 w-4 text-primary/70" />
        </div>
        <div className="pointer-events-none absolute right-12 top-44 hidden h-56 w-px bg-line-strong md:block" aria-hidden />

        {/* "Featured work" marker, bottom-left */}
        <div className="label pointer-events-none absolute bottom-8 left-12 hidden items-center gap-3 text-[0.625rem] text-muted md:flex" aria-hidden>
          <span className="crosshair h-4 w-4 text-accent" />
          FEATURED WORK
          <span className="h-px w-28 bg-line-strong" />
        </div>

        {/* Project indicator */}
        <div className="label absolute bottom-8 right-6 z-10 hidden text-[0.625rem] text-muted md:right-12 md:block">
          01 / {total}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-9 w-[1px] bg-gradient-to-b from-accent/80 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
