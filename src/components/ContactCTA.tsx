"use client";

import MagneticButton from "./MagneticButton";
import Reveal from "./Reveal";
import { site, getWhatsappUrl } from "@/data/site";
import { mediaLinks } from "@/config/media-links";

export default function ContactCTA() {
  const lines = site.contact.heading;
  const backdrop = mediaLinks.projects[0]?.posterUrl;

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-background px-6 py-24 md:px-12 md:py-36">
      {/* Cinematic backdrop: first project's poster, pushed into the dark green */}
      {backdrop && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backdrop}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-cover object-center opacity-35 md:w-3/4"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/60" />
      <div className="film-lines pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[90rem]">
        <Reveal as="p" y={12} blur={10} duration={0.7} className="label mb-8 flex items-center gap-4 text-[0.625rem] text-muted">
          <span className="h-px w-10 bg-line-strong" />
          {site.contact.eyebrow}
        </Reveal>

        <Reveal
          as="h2"
          className="font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-primary md:text-7xl"
        >
          {lines.map((line, i) => (
            <span key={line} className={`block ${i === lines.length - 1 ? "text-accent" : ""}`}>
              {line}
            </span>
          ))}
        </Reveal>

        <Reveal as="p" delay={0.1} y={12} blur={8} className="mt-6 flex items-center gap-4 text-sm text-primary/80">
          {site.contact.availability}
          <span className="hidden h-px w-20 bg-line-strong sm:block" />
        </Reveal>

        <Reveal delay={0.15} y={16} className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton href={`mailto:${site.contact.email}`} variant="primary">
            GET IN TOUCH
          </MagneticButton>
          <MagneticButton href={site.contact.instagramUrl} variant="secondary" arrow="↗">
            INSTAGRAM DM
          </MagneticButton>
          <MagneticButton href={getWhatsappUrl("Hi! I'd like to start a project.")} variant="secondary" arrow="↗">
            WHATSAPP
          </MagneticButton>
        </Reveal>
      </div>

      {/* Side marker (decorative) */}
      <div className="label pointer-events-none absolute bottom-10 right-12 hidden flex-col items-end gap-2 text-[0.625rem] text-muted md:flex" aria-hidden>
        <span className="crosshair h-4 w-4 text-primary/70" />
        <span>EDITING</span>
        <span>MOTION</span>
        <span>VFX</span>
      </div>
    </section>
  );
}
