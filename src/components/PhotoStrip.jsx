import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function PhotoStrip({ title, photos }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !photos.length) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 820px)', () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      section.classList.add('is-pinned');
      if (!section || !track) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(distance(), 1)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(section.querySelector('.archive-tagline'), { autoAlpha: 0, x: -20 }, {
        autoAlpha: 1, x: 0, duration: 0.7, scrollTrigger: { trigger: section, start: 'top 80%' },
      });
    });
    return () => { mm.revert(); sectionRef.current?.classList.remove('is-pinned'); };
  }, [reduced, photos.length]);

  return (
    <section className="strip archive-strip" ref={sectionRef} aria-label={title}>
      <div className="strip-head">
        <div>
          <p className="kicker archive-tagline">01 — endless scroll</p>
          <h2 className="display strip-title">{title}</h2>
        </div>
        <span className="small">{String(photos.length).padStart(2, '0')} curated frames</span>
      </div>
      <div className="strip-track" ref={trackRef}>
        {photos.map((p, i) => (
          <figure className={`strip-item strip-item--${(i % 4) + 1}`} key={p.id}>
            <div className="strip-image-wrap">
              <img src={p.imageUrl} alt={p.alt} width={p.width} height={p.height} loading={i === 0 ? 'eager' : 'lazy'} />
              <span className="strip-number">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <figcaption>
              <span>{p.category}</span>
              <span>{p.id.replaceAll('-', ' ')}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
