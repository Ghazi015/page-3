import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero interaktif "dua foto": foto putih sebagai dasar, foto hitam
 * terbuka di dalam lingkaran yang mengikuti kursor (clip-path + satu
 * loop ticker GSAP). Layar sentuh / reduced motion: tombol ganti foto.
 */
export default function Hero({ text, photos, introDone }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const revealRef = useRef(null);
  const baseRef = useRef(null);
  const [flipped, setFlipped] = useState(false);

  const base = photos.find((p) => p.id === 'potret-putih');
  const reveal = photos.find((p) => p.id === 'potret-hitam');

  /* lingkaran kursor */
  useEffect(() => {
    if (reduced || !introDone) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const section = sectionRef.current;
    const revealImg = revealRef.current;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let tr = 0;
    let r = 0;
    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      tr = Math.min(window.innerWidth, window.innerHeight) * 0.24;
    };
    const onLeave = () => {
      tr = 0;
    };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      r += (tr - r) * 0.1;
      revealImg.style.clipPath = `circle(${r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`;
    };
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    gsap.ticker.add(tick);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      gsap.ticker.remove(tick);
    };
  }, [reduced, introDone]);

  /* entrance + parallax halus foto dasar */
  useEffect(() => {
    if (!introDone) return undefined;
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(
        '.hero-name .line > span',
        { yPercent: 112 },
        { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.1 }
      );
      gsap.fromTo(
        '.hero-kicker, .hero-meta, .hero-hint',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out', delay: 0.5 }
      );
      gsap.to(baseRef.current, {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [introDone, reduced]);

  return (
    <section className="hero" ref={sectionRef} aria-label="Pembuka">
      <div className="hero-media">
        <img
          ref={baseRef}
          src={base.imageUrl}
          alt={base.alt}
          width={base.width}
          height={base.height}
          fetchpriority="high"
        />
        <img
          ref={revealRef}
          className={`hero-reveal ${flipped ? 'is-flipped' : ''}`}
          src={reveal.imageUrl}
          alt=""
          aria-hidden="true"
          width={reveal.width}
          height={reveal.height}
        />
      </div>
      <div className="hero-inner">
        <p className="kicker hero-kicker">{text.kicker}</p>
        <h1 className="display hero-name">
          <span className="line">
            <span>{text.nameLine1}</span>
          </span>
          <span className="line line--2">
            <span>{text.nameLine2}</span>
          </span>
        </h1>
        <div className="hero-meta">
          <p className="hero-alias">{text.alias}</p>
          <button
            type="button"
            className="hero-swap"
            aria-pressed={flipped}
            onClick={() => setFlipped((f) => !f)}
          >
            {text.swapLabel}
          </button>
        </div>
      </div>
      <p className="hero-hint" aria-hidden="true">
        {text.scrollHint}
      </p>
    </section>
  );
}
