// Central, easily editable site configuration.
// Change copy, contact links, and nav labels here without touching components.

export const site = {
  companyName: "Ryven Creatives",
  // Compact mark used in the nav bar / tight spaces.
  shortName: "RYVEN",

  nav: {
    home: "HOME",
    work: "WORK",
    about: "ABOUT",
    contact: "CONTACT",
  },

  hero: {
    headingLines: ["WE TURN FOOTAGE", "INTO ATTENTION."],
    // The last word of the last heading line is shown in the accent colour, italic.
    eyebrow: "EDITING / MOTION / VFX",
    description:
      "A creative studio focused on high-impact video editing, motion graphics and visual effects for brands, creators and storytellers.",
    primaryCta: { label: "VIEW OUR WORK", href: "#work" },
    secondaryCta: { label: "START A PROJECT", href: "#contact" },
  },

  // Tabs in the bar under the hero. Tags on each project (data/portfolio.ts) highlight when their tab is active.
  specialties: ["MOTION GRAPHICS", "REEL EDITING", "AUTOMOTIVE", "ADS"],

  about: {
    heading: "ABOUT",
    statement:
      "We're an editing-first studio. We take raw footage and shape it into something people actually stop scrolling for.",
    services: ["EDITING", "MOTION", "VFX", "SOCIAL CONTENT", "VISUAL STORYTELLING"],
    // Leave empty / null until real numbers exist. Do not invent stats.
    stats: [] as { label: string; value: string }[],
  },

  // PLACEHOLDERS — replace with real client quotes before launch (or set to [] to hide the section).
  testimonials: [
    { quote: "Replace with a real client quote about working with you.", name: "Client Name", role: "Brand / Role" },
    { quote: "Replace with a real client quote about the results.", name: "Client Name", role: "Brand / Role" },
    { quote: "Replace with a real client quote about the process.", name: "Client Name", role: "Brand / Role" },
    { quote: "Replace with a real client quote about turnaround.", name: "Client Name", role: "Brand / Role" },
  ] as { quote: string; name: string; role: string }[],

  contact: {
    eyebrow: "LET'S COLLABORATE",
    heading: ["LET'S MAKE", "SOMETHING", "WORTH WATCHING."],
    availability: "Available for freelance / collaboration",
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/yourstudio",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "10000000000", // digits only, country code first
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@yourstudio.com",
  },

  // Footer links
  social: [
    { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/yourstudio" },
    { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com" },
    { label: "Vimeo", href: process.env.NEXT_PUBLIC_VIMEO_URL || "https://vimeo.com" },
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com" },
  ],
};

export function getWhatsappUrl(message?: string) {
  const base = `https://wa.me/${site.contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
