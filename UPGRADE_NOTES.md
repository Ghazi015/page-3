# Genevieve Reine Luciano — Editorial Website Upgrade

The homepage has been upgraded using the current landonorris.com information architecture as visual inspiration, adapted for a personal photo archive rather than a commercial/athlete site.

## Main changes
- Full-screen hero now cycles through 6 images.
- Desktop pointer movement across the hero changes the active image by visual zone.
- Hero thumbnail index also changes the image on hover/focus/tap.
- GSAP crossfade/scale transitions and scroll parallax are used without paid plugins.
- Desktop navigation is visible in the fixed header; mobile keeps the menu overlay.
- Added editorial overlapping feature sections with large photography and floating secondary images.
- Upgraded the horizontal photo archive into a pinned editorial sequence.
- Upgraded the two-world section into a large split-image gateway.
- Added a large asymmetric archive preview before the closing section.
- Added a restrained social/closing section to echo the reference site's social footer rhythm.
- Existing gallery, photo viewer, world pages and admin data layer remain in place.
- Reduced-motion behavior remains supported.

## Validation
- All JSX files were syntax-checked with TypeScript's parser (`tsc --noEmit`).
- A full Vite production build could not be executed in this environment because npm package downloads are unavailable; no source dependency changes were required.
