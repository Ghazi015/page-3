import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChainMotif from './ChainMotif';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/** Momen diam: satu kutipan besar dengan line-mask reveal. */
export default function QuoteBlock({ quote }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.qmask > span',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power4.out',
          scrollTrigger: { trigger: ref.current, start: 'top 68%' },
        }
      );
      gsap.fromTo(
        '.quote-source',
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          scrollTrigger: { trigger: ref.current, start: 'top 55%' },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  if (!quote) return null;

  const words = quote.text.split(' ');
  const mid = Math.ceil(words.length / 2);
  const lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];

  return (
    <section className="quote" ref={ref}>
      <ChainMotif />
      <blockquote className="quote-text">
        {lines.map((line, i) => (
          <span className="qmask" key={i}>
            <span>{line}</span>
          </span>
        ))}
      </blockquote>
      <p className="quote-source small">— {quote.source}</p>
    </section>
  );
}
