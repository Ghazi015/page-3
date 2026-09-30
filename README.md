# Atelier Void — cinematic portfolio

A React + Vite + Tailwind CSS + shadcn-style Radix primitives + GSAP ScrollTrigger + Lucide React creative studio portfolio. All images and fonts ship locally.

## Run locally / Termux

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Production: `npm run build` then `npm run preview -- --host 0.0.0.0`.

## Backend handoff

- `src/data/mock.js`: relational `categories` and `projects` records with UUIDs, ISO `created_at`, and `category_id` foreign keys. Replace `fetchProjects()` with a free-tier backend query.
- `src/hooks/useProjects.js`: client loading/error/retry state. The UI only consumes this hook; add a service client here if desired.
- `src/data/mock.js`: replace `createInquiry()` with an authenticated edge function or API endpoint that inserts into an `inquiries` table. **The current demo intentionally does not send or persist a message.** Never put backend service-role credentials in frontend code.
- `src/hooks/useInquiry.js`: submission lifecycle for the contact form. It handles latency and errors without changing presentation code.
- Append `?simulateError=1` to see archive cold-start error and retry; `?simulateContactError=1` to see form submission error.

## Notes

GSAP uses only free core and ScrollTrigger. All scroll effects use `scrub: 1`, animate transforms or opacity, and revert on unmount with `gsap.context()`. Animations respect reduced-motion preferences. The project transition is a transform-only shared-element illusion. Assets include explicit intrinsic dimensions and below-fold images lazy-load. The above-fold hero is preloaded with high fetch priority.
