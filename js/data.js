/* Central photo data. Later this array can come from an API: UI -> Gallery Service -> API -> Storage. */
(function () {
  const site = { name: 'NAMA KAMU', year: 2026 };
  const SRC = {
    light: { imageUrl: 'assets/images/portrait-light.webp', thumbnailUrl: 'assets/images/thumb/portrait-light.webp' },
    shadow: { imageUrl: 'assets/images/portrait-shadow.webp', thumbnailUrl: 'assets/images/thumb/portrait-shadow.webp' }
  };
  const ALT = { light: 'in a white suit', shadow: 'in a black suit' };
  /* pos = focal point (% of the source), zoom = crop magnification, ar = displayed aspect ratio */
  const mk = (n, src, category, year, title, date, ar, pos, zoom) => ({
    id: 'photo-' + String(n).padStart(3, '0'), src, ...SRC[src], width: 957, height: 1644,
    category, year, title, date, ar, pos, zoom,
    alt: `${title}: portrait ${ALT[src]}`
  });
  const photos = [
    mk(1, 'light', 'light', 2026, 'Arrival', '04 JAN 2026', '957/1644', '50% 50%', 1),
    mk(2, 'light', 'light', 2026, 'Quiet Room', '19 FEB 2026', '16/10', '50% 27%', 1.6),
    mk(3, 'light', 'detail', 2026, 'Silver', '02 MAR 2026', '4/5', '50% 24%', 3),
    mk(4, 'shadow', 'shadow', 2026, 'After Dark', '27 MAR 2026', '957/1644', '50% 50%', 1),
    mk(5, 'shadow', 'shadow', 2025, 'Mischief', '11 SEP 2025', '4/5', '50% 24%', 2.6),
    mk(6, 'light', 'detail', 2025, 'Cross', '30 AUG 2025', '1/1', '37% 27%', 4.5),
    mk(7, 'shadow', 'detail', 2025, 'Chain', '14 JUL 2025', '4/3', '72% 44%', 3.6),
    mk(8, 'shadow', 'shadow', 2024, 'Frame', '08 DEC 2024', '3/4', '50% 30%', 1.6),
    mk(9, 'light', 'detail', 2024, 'Lens', '21 OCT 2024', '16/10', '50% 8%', 3.8),
    mk(10, 'light', 'light', 2023, 'Tie', '05 MAY 2023', '3/4', '50% 52%', 2.4),
    mk(11, 'shadow', 'shadow', 2023, 'Between', '17 APR 2023', '1/1', '50% 20%', 2.1),
    mk(12, 'light', 'light', 2022, 'Still', '29 NOV 2022', '4/5', '50% 25%', 2.2),
    mk(13, 'shadow', 'shadow', 2022, 'Echo', '12 JUN 2022', '4/5', '50% 22%', 1.9)
  ];
  window.Archive = { site, photos, byId: (id) => photos.find((p) => p.id === id) };
})();
