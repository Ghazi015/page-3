import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
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

const ARCHIVE_IDS = [
  'potret-langit',
  'koin-high-table',
  'kolase-senja',
  'sakura-merpati',
  'spiral-buku',
  'ruang-ungu',
];

const FEATURE_IDS = [
  ['kolase-senja', 'potret-hitam'],
  ['koin-high-table', 'sakura-merpati'],
  ['spiral-buku', 'notebook-galeri'],
];

function EditorialFeatures({ photos }) {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  const byId = Object.fromEntries(photos.map((p) => [p.id, p]));

  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.feature-row').forEach((row) => {
        gsap.fromTo(row.querySelector('.feature-main'), { y: 70 }, {
          y: -30,
          ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.fromTo(row.querySelector('.feature-float'), { y: 50, rotate: -3 }, {
          y: -24,
          rotate: 2,
          ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.fromTo(row.querySelectorAll('.feature-kicker, .feature-title, .feature-copy'), { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 72%' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  const copy = [
    ['01', 'the character', 'Potret yang terasa seperti halaman yang berhenti sejenak.'],
    ['02', 'the atmosphere', 'Warna, cahaya, dan dunia visual yang membentuk suasana.'],
    ['03', 'the details', 'Fragmen kecil yang membuat sebuah momen terasa personal.'],
  ];

  return (
    <section className="features" ref={rootRef} aria-label="Momen pilihan">
      <div className="section-intro wrap">
        <div>
          <p className="kicker">Curated moments</p>
          <h2 className="display section-title">A story told<br /><em>through images.</em></h2>
        </div>
        <p className="section-note">Bukan kumpulan kartu. Ini urutan momen — dibangun untuk dinikmati perlahan.</p>
      </div>

      <div className="feature-list">
        {FEATURE_IDS.map(([mainId, floatId], index) => {
          const main = byId[mainId];
          const float = byId[floatId];
          if (!main || !float) return null;
          return (
            <article className={`feature-row feature-row--${index + 1}`} key={mainId}>
              <div className="feature-main">
                <img src={main.imageUrl} alt={main.alt} loading="lazy" width={main.width} height={main.height} />
                <span className="feature-stamp">{copy[index][0]}</span>
              </div>
              <img className="feature-float" src={float.thumbnailUrl} alt={float.alt} loading="lazy" width={float.width} height={float.height} />
              <div className="feature-copy">
                <p className="kicker feature-kicker">{copy[index][0]} / {copy[index][1]}</p>
                <h3 className="display feature-title">{index === 0 ? 'presence' : index === 1 ? 'a quiet kind of magic' : 'small details, lasting feeling'}</h3>
                <p>{copy[index][2]}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GalleryPreview({ photos }) {
  const navigate = useNavigate();
  const selected = ['potret-langit', 'ruang-ungu', 'sakura-merpati-2', 'notebook-galeri', 'potret-putih', 'buku-kuno']
    .map((id) => photos.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <section className="preview" aria-label="Pilihan arsip foto">
      <div className="preview-head wrap">
        <div>
          <p className="kicker">The archive</p>
          <h2 className="display section-title">Moments worth<br /><em>returning to.</em></h2>
        </div>
        <button type="button" className="text-link" onClick={() => navigate('/galeri')}>
          lihat semua foto <span>↗</span>
        </button>
      </div>
      <div className="preview-grid">
        {selected.map((p, i) => (
          <button key={p.id} type="button" className={`preview-card preview-card--${i + 1}`} onClick={() => navigate(`/foto/${p.id}`, { state: { returnTo: '/' } })}>
            <img src={p.imageUrl} alt={p.alt} loading="lazy" width={p.width} height={p.height} />
            <span className="preview-caption">{String(i + 1).padStart(2, '0')} · {p.category}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SocialMoment() {
  return (
    <section className="social-moment">
      <div className="wrap social-inner">
        <div>
          <p className="kicker">Stay a while</p>
          <h2 className="display social-title">A personal space<br /><em>for the moments.</em></h2>
        </div>
        <div className="social-links" aria-label="Tautan sosial">
          <span>gallery archive</span>
          <span>visual diary</span>
          <span>saved moments</span>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const reduced = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);
  const rootRef = useRef(null);
  const text = getSiteText();
  const photos = getPhotos();
  const quotes = getQuotes();
  const quote = quotes.find((q) => q.show);
  const archivePhotos = ARCHIVE_IDS.map((id) => photos.find((p) => p.id === id)).filter(Boolean);
  const floatPhoto = photos.find((p) => p.id === 'ruang-ungu');

  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.message-copy > *', { autoAlpha: 0, y: 30 }, {
        autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.message', start: 'top 72%' },
      });
      gsap.to('.message-float', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: '.message', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef}>
      {!introDone && <Loader onDone={() => setIntroDone(true)} />}

      <Hero text={text.hero} photos={photos} introDone={introDone} />

      <section className="message wrap" aria-label={text.message.title}>
        <div className="message-grid">
          <div className="message-side">
            <p className="kicker">{text.message.title}</p>
            <ChainMotif />
            <p className="small message-side-note">an intimate visual archive</p>
          </div>
          <div className="message-copy">
            <p className="message-lead">{text.message.lines[0]}</p>
            <p className="message-italic">{text.message.lines[1]}</p>
            <p className="message-attr small">— {text.message.attribution}</p>
          </div>
        </div>
        {floatPhoto && (
          <img className="message-float" src={floatPhoto.thumbnailUrl} alt={floatPhoto.alt} loading="lazy" width={floatPhoto.width} height={floatPhoto.height} />
        )}
      </section>

      <EditorialFeatures photos={photos} />

      <PhotoStrip title="PHOTO ARCHIVE" photos={archivePhotos} />

      <QuoteBlock quote={quote} />

      <section className="world-intro wrap" aria-label={text.worlds.title}>
        <div>
          <p className="kicker">Explore the world</p>
          <h2 className="display section-title">Two sides.<br /><em>One visual language.</em></h2>
        </div>
        <p className="section-note">Dua ruang untuk menjelajahi karakter dan sisi kreatifnya.</p>
      </section>

      <WorldDoors worlds={text.worlds} photos={photos} />
      <GalleryPreview photos={photos} />
      <SocialMoment />
      <Footer text={text} big />
    </div>
  );
}
