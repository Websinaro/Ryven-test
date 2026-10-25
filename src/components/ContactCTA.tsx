"use client";

import MagneticButton from "./MagneticButton";
import Reveal from "./Reveal";
import { site, getWhatsappUrl } from "@/data/site";

export default function ContactCTA() {
  return (
    <section id="contact" className="border-t border-line px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl rounded-2xl border border-line bg-surface/40 px-6 py-16 text-center md:py-28">
        <Reveal
          as="h2"
          className="font-display text-4xl font-semibold leading-tight tracking-tight text-primary text-balance md:text-6xl"
        >
          {site.contact.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Reveal>

        <Reveal
          delay={0.15}
          y={16}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href={site.contact.instagramUrl} variant="primary">
            INSTAGRAM DM
          </MagneticButton>
          <MagneticButton href={getWhatsappUrl("Hi! I'd like to start a project.")} variant="secondary">
            WHATSAPP
          </MagneticButton>
          <MagneticButton href={`mailto:${site.contact.email}`} variant="secondary">
            EMAIL
          </MagneticButton>
        </Reveal>

        <Reveal as="p" delay={0.3} y={12} blur={8} className="mt-16 text-xs tracking-widest text-muted">
          © {new Date().getFullYear()} {site.contact.email}
        </Reveal>
      </div>
    </section>
  );
}
