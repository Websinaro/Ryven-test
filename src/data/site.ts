// Central, easily editable site configuration.
// Change copy, contact links, and nav labels here without touching components.

export const site = {
  companyName: "Ryven Creatives",
  // Compact mark used in the nav bar / tight spaces.
  shortName: "RYVEN",

  nav: {
    work: "WORK",
    about: "ABOUT",
    contact: "CONTACT",
  },

  hero: {
    headingLines: ["WE TURN FOOTAGE", "INTO ATTENTION."],
    subheading: "Video Editing • Reels • Commercials • Motion",
    primaryCta: { label: "VIEW OUR WORK", href: "#work" },
    secondaryCta: { label: "START A PROJECT", href: "#contact" },
  },

  about: {
    heading: "ABOUT",
    statement:
      "We're an editing-first studio. We take raw footage and shape it into something people actually stop scrolling for.",
    services: ["EDITING", "MOTION", "SOCIAL CONTENT", "VISUAL STORYTELLING"],
    // Leave empty / null until real numbers exist. Do not invent stats.
    stats: [] as { label: string; value: string }[],
  },

  contact: {
    heading: ["LET'S MAKE", "SOMETHING WORTH WATCHING."],
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/yourstudio",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "10000000000", // digits only, country code first
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@yourstudio.com",
  },
};

export function getWhatsappUrl(message?: string) {
  const base = `https://wa.me/${site.contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
