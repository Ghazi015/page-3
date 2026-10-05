/* Contextual cursor: desktop, fine pointer, motion allowed only. */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const c = document.getElementById('cursor'), t = c.querySelector('span');
  const LABEL = { view: 'View', open: 'Open', save: 'Save' };
  const g = window.gsap;
  const mx = g ? g.quickTo(c, 'x', { duration: .35, ease: 'power3.out' }) : (x) => { c.style.left = x + 'px'; };
  const my = g ? g.quickTo(c, 'y', { duration: .35, ease: 'power3.out' }) : (y) => { c.style.top = y + 'px'; };
  c.classList.add('on');
  addEventListener('pointermove', (e) => { mx(e.clientX); my(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest && e.target.closest('[data-cursor]');
    c.classList.toggle('big', !!el);
    if (el) t.textContent = LABEL[el.dataset.cursor] || '';
  });
  document.addEventListener('pointerleave', () => c.classList.remove('big'));
})();
