/**
 * ============================================================
 * MEDIA LINKS — the ONLY file you need to touch to change video/images
 * ============================================================
 * How this works:
 *   1. Upload your video (and optionally a poster/thumbnail image) to
 *      Cloudinary — either from the Cloudinary dashboard, or from the
 *      built-in helper at /upload on this site.
 *   2. Copy the "secure_url" Cloudinary gives you back.
 *   3. Paste it into the matching slot below, between the quotes.
 *
 * ⚠️ USE THE DIRECT FILE URL, NOT THE PLAYER EMBED URL.
 *   Correct  (works here):
 *     https://res.cloudinary.com/<cloud_name>/video/upload/<public_id>.mp4
 *   Wrong (this is for an <iframe> embed elsewhere, NOT for this site):
 *     https://player.cloudinary.com/embed/?cloud_name=...&public_id=...
 *   If your URL contains "player.cloudinary.com/embed", rebuild it using
 *   the pattern above with your cloud_name + public_id, or open the
 *   asset in the Cloudinary Media Library and copy the "Copy URL"
 *   button (not "Copy embed code").
 *
 * Everything on the site is played straight from Cloudinary — there is
 * no other video source to configure. Leave a slot as "" (empty string)
 * and that spot will just show a clean placeholder until you fill it in.
 *
 * The homepage only ever shows exactly 3 project videos (PROJECT_1,
 * PROJECT_2, PROJECT_3) plus the one hero/background video. Do not add
 * a 4th — extra entries are ignored.
 * ============================================================
 */

export const mediaLinks = {
  // Full-bleed background video behind the homepage headline.
  hero: {
    videoUrl: "https://res.cloudinary.com/nwvobioj/video/upload/portfolio_1080P_HD.mp4",
    // Shown while the video loads / before it's configured.
    // Cloudinary can auto-generate a thumbnail from the same clip: swap
    // the extension from .mp4 to .jpg on the line above to get one free.
    posterUrl: "https://res.cloudinary.com/nwvobioj/video/upload/portfolio_1080P_HD.jpg",
  },

  // Exactly 3 sample project videos, shown in order.
  projects: [
    {
      id: "01",
      videoUrl: "",
      posterUrl: "",
    },
    {
      id: "02",
      videoUrl: "",
      posterUrl: "",
    },
    {
      id: "03",
      videoUrl: "",
      posterUrl: "",
    },
  ],
};
