/* Rendering: photo tiles, worlds (categories), contact sheet and archive. */
(function (A) {
  const $ = (s, r = document) => r.querySelector(s);
  const pad = (n) => String(n).padStart(2, '0');
  const ratio = (s) => { const [a, b] = s.split('/').map(Number); return a / b; };

  A.frame = (p, lazy = true) =>
    `<span class="frame" style="--ar:${p.ar}"><img src="${p.zoom > 1.5 ? p.imageUrl : p.thumbnailUrl}" alt="${p.alt}" width="${p.width}" height="${p.height}" ${lazy ? 'loading="lazy" ' : ''}decoding="async" style="object-position:${p.pos};transform-origin:${p.pos};transform:scale(${p.zoom})"></span>`;

  A.tile = (p, cls = '') =>
    `<button type="button" class="tile ${cls}" data-id="${p.id}" data-cursor="view" aria-label="Open photograph: ${p.title}, ${p.year}">${A.frame(p)}<span class="cap"><i></i><span class="label">${p.year} / ${p.category}</span><span class="label">View →</span></span></button>`;

  A.mountSlots = () => document.querySelectorAll('[data-slot]').forEach((el) => { el.innerHTML = A.tile(A.byId(el.dataset.slot)); });

  const TONE = { light: '#151514', shadow: '#070708', detail: '#0f1318' };
  const NOTE = { light: 'White rooms and quiet light.', shadow: 'After the lights go down.', detail: 'Small things, held close.' };
  const stage = $('#stage');

  const lanes = (cat) => {
    const l = [[], [], []];
    A.photos.filter((p) => p.category === cat).forEach((p, i) => l[i % 3].push(p));
    return l.map((g, i) => `<div class="lane lane-${i}">${g.map((p) => A.tile(p)).join('')}</div>`).join('');
  };

  A.setCategory = (cat, instant) => {
    document.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === cat));
    $('#catTitle').textContent = cat[0].toUpperCase() + cat.slice(1);
    $('#catNote').textContent = NOTE[cat];
    const g = window.gsap, swap = () => { stage.innerHTML = lanes(cat); };
    if (!g || instant || matchMedia('(prefers-reduced-motion:reduce)').matches) { swap(); $('#gallery').style.background = TONE[cat]; return; }
    g.to('#gallery', { backgroundColor: TONE[cat], duration: 1, ease: 'power2.out' });
    g.to(stage, { opacity: 0, y: 24, duration: .35, ease: 'power2.in', onComplete: () => {
      swap();
      g.fromTo(stage.querySelectorAll('.tile'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .08 });
      g.to(stage, { opacity: 1, y: 0, duration: .1 });
      window.ScrollTrigger && window.ScrollTrigger.refresh();
    } });
  };

  A.init = () => {
    A.mountSlots();
    document.querySelectorAll('[data-cat]').forEach((b) => {
      b.querySelector('sup').textContent = pad(A.photos.filter((p) => p.category === b.dataset.cat).length);
      b.addEventListener('click', () => A.setCategory(b.dataset.cat));
    });
    A.setCategory('light', true);

    $('#strip').innerHTML = A.photos.slice(0, 9).map((p, i) =>
      `<div class="sheet" style="--r:${Math.min(ratio(p.ar), 1.3)}">${A.tile(p)}<p class="label">${pad(i + 1)}</p></div>`).join('');

    const years = [...new Set(A.photos.map((p) => p.year))];
    $('#archiveList').innerHTML = years.map((y) => {
      const list = A.photos.filter((p) => p.year === y);
      return `<article class="yr"><header class="flex items-end justify-between"><h3 class="yr-n" data-year>${y}</h3><p class="label text-mute pb-2">${pad(list.length)} photographs</p></header><div class="yr-row">${list.map((p) => A.tile(p)).join('')}</div></article>`;
    }).join('');

    /* artistic fallback for images that fail to load */
    document.addEventListener('error', (e) => {
      const f = e.target.closest && e.target.closest('.frame, .vwr-frame');
      if (f && e.target.tagName === 'IMG') f.classList.add('is-broken');
    }, true);
  };
})(window.Archive);
