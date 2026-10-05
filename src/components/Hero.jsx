import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const HERO_IDS = [
  'potret-putih',
  'potret-hitam',
  'potret-langit',
  'ruang-ungu',
  'kolase-senja',
  'sakura-merpati',
];

/**
 * Full-screen visual hero inspired by editorial personal sites:
 * moving the pointer across the hero changes the active image by zone;
 * hovering the miniature index at the bottom also switches it.
 */
export default function Hero({ text, photos, introDone }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const imageRefs = [useRef(null), useRef(null)];
  const activeLayerRef = useRef(0);
  const previousIndexRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchMode, setTouchMode] = useState(false);

  const items = useMemo(() => HERO_IDS.map((id) => photos.find((p) => p.id === id)).filter(Boolean), [photos]);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setTouchMode(!fine);
  }, []);

  useEffect(() => {
    if (!introDone || !sectionRef.current || !items.length) return undefined;

    const section = sectionRef.current;
    const ctx = gsap.context(() => {
      imageRefs.forEach((ref) => {
        if (!ref.current) return;
        ref.current.src = items[0].imageUrl;
        gsap.set(ref.current, { autoAlpha: 0, scale: reduced ? 1 : 1.04 });
      });
      gsap.set(imageRefs[0].current, { autoAlpha: 1 });

      if (reduced) return;
      gsap.fromTo(
        '.hero-copy > *',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      );
      gsap.to('.hero-layer', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [introDone, reduced, items.length]);

  useEffect(() => {
    if (!introDone || !items.length) return undefined;
    if (previousIndexRef.current === null) {
      previousIndexRef.current = activeIndex;
      return undefined;
    }
    const nextLayer = activeLayerRef.current === 0 ? 1 : 0;
    const incoming = imageRefs[nextLayer].current;
    const outgoing = imageRefs[activeLayerRef.current].current;
    const next = items[activeIndex];
    if (!incoming || !outgoing || !next) return undefined;

    incoming.src = next.imageUrl;
    incoming.alt = next.alt;

    if (reduced) {
      gsap.set(outgoing, { autoAlpha: 0 });
      gsap.set(incoming, { autoAlpha: 1, scale: 1 });
      activeLayerRef.current = nextLayer;
      previousIndexRef.current = activeIndex;
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(incoming, { autoAlpha: 0, scale: 1.08 });
      gsap.to(outgoing, { autoAlpha: 0, scale: 1.02, duration: 0.55, ease: 'power2.out' });
      gsap.to(incoming, { autoAlpha: 1, scale: 1.015, duration: 0.85, ease: 'power3.out' });
    }, sectionRef);
    activeLayerRef.current = nextLayer;
    previousIndexRef.current = activeIndex;
    return () => ctx.revert();
  }, [activeIndex, introDone, items, reduced]);

  useEffect(() => {
    if (reduced || touchMode || !introDone || items.length < 2) return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    const onMove = (event) => {
      const rect = section.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width - 1, event.clientX - rect.left));
      const zone = Math.min(items.length - 1, Math.floor((x / rect.width) * items.length));
      setActiveIndex((current) => (current === zone ? current : zone));
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    return () => section.removeEventListener('pointermove', onMove);
  }, [reduced, touchMode, introDone, items.length]);

  if (!items.length) return null;

  return (
    <section className="hero" ref={sectionRef} aria-label="Pembuka galeri">
      <div className="hero-media" aria-hidden="true">
        <img ref={imageRefs[0]} className="hero-layer hero-layer--a" src={items[0].imageUrl} alt="" />
        <img ref={imageRefs[1]} className="hero-layer hero-layer--b" src={items[0].imageUrl} alt="" />
        <div className="hero-wash" />
      </div>

      <div className="hero-copy">
        <p className="kicker hero-kicker">{text.kicker}</p>
        <p className="hero-series">01 — 06 · visual archive</p>
        <h1 className="display hero-name">
          <span>{text.nameLine1}</span>
          <em>{text.nameLine2}</em>
        </h1>
        <div className="hero-bottomline">
          <p className="hero-alias">{text.alias}</p>
          <p className="hero-instruction">{touchMode ? 'tap a frame to change the scene' : 'move across the image to change the scene'}</p>
        </div>
      </div>

      <div className="hero-index" aria-label="Pilihan foto hero">
        <div className="hero-index-meta">
          <span>Selected moment</span>
          <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
        </div>
        <div className="hero-thumbs">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`hero-thumb ${activeIndex === index ? 'is-active' : ''}`}
              aria-label={`Pilih foto ${index + 1}`}
              aria-pressed={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
            >
              <img src={item.thumbnailUrl} alt="" loading="lazy" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="hero-scroll">scroll ↓</p>
    </section>
  );
}
