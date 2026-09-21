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
  hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  return (
    <section id="top" className="relative w-full overflow-hidden bg-background md:min-h-[34rem]">
      {/* In normal flow: the hero is exactly as tall as the full, uncropped video */}
      <BackgroundVideo src={heroMedia.url} poster={portfolio.hero.posterUrl} />

      {/* Light top scrim only so the navbar stays readable (no side vignette —
          the sides of the footage stay fully visible) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />

      {/* Content: overlaps the faded bottom of the video on mobile; on desktop it
          is pinned to the bottom of the first screen (or of the video if shorter) */}
      <div className="relative z-10 -mt-24 md:absolute md:inset-x-0 md:top-0 md:mt-0 md:h-[min(100%,100svh)]">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex h-full flex-col justify-end px-6 pb-20 md:px-12 md:pb-24 text-shadow-depth"
      >
        <motion.p variants={item} className="mb-4 text-xs font-medium tracking-[0.2em] text-muted md:text-sm">
          {site.hero.subheading}
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-tight text-primary text-balance md:text-7xl lg:text-8xl"
        >
          {site.hero.headingLines.map((line) => (
            <span key={line} className="block overflow-hidden">
              <motion.span variants={item} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton href={site.hero.primaryCta.href} variant="primary">
            {site.hero.primaryCta.label}
          </MagneticButton>
          <MagneticButton href={site.hero.secondaryCta.href} variant="secondary">
            {site.hero.secondaryCta.label}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Project indicator */}
      <div className="absolute bottom-8 right-6 z-10 hidden text-xs tracking-widest text-muted md:right-12 md:block">
        01 / {String(portfolio.projects.length).padStart(2, "0")}
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
          className="h-9 w-[1px] bg-gradient-to-b from-primary/70 to-transparent"
        />
      </motion.div>
      </div>
    </section>
  );
}
