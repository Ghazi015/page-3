import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import PhotoStrip from '../components/PhotoStrip';
import QuoteBlock from '../components/QuoteBlock';
import WorldDoors from '../components/WorldDoors';
import Footer from '../components/Footer';
import ChainMotif from '../components/ChainMotif';
import { getPhotos, getQuotes, getSiteText } from '../services/content';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const STRIP_IDS = ['potret-langit', 'koin-high-table', 'kolase-senja', 'sakura-merpati'];

export default function HomePage() {
  const reduced = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);
  const rootRef = useRef(null);

  const text = getSiteText();
  const photos = getPhotos();
  const quotes = getQuotes();
  const quote = quotes.find((q) => q.show);
  const stripPhotos = STRIP_IDS.map((id) => photos.find((p) => p.id === id)).filter(Boolean);
  const floatPhoto = photos.find((p) => p.id === 'ruang-ungu');

  /* parallax foto melayang di section pesan */
  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('[data-parallax]', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: '.message', start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.fromTo(
        '.message-lines p, .message-attr',
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.message', start: 'top 66%' },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef}>
      {!introDone && (
        <Loader
          onDone={() => setIntroDone(true)}
        />
      )}
      <Hero text={text.hero} photos={photos} introDone={introDone} />

      {/* ---- pesan pribadi ---- */}
      <section className="message wrap" aria-label={text.message.title}>
        <img
          className="message-float"
          src={floatPhoto.thumbnailUrl}
          alt={floatPhoto.alt}
          data-parallax
          loading="lazy"
          width={floatPhoto.width}
          height={floatPhoto.height}
        />
        <div className="message-grid">
          <div className="message-side">
            <p className="kicker">{text.message.title}</p>
            <ChainMotif />
          </div>
          <div className="message-lines">
            {text.message.lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            <p className="message-attr small">— {text.message.attribution}</p>
          </div>
        </div>
      </section>

      {/* ---- strip foto ---- */}
      <PhotoStrip title={text.strip.title} photos={stripPhotos} />

      {/* ---- kutipan besar ---- */}
      <QuoteBlock quote={quote} />

      {/* ---- dua dunia ---- */}
      <WorldDoors worlds={text.worlds} photos={photos} />

      <Footer text={text} big />
    </div>
  );
}
