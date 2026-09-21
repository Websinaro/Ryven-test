"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: site.nav.work, href: "#work" },
    { label: site.nav.about, href: "#about" },
    { label: site.nav.contact, href: "#contact" },
  ];

  return (
    <header className="absolute inset-x-0 top-0">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 flex items-center justify-between px-6 py-6 mix-blend-exclusion md:px-12"
      >
        <a href="#top" className="font-display text-lg font-semibold tracking-wide text-primary">
          {site.shortName}
        </a>

        <ul className="hidden gap-8 text-sm font-medium tracking-wide text-primary md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-opacity hover:opacity-60">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            className="h-[1.5px] w-6 bg-primary"
          />
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-[1.5px] w-6 bg-primary" />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            className="h-[1.5px] w-6 bg-primary"
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-40 overflow-hidden border-t border-white/10 bg-background md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 pb-6 text-lg">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-medium text-primary transition-colors hover:text-accent-bright"
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
