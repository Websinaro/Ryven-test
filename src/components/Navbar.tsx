"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";
import { useIntroDone } from "./intro";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("#top");
  const introDone = useIntroDone();

  const links = [
    { label: site.nav.home, href: "#top" },
    { label: site.nav.work, href: "#work" },
    { label: site.nav.about, href: "#about" },
    { label: site.nav.contact, href: "#contact" },
  ];

  // Scroll-spy: underline follows the section that crosses the middle of the viewport.
  useEffect(() => {
    const els = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 grid grid-cols-[1fr_auto] items-center px-6 py-6 md:grid-cols-[1fr_auto_1fr] md:px-12"
      >
        <a href="#top" aria-label={site.shortName} className="flex items-center gap-3 justify-self-start text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-9 w-auto md:h-10" />
          <span className="label hidden !tracking-[0.35em] sm:inline">{site.shortName}</span>
        </a>

        <ul className="label hidden gap-10 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`block border-b pb-1.5 transition-colors hover:text-primary ${
                  link.href === current ? "border-accent text-primary" : "border-transparent text-muted"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="label hidden items-center gap-2 justify-self-end rounded-full border border-line-strong px-5 py-3 text-primary transition-colors hover:border-accent hover:text-accent md:inline-flex"
        >
          {site.hero.secondaryCta.label} <span aria-hidden>↗</span>
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[7px] justify-self-end md:hidden"
        >
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }} className="h-px w-7 bg-accent" />
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-px w-7 bg-accent" />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }} className="h-px w-7 bg-accent" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-40 overflow-hidden border-y border-line bg-section md:hidden"
          >
            <ul className="label flex flex-col px-6 pb-4 pt-2 text-sm">
              {links.map((link) => (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-primary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
