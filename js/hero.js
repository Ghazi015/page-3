/* Hero: cursor zones switch the dominant photograph (left / right / center). */
(function (A) {
  const hero = document.getElementById('home');
  const imgs = [...hero.querySelectorAll('.hero-img')];
  const ticks = [...hero.querySelectorAll('[data-hero-tick]')];
  const stack = document.getElementById('heroStack');
  const name = hero.querySelector('[data-hero-name]');
  const g = window.gsap, reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const BASE = [1, 1, 2.1];
  let cur = 0, timer;

  if (g) g.set(imgs[2], { scale: BASE[2], transformOrigin: '50% 30%' });

  function set(n) {
    if (n === cur) return;
    const prev = imgs[cur], next = imgs[n];
    cur = n;
    ticks.forEach((t, j) => t.setAttribute('aria-current', String(j === n)));
    if (!g || reduced) { imgs.forEach((im, j) => { im.style.opacity = j === n ? 1 : 0; }); return; }
    g.to(prev, { opacity: 0, duration: .7, ease: 'power2.out', overwrite: 'auto' });
    g.fromTo(next, { opacity: 0, scale: BASE[n] * 1.03 }, { opacity: 1, scale: BASE[n], duration: .8, ease: 'power2.out', overwrite: 'auto' });
  }

  if (fine && !reduced) {
    const qx = g && g.quickTo(stack, 'x', { duration: .9, ease: 'power3.out' });
    const qy = g && g.quickTo(stack, 'y', { duration: .9, ease: 'power3.out' });
    const nx = g && g.quickTo(name, 'x', { duration: 1.1, ease: 'power3.out' });
    hero.addEventListener('pointermove', (e) => {
      const x = e.clientX / innerWidth, y = e.clientY / innerHeight;
      set(x < .34 ? 0 : x > .66 ? 1 : 2);
      if (qx) { qx((x - .5) * -26); qy((y - .5) * -14); nx((x - .5) * 22); }
    });
  } else if (!reduced) {
    /* touch devices: no hover, so the photographs cycle on their own */
    const run = () => { clearInterval(timer); timer = setInterval(() => { if (!document.hidden) set((cur + 1) % 3); }, 3800); };
    run();
    ticks.forEach((t, j) => t.addEventListener('click', () => { set(j); run(); }));
  }
  if (fine || reduced) ticks.forEach((t, j) => t.addEventListener('click', () => set(j)));

  /* cinematic reveal after the loader */
  A.heroIntro = () => {
    if (!g || reduced) return;
    g.from(hero.querySelector('.line>span'), { yPercent: 110, duration: 1.3, ease: 'power4.out' });
    g.from(imgs[0], { scale: 1.08, duration: 1.8, ease: 'power3.out' });
    g.from('[data-hero-meta]', { opacity: 0, duration: 1, delay: .5 });
  };
})(window.Archive);
