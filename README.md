# Dr. Prashanth S. — Physiotherapy website

A single landing page built with Vite + React + TypeScript. It is pre-rendered to plain HTML at build time, so search engines and link previews see the full content. The build also generates `/prashanth-s.vcf` for the "Save contact" button.

## Commands

```bash
npm install
npm run dev          # local development
npm run build        # typecheck + build + pre-render  → dist/
npm run check        # QA on dist/: console errors, links, tap targets, overflow, vCard
npm run lint
npm run images       # regenerate public/images from local source-photos/ (not committed)
npm run assets       # regenerate favicons and og-image.jpg
```

## Going live (production vs staging)

The domain is set in one place, `VITE_SITE_URL` (see `.env.example`).

- **Not set (staging, the default):** the build gets `noindex`, `robots.txt` = `Disallow: /`, no sitemap and no canonical or OG URLs.
- **Set, e.g. `VITE_SITE_URL=https://www.your-domain.in`:** the build gets `index, follow`, canonical and Open Graph URLs, `sitemap.xml` and a robots.txt that points to the sitemap. The vCard gets the website URL.
- Localhost and private-network URLs are rejected.
- `VITE_ALLOW_INDEXING=false` forces noindex on a staging deployment that has its own domain.

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages and so on). Set `VITE_SITE_URL` only in the **production** environment's build settings.

## Patient reviews (Vercel)

The review form stores submissions in MongoDB. New reviews remain private until Dr. Prashanth approves them in `/reviews-admin`; only approved reviews appear on the landing page. The form collects a display name, star rating and review text, requires consent, and asks clients not to include health details.

Set these **server-side** environment variables in Vercel for preview and production as needed:

- `MONGODB_URI`: MongoDB Atlas connection string. Keep it server-side; never use a `VITE_` prefix.
- `MONGODB_DB`: database name (defaults to `physio`).
- `REVIEWS_ADMIN_PASSWORD`: a strong, unique password for `/reviews-admin`.

For local development, copy `.env.example` to `.env.local` and fill in the server-only values. The Vite development server serves the same API handlers locally. Do not commit `.env.local`.

The API routes in `api/` require a host that supports Vercel Functions. Static-only hosts can still serve the landing page, but the MongoDB-backed review form and moderation inbox require Vercel deployment (or an equivalent server-side implementation).

## Visitor analytics

The site includes Vercel Web Analytics to report page views and unique visitors. In the Vercel project dashboard, open **Analytics** and enable Web Analytics. Data will appear there after the updated site is deployed and visitors use it.

After launch:
1. Add the domain to Google Search Console.
2. Submit `https://<domain>/sitemap.xml`.
3. Request indexing for `/`.

Search Console helps Google discover the site, but neither indexing nor ranking is guaranteed.

## Printed visiting card

`npm run card` writes the visiting card to `visiting card/` (separate from the website):

- `visiting-card.pdf`: print-ready, single-sided PDF with 3 mm bleed (95 × 57 mm artboard); trim to 89 × 51 mm.
- `visiting-card-preview.png`: high-resolution image for sharing or review.

The card includes a QR code that opens `https://physio-prashanth.vercel.app/`. Card text (name, phone, email and address) is set in `scripts/make-visiting-card.mjs`.

## Lottie animation

The home-visit section uses a locally hosted physiotherapy animation at `public/animations/physiotherapy.lottie`.
It is by [Oğuz AKAR on LottieFiles](https://lottiefiles.com/free-animation/physiotherapy-01i8mPRoEi), used under the
[Lottie Simple License](https://lottiefiles.com/page/license). The visible attribution is included on the page, and the
animation stays still when a visitor has requested reduced motion.

## Image privacy

Only the professional portrait and clinician-in-clinic images are included in the public site. Patient treatment
photographs and original source photos are not committed or published. Keep originals in the ignored `source-photos/`
folder; `npm run images` generates only the approved professional images and removes older treatment-photo derivatives.

## Content rules

All professional details live in `src/config.ts` and `src/data/content.ts`. Only add information that Dr. Prashanth has confirmed. Social links are empty on purpose. Testimonials have no section; add one only if you have genuine reviews from patients who consented. The structured data is a `Person` + `Service` (Bengaluru area served), not a `LocalBusiness`, because there are no clinic hours or premises details. Photo EXIF data, including GPS, is removed during image processing.
