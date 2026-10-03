import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/* Intro signature: wordmark JOSC muncul huruf per huruf + rantai tergambar.
   Sekaligus preload gambar hero. Maksimal ~2,5 dtk, bisa dilewati,
   disederhanakan saat reduced motion. */
export default function Intro({ text, photos, onDone }) {
  const ref = useRef(null);
  const exitRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) document.body.classList.add('rm');

    const preload = (src) => new Promise((res) => {
      if (!src) return res();
      const i = new Image();
      i.onload = i.onerror = res;
      i.src = src;
    });
    const t0 = performance.now();
    let done = false;
    let tl = null;

    const letters = el.querySelectorAll('.intro-word span');
    const line = el.querySelector('.intro-line');
    const chainEl = el.querySelector('.intro-chain');
    const paths = el.querySelectorAll('.intro-chain path');

    if (!reduced) {
      paths.forEach((p) => {
        const l = p.getTotalLength();
        gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
      });
      tl = gsap.timeline()
        .to(letters, { y: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out' }, 0.1)
        .to(line, { opacity: 1, duration: 0.6 }, 0.75)
        .to(chainEl, { opacity: 1, duration: 0.4 }, 0.85)
        .to(paths, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.95);
    } else {
      letters.forEach((s) => { s.style.transform = 'none'; });
      line.style.opacity = 1;
      chainEl.style.opacity = 1;
    }

    const exit = () => {
      if (done) return;
      done = true;
      el.classList.add('exit');
      window.setTimeout(onDone, reduced ? 320 : 720);
    };
    exitRef.current = exit;

    const minWait = reduced ? 300 : 1600;
    Promise.race([
      Promise.all([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        preload(photos[0] && photos[0].imageUrl),
        preload(photos[1] && photos[1].imageUrl),
      ]),
      new Promise((r) => setTimeout(r, 2500)),
    ]).then(() => {
      const wait = Math.max(0, minWait - (performance.now() - t0));
      setTimeout(exit, wait);
    });

    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') exit();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (tl) tl.kill();
    };
  }, [photos, onDone, text]);

  const letters = (text.wordmark || 'JOSC').split('');
  return (
    <div className="intro" ref={ref}>
      <div>
        <div className="intro-word" aria-label={text.wordmark || 'JOSC'}>
          {letters.map((l, i) => (<span key={i} aria-hidden="true">{l}</span>))}
        </div>
        <p className="intro-line">{text.name} — {text.introLine}</p>
        <svg className="intro-chain" viewBox="0 0 120 40" aria-hidden="true">
          <path d="M8 8 C 30 34, 70 36, 112 12" />
          <path d="M14 6 C 36 26, 68 28, 104 10" />
        </svg>
      </div>
      <button className="intro-skip" onClick={() => exitRef.current && exitRef.current()}>
        {text.introSkip || 'Lewati'}
      </button>
    </div>
  );
}
