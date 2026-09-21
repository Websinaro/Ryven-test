/**
 * ============================================================
 * PROJECT COPY (titles / descriptions only)
 * ============================================================
 * Video and image URLs are NOT edited here anymore — see
 * `src/config/media-links.ts`, the single file for pasting
 * Cloudinary links. This file only holds the text shown next
 * to each of the 3 sample videos.
 * ============================================================
 */

import { mediaLinks } from "@/config/media-links";

export type ResolvedMedia = {
  playable: boolean;
  url: string;
  poster?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

export const portfolio = {
  hero: {
    posterUrl: mediaLinks.hero.posterUrl,
  },

  // Exactly 3 sample projects. Do not add more — the homepage only
  // ever renders the first 3 entries in `mediaLinks.projects`.
  projects: [
    {
      id: "01",
      title: "Project One",
      description: "Short one-line description of the edit and its goal.",
    },
    {
      id: "02",
      title: "Project Two",
      description: "Short one-line description of the edit and its goal.",
    },
    {
      id: "03",
      title: "Project Three",
      description: "Short one-line description of the edit and its goal.",
    },
  ].slice(0, 3) as Project[],
};

/** Cloudinary URL for the hero background video, straight from config. */
export function resolveHeroMedia(): ResolvedMedia {
  const url = mediaLinks.hero.videoUrl || "";
  return { playable: Boolean(url), url, poster: mediaLinks.hero.posterUrl };
}

/**
 * Resolves a project's Cloudinary media by matching array position
 * (project 0 -> mediaLinks.projects[0], etc). Pure and synchronous.
 */
export function resolveProjectMedia(index: number): ResolvedMedia {
  const entry = mediaLinks.projects[index];
  const url = entry?.videoUrl || "";
  return { playable: Boolean(url), url, poster: entry?.posterUrl };
}
