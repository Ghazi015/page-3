/* Fullscreen viewer: keyboard, swipe, focus trap, download. */
(function (A) {
  const v = document.getElementById('viewer');
  const q = (n) => v.querySelector(`[data-v=${n}]`);
  const frame = q('frame'), dl = q('download');
  const N = A.photos.length, pad = (n) => String(n).padStart(2, '0');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let i = 0, opener = null, sx = 0;

  function show(n, dir = 0) {
    i = (n + N) % N;
    const p = A.photos[i], [a, b] = p.ar.split('/').map(Number);
    frame.style.setProperty('--ar', a / b);
    frame.classList.remove('is-broken');
    frame.innerHTML = `<img src="${p.imageUrl}" alt="${p.alt}" width="${p.width}" height="${p.height}" decoding="async" style="object-position:${p.pos};transform-origin:${p.pos};transform:scale(${p.zoom})">`;
    if (!reduced && frame.animate) frame.animate([{ opacity: 0, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' });
    q('title').textContent = p.title;
    q('meta').textContent = `${p.date} — ${p.category}`;
    q('index').textContent = `${pad(i + 1)} / ${pad(N)}`;
    dl.href = p.imageUrl;
    dl.setAttribute('download', `${p.src === 'light' ? 'portrait-light' : 'portrait-shadow'}.webp`);
  }

  function open(n, from) {
    opener = from || document.activeElement;
    show(n);
    v.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    q('close').focus();
  }
  function close() {
    v.classList.remove('open');
    document.documentElement.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  }

  /* download: plain <a download> for same-origin; blob fallback for remote storage */
  dl.addEventListener('click', (e) => {
    const u = new URL(dl.href, location.href);
    if (u.origin === location.origin) return;
    e.preventDefault();
    fetch(u).then((r) => r.blob()).then((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = dl.getAttribute('download'); a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }).catch(() => window.open(u.href, '_blank', 'noopener'));
  });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('.tile[data-id]');
    if (t) open(A.photos.findIndex((p) => p.id === t.dataset.id), t);
  });
  q('close').addEventListener('click', close);
  q('prev').addEventListener('click', () => show(i - 1, -1));
  q('next').addEventListener('click', () => show(i + 1, 1));
  v.addEventListener('click', (e) => { if (e.target.classList.contains('vwr-stage')) close(); });

  document.addEventListener('keydown', (e) => {
    if (!v.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(i - 1, -1);
    else if (e.key === 'ArrowRight') show(i + 1, 1);
    else if (e.key === 'Tab') {
      const f = [...v.querySelectorAll('button, a[href]')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  v.addEventListener('touchstart', (e) => { sx = e.changedTouches[0].clientX; }, { passive: true });
  v.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });

  A.viewer = { open, close };
})(window.Archive);
