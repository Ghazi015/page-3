/* Boot: names, rendering, navigation, loader. */
(function (A) {
  const g = window.gsap, reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const $ = (s) => document.querySelector(s);

  document.querySelectorAll('[data-site]').forEach((el) => { el.textContent = A.site[el.dataset.site]; });
  document.title = `${A.site.name} — A Personal Visual Archive`;
  A.init();

  /* menu */
  const menu = $('#menu'), btn = $('#menuBtn');
  const toggle = (open) => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    (open ? $('#menuClose') : btn).focus();
  };
  btn.addEventListener('click', () => toggle(true));
  $('#menuClose').addEventListener('click', () => toggle(false));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) toggle(false); });

  /* nav background, progress, active link */
  const bg = $('.nav-bg'), prog = $('#progress');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bg.classList.toggle('on', scrollY > innerHeight * .9);
      prog.textContent = String(Math.round(Math.min(1, scrollY / max) * 100)).padStart(3, '0');
      tick = false;
    });
  }, { passive: true });
  const links = [...document.querySelectorAll('.nav-link')];
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((l) => l.setAttribute('aria-current', String(l.getAttribute('href') === '#' + e.target.id)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['home', 'gallery', 'stories', 'archive'].forEach((id) => io.observe(document.getElementById(id)));

  /* loader: short and never blocking */
  const L = $('#loader');
  const end = () => { L.remove(); };
  if (!g || reduced) { end(); return; }
  const cnt = L.querySelector('[data-count]');
  g.timeline({ onComplete: end })
    .to(L.querySelector('[data-bar]'), { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
    .call(() => { cnt.textContent = '02'; }, null, .45)
    .call(() => { cnt.textContent = '03'; }, null, .9)
    .to(L, { yPercent: -100, duration: .9, ease: 'power3.inOut' }, 1.4)
    .call(A.heroIntro, null, 1.9);
})(window.Archive);
