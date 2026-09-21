# Ryven Creatives — Video Editing Studio Portfolio

Cinematic, video-first portfolio built with Next.js (App Router), TypeScript, Tailwind, and Framer Motion.

No database, no cloud/service-account setup required to run this.

## 1. Install

```bash
npm install
```

## 2. Configure content

Copy `.env.example` to `.env.local` and fill in:
- Hero showreel + poster URLs (Cloudinary)
- Contact links (Instagram, WhatsApp, email)

Edit copy, nav labels, and contact info in `src/data/site.ts`.
Edit projects in `src/data/portfolio.ts`.

## 3. Adding media

Each project's `media` in `src/data/portfolio.ts` has a `source`:

**`"cloudinary"`** — the main, recommended path for anything you want playing smoothly inline (autoplay, loop, no extra click):
1. Upload the video/image to Cloudinary (dashboard, or the `/upload` page below).
2. Paste the returned `secure_url` into `.env.local` (or straight into `portfolio.ts`).

**`"drive"`** — for a sample video that just lives in a Google Drive folder and you don't want to touch Cloudinary or any cloud account for it:
1. Get the file's shareable link (Anyone with the link → Viewer) and set it as `url`.
2. Optionally set `poster` to a thumbnail image URL.
3. That's it — no API keys, no service account. The site shows the poster
   with a **"WATCH VIDEO ↗"** button that opens the Drive file in a new
   tab, since Drive doesn't reliably support inline autoplay/loop the way
   a real video CDN does.

`src/data/portfolio.ts` documents both shapes inline. `src/lib` doesn't
exist in this version — media resolution is a single plain function
(`resolveMedia`) right there in `portfolio.ts`, no network/DB calls.

## 4. Run

```bash
npm run dev
```

## 5. Build for production

```bash
npm run build
npm run start
```

Deploy the `reelstudio` folder to Vercel as-is; add the same env vars in the Vercel dashboard.

## Notes

- No client names, stats, or testimonials are pre-filled — replace
  placeholders in `src/data/site.ts` and `src/data/portfolio.ts` with real
  content only when you have it.
- The `/upload` page uses an **unsigned** Cloudinary preset (set up once
  in your Cloudinary dashboard under Settings → Upload → Upload presets);
  no API secret is ever sent to the browser, and no backend is involved.
- If you later do get a Cloudinary/Google Cloud setup and want Drive
  videos to autoplay inline instead of opening in a new tab, that just
  means uploading them to Cloudinary too and switching their `source` to
  `"cloudinary"` — no code changes needed.
