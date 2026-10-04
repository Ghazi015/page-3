'use client';
import { useEffect } from 'react';

/* Mengatur variabel CSS saat scroll: --k (scene mengecil), --e (scene masuk), --sp (progres), --p (garis timeline) */
export default function ScrollFX() {
  useEffect(() => {
    const q = (s) => [...document.querySelectorAll(s)], cl = (v) => Math.min(1, Math.max(0, v));
    const tick = () => {
      const h = innerHeight;
      document.body.style.setProperty('--sp', cl(scrollY / (document.body.scrollHeight - h)));
      q('.stk').forEach((e) => {
        const n = e.nextElementSibling; if (!n) return;
        e.style.setProperty('--k', cl(1 - n.getBoundingClientRect().top / h).toFixed(4));
        e.style.setProperty('--e', cl(1 - e.getBoundingClientRect().top / h).toFixed(4));
      });
      q('.tl').forEach((t) => t.style.setProperty('--p', cl((h * 0.7 - t.getBoundingClientRect().top) / t.getBoundingClientRect().height).toFixed(4)));
    };
    const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.25 });
    q('.rv,.mani').forEach((e) => io.observe(e));
    tick();
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick);
    return () => { removeEventListener('scroll', tick); removeEventListener('resize', tick); io.disconnect(); };
  }, []);
  return null;
}
