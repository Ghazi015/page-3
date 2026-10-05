import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import CollectionModule from '../components/CollectionModule';
import NotFoundPage from './NotFoundPage';
import { getCollections, getPhotos, getSiteText } from '../services/content';
import { useNav } from '../hooks/useTransitionNav';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function WorldPage() {
  const { slug } = useParams();
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const { go } = useNav();

  const text = getSiteText();
  const photos = getPhotos();
  const byId = Object.fromEntries(photos.map((p) => [p.id, p]));
  const isPeran = slug === text.worlds.peran.slug;
  const isKarya = slug === text.worlds.karya.slug;
  const config = isPeran ? text.worlds.peran : isKarya ? text.worlds.karya : null;

  /* parallax full-bleed + reveal */
  useEffect(() => {
    if (reduced || !config) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.fullbleed img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced, config, slug]);

  if (!config) return <NotFoundPage />;

  const other = isPeran ? text.worlds.karya : text.worlds.peran;

  return (
    <div ref={rootRef}>
      <header className="world-head">
        <p className="kicker">Dunia · {isPeran ? 'IC' : 'personal'}</p>
        <h1 className="display world-title">{config.title}</h1>
        <p className="world-desc">{config.desc}</p>
      </header>

      {isPeran && (
        <>
          <div className="fullbleed">
            <img src={byId['potret-langit'].imageUrl} alt={byId['potret-langit'].alt} loading="eager" />
          </div>
          <div className="split">
            <figure className="reveal-up" style={{ margin: 0 }}>
              <img src={byId['koin-high-table'].imageUrl} alt={byId['koin-high-table'].alt} loading="lazy" />
            </figure>
            <figure className="offset reveal-up" style={{ margin: 0 }}>
              <img src={byId['potret-hitam'].thumbnailUrl} alt={byId['potret-hitam'].alt} loading="lazy" />
            </figure>
          </div>
          <CollectionModule
            heading="Dua Sisi"
            collections={getCollections().filter((c) => c.id === 'dua-sisi')}
            photos={photos}
          />
        </>
      )}

      {isKarya && (
        <>
          <div className="facts-type reveal-up">
            <p>{text.worlds.karya.facts[0]} —</p>
            <p>{text.worlds.karya.facts[1]}.</p>
          </div>
          <div className="fullbleed">
            <img src={byId['spiral-buku'].imageUrl} alt={byId['spiral-buku'].alt} loading="eager" />
          </div>
          <div className="layered">
            <img className="img-a reveal-up" src={byId['sakura-merpati'].imageUrl} alt={byId['sakura-merpati'].alt} loading="lazy" />
            <img className="img-b reveal-up" src={byId['sakura-merpati-2'].thumbnailUrl} alt={byId['sakura-merpati-2'].alt} loading="lazy" />
          </div>
          <div className="split">
            <figure className="reveal-up" style={{ margin: 0 }}>
              <img src={byId['kolase-senja'].imageUrl} alt={byId['kolase-senja'].alt} loading="lazy" />
            </figure>
            <figure className="offset reveal-up" style={{ margin: 0 }}>
              <img src={byId['notebook-galeri'].thumbnailUrl} alt={byId['notebook-galeri'].alt} loading="lazy" />
            </figure>
          </div>
          <CollectionModule
            heading="Buku Cerita"
            collections={getCollections().filter((c) => c.id === 'buku-cerita')}
            photos={photos}
          />
          <div className="fullbleed" style={{ height: '70svh' }}>
            <img src={byId['ruang-ungu'].imageUrl} alt={byId['ruang-ungu'].alt} loading="lazy" />
          </div>
        </>
      )}

      <section className="collection" style={{ paddingTop: 40 }}>
        <div className="admin-actions">
          <button type="button" className="viewer-btn" onClick={() => go(`/dunia/${other.slug}`)}>
            {other.title} →
          </button>
          <button type="button" className="viewer-btn viewer-btn--download" onClick={() => go('/galeri')}>
            lihat galeri →
          </button>
        </div>
      </section>

      <Footer text={text} />
    </div>
  );
}
