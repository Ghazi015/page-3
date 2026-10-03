import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Strip foto horizontal: pinned + scroll-jack di desktop,
 * scroll native dengan snap di layar sempit.
 */
export default function PhotoStrip({ title, photos }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      section.classList.add('is-pinned');
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => {
      mm.revert();
      sectionRef.current?.classList.remove('is-pinned');
    };
  }, [reduced]);

  return (
    <section className="strip" ref={sectionRef} aria-label={title}>
      <div className="strip-head">
        <h2 className="display strip-title">{title}</h2>
        <span className="small">{String(photos.length).padStart(2, '0')} foto</span>
      </div>
      <div className="strip-track" ref={trackRef}>
        {photos.map((p, i) => (
          <figure className="strip-item" key={p.id}>
            <img
              src={p.imageUrl}
              alt={p.alt}
              width={p.width}
              height={p.height}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <figcaption className="small">{p.category}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
