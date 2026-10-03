/* =========================================================
   sceneChoreography.js
   Satu berkas mendaftarkan semua ScrollTrigger beranda,
   berurutan sesuai urutan DOM, agar transisi antar adegan
   saling merujuk. Lihat Tabel Implementasi di README.
   ========================================================= */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const DEBUG = new URLSearchParams(window.location.search).has('debug');

/* Tema latar sebagai token CSS — di-tween saat adegan berganti (Resep 1). */
const THEMES = {
  light: {
    '--bg': '#f4f2f6', '--ink': '#16121c', '--ink-soft': 'rgba(22,18,28,0.62)',
    '--card': '#ffffff', '--line': 'rgba(22,18,28,0.16)',
  },
  dark: {
    '--bg': '#0d0a12', '--ink': '#f3eff8', '--ink-soft': 'rgba(243,239,248,0.66)',
    '--card': '#171221', '--line': 'rgba(243,239,248,0.2)',
  },
  accent: {
    '--bg': '#f6dce7', '--ink': '#2a1220', '--ink-soft': 'rgba(42,18,32,0.66)',
    '--card': '#fff6fa', '--line': 'rgba(42,18,32,0.18)',
  },
};

function setTheme(name, immediate) {
  const t = THEMES[name] || THEMES.light;
  if (immediate) gsap.set(document.documentElement, t);
  else gsap.to(document.documentElement, { ...t, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' });
}

/* Lenis: smooth scroll hanya untuk pointer halus & tanpa reduced motion.
   ScrollTrigger scrub/pin tetap jalan di atas scroll native layar sentuh. */
export function createLenis() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (coarse || reduced) return null;
  const lenis = new Lenis({ smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return {
    scrollTo: (target, opts) => lenis.scrollTo(target, opts),
    destroy: () => { gsap.ticker.remove(tick); lenis.destroy(); },
  };
}

export function scrollToId(id, lenisWrap) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenisWrap) lenisWrap.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

export function initChoreography() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 768px)',
    },
    (ctx) => {
      const { motion, desktop } = ctx.conditions;
      const pin = (d, m) => `+=${desktop ? d : m}%`;
      const st = (o) => ({ markers: DEBUG, ...o });

      /* ---- Tema per section (aktif di semua mode) ---- */
      gsap.utils.toArray('[data-theme]').forEach((el) => {
        const name = el.dataset.theme;
        ScrollTrigger.create(st({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setTheme(name, !motion),
          onEnterBack: () => setTheme(name, !motion),
        }));
      });

      /* Reduced motion: tanpa pin/scrub — konten tampil apa adanya. */
      if (!motion) return;

      /* ---- B1 hero -> karakter : pengecilan ke kartu + marquee (pin, scrub) ---- */
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: st({
          trigger: '.scene-hero', start: 'top top', end: pin(110, 70),
          pin: true, scrub: 0.8, anticipatePin: 1,
        }),
      })
        .to('.hero-photo', { clipPath: 'inset(9% 32% 15% 6% round 18px)', duration: 1 }, 0)
        .to('.hero-photo img', { scale: 1.12, duration: 1 }, 0)
        .to('.hero-title', { yPercent: -36, autoAlpha: 0, duration: 0.55 }, 0)
        .to('.hero-tag, .hero-hint, .hero-toggle, .scroll-hint', { autoAlpha: 0, duration: 0.35 }, 0)
        .to('.hero-marquee', { xPercent: -18, duration: 1 }, 0);

      /* ---- Lapisan kata karakter & kartu melayang (parallax berlapis) ---- */
      gsap.utils.toArray('.k-word').forEach((el, i) => {
        gsap.fromTo(el, { y: 70 - i * 16 }, {
          y: -70 + i * 12,
          ease: 'none',
          scrollTrigger: st({ trigger: '.scene-karakter', start: 'top bottom', end: 'bottom top', scrub: 0.6 }),
        });
      });
      gsap.utils.toArray('.float-card').forEach((el) => {
        const s = parseFloat(el.dataset.speed || '1');
        gsap.fromTo(el, { y: 90 * s }, {
          y: -90 * s,
          ease: 'none',
          scrollTrigger: st({ trigger: '.scene-karakter', start: 'top bottom', end: 'bottom top', scrub: 0.8 }),
        });
      });

      /* ---- B2 karakter -> pesan : tirai (scrub) ---- */
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: st({ trigger: '.scene-pesan', start: 'top bottom', end: 'top top', scrub: true }),
      })
        .to('.scene-karakter .scene-inner', { scale: 0.93, yPercent: -6 }, 0)
        .to('.scene-karakter .scene-dim', { opacity: 0.65 }, 0);

      /* ---- Momen diam di pesan: rantai tergambar + teks masuk (non-scrub) ---- */
      const chain = document.querySelectorAll('.pesan-chain path');
      chain.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.timeline({
        scrollTrigger: st({ trigger: '.scene-pesan', start: 'top 62%' }),
        defaults: { ease: 'power3.inOut' },
      })
        .from('.pesan-quote', { y: 34, autoAlpha: 0, duration: 0.9 }, 0)
        .from('.pesan-cta', { y: 22, autoAlpha: 0, duration: 0.7 }, 0.35)
        .from('.pesan-by', { y: 18, autoAlpha: 0, duration: 0.6 }, 0.5)
        .to(chain, { strokeDashoffset: 0, duration: 1.1, stagger: 0.18, ease: 'power2.inOut' }, 0.2);

      /* ---- B3 pesan -> galeri : zoom-through (pin, scrub) ---- */
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: st({
          trigger: '.scene-pesan', start: 'top top', end: pin(120, 80),
          pin: true, scrub: 1, anticipatePin: 1,
        }),
      })
        .to('.pesan-copy', { autoAlpha: 0, yPercent: -14, duration: 0.3 }, 0.12)
        .to('.pesan-photo-frame img', { scale: 2.6, ease: 'power1.in', duration: 0.7 }, 0.3)
        .fromTo('.scene-pesan .next-bg', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.95);

      /* ---- B4 galeri : horizontal pin strip + tipografi lapisan belakang ---- */
      const track = document.querySelector('.strip-track');
      if (track) {
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: st({
            trigger: '.scene-galeri', start: 'top top',
            end: () => `+=${Math.max(300, dist() * (desktop ? 1 : 0.7))}`,
            pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
          }),
        })
          .to(track, { x: () => -dist(), duration: 1 }, 0)
          .fromTo('.galeri-type', { xPercent: 8 }, { xPercent: -52, duration: 1 }, 0);
      }

      /* ---- B5 galeri -> dunia : mask wipe (scrub) ---- */
      gsap.fromTo('.scene-dunia',
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          ease: 'none',
          scrollTrigger: st({ trigger: '.scene-dunia', start: 'top bottom', end: 'top 12%', scrub: true }),
        });
      gsap.fromTo('.scene-dunia .dunia-word',
        { yPercent: 18 },
        {
          yPercent: 0, ease: 'none',
          scrollTrigger: st({ trigger: '.scene-dunia', start: 'top bottom', end: 'top 20%', scrub: true }),
        });

      /* ---- Refresh setelah gambar kritis & font termuat ---- */
      const refresh = () => ScrollTrigger.refresh();
      if (document.readyState === 'complete') refresh();
      else window.addEventListener('load', refresh, { once: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    }
  );

  return mm;
}
