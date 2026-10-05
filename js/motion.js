/* Scroll choreography (GSAP + ScrollTrigger). Disabled for reduced-motion users. */
(function (A) {
  const g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  g.registerPlugin(ST);
  document.documentElement.classList.add('js-anim');
  const $$ = (s) => g.utils.toArray(s);

  A.motion = g.context(() => {
    $$('[data-reveal]').forEach((el) => ST.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => g.fromTo(el.querySelectorAll('.line>span'), { yPercent: 105 }, { yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: .09 })
    }));
    $$('[data-fade]').forEach((el) => ST.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => g.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    }));
    $$('[data-parallax]').forEach((el) => {
      const v = parseFloat(el.dataset.parallax);
      g.fromTo(el, { yPercent: -v }, { yPercent: v, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-year]').forEach((el) => g.fromTo(el, { xPercent: -5 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: true } }));

    /* fullscreen moment: the photograph opens up to fill the viewport */
    const small = innerWidth < 768;
    g.timeline({ scrollTrigger: { trigger: '#moment', start: 'top top', end: '+=120%', scrub: .6, pin: true, anticipatePin: 1 } })
      .fromTo('#momentMask', { clipPath: small ? 'inset(10% 6% 10% 6%)' : 'inset(16% 14% 16% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 })
      .fromTo('#momentImg', { scale: 2.1 }, { scale: 1.8, ease: 'none', duration: 1 }, 0)
      .fromTo('#momentText', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4 }, .6);

    /* contact sheet: vertical scroll becomes horizontal film movement (desktop only) */
    g.matchMedia().add('(min-width:1024px)', () => {
      const s = document.getElementById('strip'), w = document.getElementById('stripWrap');
      g.to(s, { x: () => -(s.scrollWidth - innerWidth), ease: 'none',
        scrollTrigger: { trigger: w, start: 'top top', end: () => '+=' + s.scrollWidth, scrub: .8, pin: true, invalidateOnRefresh: true, anticipatePin: 1 } });
    });
  });
  addEventListener('load', () => ST.refresh());
})(window.Archive);
