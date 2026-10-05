# Personal Cinematic Photo Archive

Static site: HTML + Tailwind (CDN) + vanilla JS + GSAP/ScrollTrigger (CDN). No build step.

## Run
Open `index.html`, or `npx serve .`

## Edit
- Name: `js/data.js` -> `site.name`
- Photos: `js/data.js` -> `photos` (imageUrl, thumbnailUrl, category, year, title, date, crop). Later, replace the array with an API fetch.
- Replace `assets/images/portrait-*.webp` with your own files. Crops use `pos` (focal point %) and `zoom`.
- Colors: accent in `tailwind.config` (index.html) and `--accent` (css/styles.css).

## Deploy (GitHub + Vercel)
1. Put these files at the REPO ROOT (index.html must be visible on the repo's front page). Remove old Next.js files (package.json, app/, components/).
2. vercel.com > Add New > Project > Import the repo. Framework Preset: **Other**. Leave Build/Output empty. Deploy.
