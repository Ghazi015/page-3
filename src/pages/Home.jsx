import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { getPhotos, getSiteText } from '../services/content.js';
import { initChoreography, createLenis, scrollToId } from '../scenes/sceneChoreography.js';
import Intro from '../components/Intro.jsx';
import Nav from '../components/Nav.jsx';
import SmartImage from '../components/SmartImage.jsx';

const FALLBACK_TEXT = {
  wordmark: 'JOSC', name: 'Genevieve Reine Luciano', introLine: 'Wanita Kerja Keras', introSkip: 'Lewati',
};

export default function Home() {
  const [state, setState] = useState({ status: 'loading', photos: [], text: null });
  const [introDone, setIntroDone] = useState(false);
  const onIntroDone = useCallback(() => setIntroDone(true), []);
  const heroRef = useRef(null);
  const lenisRef = useRef(null);
  const mmRef = useRef(null);
  const location = useLocation();

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading' }));
    Promise.all([getPhotos(), getSiteText()])
      .then(([photos, text]) => setState({ status: 'ready', photos: Array.isArray(photos) ? photos : [], text }))
      .catch(() => setState((s) => ({ ...s, status: 'error' })));
  }, []);
  useEffect(() => { load(); }, [load]);

  /* Lenis + koreografi setelah data siap; dibersihkan saat unmount. */
  useEffect(() => {
    if (state.status !== 'ready') return undefined;
    lenisRef.current = createLenis();
    mmRef.current = initChoreography();
    return () => {
      if (mmRef.current) mmRef.current.revert();
      if (lenisRef.current) lenisRef.current.destroy();
      lenisRef.current = null;
    };
  }, [state.status]);

  /* Kunci scroll selama intro. */
  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [introDone]);

  /* Deep link ke section (#karakter dst.) */
  useEffect(() => {
    if (state.status !== 'ready' || !introDone || !location.hash) return undefined;
    const id = location.hash.slice(1);
    const t = setTimeout(() => scrollToId(id, lenisRef.current), 250);
    return () => clearTimeout(t);
  }, [state.status, introDone, location.hash]);

  /* Hero interaktif dua foto: kursor membuka lingkaran (desktop),
     ketuk (layar sentuh), tombol (keyboard / reduced motion). */
  useEffect(() => {
    if (state.status !== 'ready' || !introDone) return undefined;
    const hero = heroRef.current;
    if (!hero) return undefined;
    const reveal = hero.querySelector('.hero-reveal');
    const btn = hero.querySelector('.hero-toggle');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let tx = 50, ty = 42, cx = 50, cy = 42, tr = 0, cr = 0, open = false;
    const offs = [];
    const on = (t, e, f) => { t.addEventListener(e, f); offs.push(() => t.removeEventListener(e, f)); };

    if (reduced) {
      document.body.classList.add('rm');
      on(btn, 'click', () => {
        open = !open;
        hero.classList.toggle('is-open', open);
        btn.setAttribute('aria-pressed', String(open));
      });
    } else {
      const tick = () => {
        cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14; cr += (tr - cr) * 0.12;
        reveal.style.setProperty('--cx', `${cx}%`);
        reveal.style.setProperty('--cy', `${cy}%`);
        reveal.style.setProperty('--r', `${cr}px`);
      };
      gsap.ticker.add(tick);
      offs.push(() => gsap.ticker.remove(tick));
      const R = () => Math.min(window.innerWidth, window.innerHeight) * 0.34;
      if (fine) {
        on(hero, 'pointermove', (e) => {
          const b = hero.getBoundingClientRect();
          tx = ((e.clientX - b.left) / b.width) * 100;
          ty = ((e.clientY - b.top) / b.height) * 100;
        });
        on(hero, 'pointerenter', () => { tr = R(); });
        on(hero, 'pointerleave', () => { tr = 0; });
      } else {
        on(hero, 'click', (e) => {
          if (e.target.closest('.hero-toggle')) return;
          const b = hero.getBoundingClientRect();
          tx = ((e.clientX - b.left) / b.width) * 100;
          ty = ((e.clientY - b.top) / b.height) * 100;
          open = !open;
          tr = open ? R() * 1.5 : 0;
        });
      }
      on(btn, 'click', () => {
        open = !open; tx = 50; ty = 42;
        tr = open ? Math.hypot(window.innerWidth, window.innerHeight) / 2 : 0;
        btn.setAttribute('aria-pressed', String(open));
      });
    }
    return () => offs.forEach((f) => f());
  }, [state.status, introDone]);

  const { status, photos, text } = state;

  if (status === 'error') {
    return (
      <div className="state-panel">
        <div>
          <h1>Ada yang tersangkut.</h1>
          <p>Konten belum bisa dimuat. Coba lagi sebentar lagi.</p>
          <button className="btn" onClick={load}>Coba lagi</button>
        </div>
      </div>
    );
  }

  if (status === 'loading' || !text) {
    return (
      <div className="intro" aria-busy="true">
        <div>
          <div className="intro-word intro-word--static" aria-label="JOSC">
            <span>J</span><span>O</span><span>S</span><span>C</span>
          </div>
        </div>
      </div>
    );
  }

  const P = {};
  photos.forEach((p) => { P[p.id] = p; });
  const navigate = (id) => scrollToId(id, lenisRef.current);
  const st = text.states;

  return (
    <>
      <a className="skip-link" href="#konten">{text.skipLink}</a>
      <Nav text={text} photos={photos} onNavigate={navigate} />

      <main id="konten">
        {/* ============ SCENE 1 — HERO (light) ============ */}
        <section id="hero" className="scene scene-hero" data-scene="hero" data-theme="light" ref={heroRef}>
          <div className="hero-marquee" aria-hidden="true">
            <div className="marquee-track">
              <div className="marquee-group">
                <span>{text.name}</span>
                <span>{text.wordmark} Gallery</span>
              </div>
              <div className="marquee-group">
                <span>{text.name}</span>
                <span>{text.wordmark} Gallery</span>
              </div>
            </div>
          </div>

          <div className="hero-photo">
            <SmartImage
              eager
              src={P['01-white-suit'] && P['01-white-suit'].imageUrl}
              fallback={P['01-white-suit'] && P['01-white-suit'].fallbackUrl}
              alt={P['01-white-suit'] ? P['01-white-suit'].alt : text.name}
              width={P['01-white-suit'] && P['01-white-suit'].width}
              height={P['01-white-suit'] && P['01-white-suit'].height}
            />
            <div className="hero-reveal" aria-hidden="true">
              <SmartImage
                eager
                src={P['02-black-suit'] && P['02-black-suit'].imageUrl}
                fallback={P['02-black-suit'] && P['02-black-suit'].fallbackUrl}
                alt=""
                width={P['02-black-suit'] && P['02-black-suit'].width}
                height={P['02-black-suit'] && P['02-black-suit'].height}
              />
            </div>
          </div>

          <p className="hero-tag">{text.tagline}</p>
          <h1 className="hero-title">
            <span className="l1">{text.firstName}</span>
            <span className="l2">{text.lastName}</span>
          </h1>
          <button className="hero-toggle" aria-pressed="false">{text.heroToggle}</button>
          <p className="hero-hint">
            <span className="hint-fine">{text.heroHintFine}</span>
            <span className="hint-touch">{text.heroHintTouch}</span>
          </p>
          <p className="scroll-hint">{text.scrollHint}</p>
        </section>

        {/* ============ SCENE 2 — KARAKTER (dark) ============ */}
        <section id="karakter" className="scene scene-karakter" data-scene="karakter" data-theme="dark">
          <div className="scene-inner">
            <h2 className="k-label">{text.karakterLabel}</h2>
            {text.characters.map((c, i) => (
              <p key={c} className={`k-word ${['', 'w-outline', 'w-accent', 'w-italic', 'w-outline'][i % 5]}`}>
                {c}
              </p>
            ))}
            {P['02-black-suit'] && (
              <div className="float-card fc-coin" data-speed="1.2">
                <SmartImage src={P['02-black-suit'].imageUrl} fallback={P['02-black-suit'].fallbackUrl} alt={P['02-black-suit'].alt} width={P['02-black-suit'].width} height={P['02-black-suit'].height} />
              </div>
            )}
            {P['08-corgi'] && (
              <div className="float-card fc-corgi" data-speed="0.8">
                <SmartImage src={P['08-corgi'].imageUrl} fallback={P['08-corgi'].fallbackUrl} alt={P['08-corgi'].alt} width={P['08-corgi'].width} height={P['08-corgi'].height} />
              </div>
            )}
            <div className="scene-dim" aria-hidden="true"></div>
          </div>
        </section>

        {/* ============ SCENE 3 — PESAN (accent) ============ */}
        <section id="pesan" className="scene scene-pesan" data-scene="pesan" data-theme="accent">
          <div className="pesan-grid">
            <div className="pesan-copy">
              <h2 className="pesan-label">{text.messageLabel}</h2>
              <svg className="pesan-chain" viewBox="0 0 300 90" aria-hidden="true">
                <path d="M12 18 C 80 78, 190 84, 288 26" />
                <path d="M26 14 C 90 60, 180 64, 272 20" />
                <circle cx="12" cy="18" r="4" />
                <circle cx="288" cy="26" r="4" />
              </svg>
              <blockquote className="pesan-quote">{text.message}</blockquote>
              <p className="pesan-cta">{text.messageCta}</p>
              <span className="pesan-by">{text.messageBy}</span>
            </div>
            <div className="pesan-photo-frame">
              {P['06-sakura'] ? (
                <SmartImage src={P['06-sakura'].imageUrl} fallback={P['06-sakura'].fallbackUrl} alt={P['06-sakura'].alt} width={P['06-sakura'].width} height={P['06-sakura'].height} />
              ) : (
                <div className="img-fallback"><span>{st.imgMissing}</span></div>
              )}
            </div>
          </div>
          <div className="next-bg" aria-hidden="true"></div>
        </section>

        {/* ============ SCENE 4 — GALERI (light) ============ */}
        <section id="galeri" className="scene scene-galeri" data-scene="galeri" data-theme="light">
          <div className="galeri-head">
            <h2 className="galeri-title">{text.galleryTitle}</h2>
            <p className="galeri-label">{text.galleryLabel}</p>
            <p className="galeri-note">{text.galleryNote}</p>
          </div>
          <div className="strip-viewport">
            <div className="galeri-type" aria-hidden="true">{text.galleryTitle} — {text.galleryTitle}</div>
            {photos.length ? (
              <div className="strip-track">
                {['03-gallery', '05-blush', '01-white-suit', '06-sakura', '07-coin'].map((id) => (
                  P[id] && (
                    <figure key={id} className={`strip-card ${id === '01-white-suit' ? 'tall' : ''}`}>
                      <SmartImage src={P[id].imageUrl} fallback={P[id].fallbackUrl} alt={P[id].alt} width={P[id].width} height={P[id].height} />
                    </figure>
                  )
                ))}
              </div>
            ) : (
              <div className="strip-empty">{st.emptyPhotos}</div>
            )}
          </div>
        </section>

        {/* ============ SCENE 5 — DUNIA (dark) ============ */}
        <section id="dunia" className="scene scene-dunia" data-scene="dunia" data-theme="dark">
          <h2 className="dunia-word">{text.wordmark}</h2>
          <div className="dunia-grid">
            <div>
              <p className="dunia-label">{text.worldLabel}</p>
              <p className="dunia-note">{text.worldNote}</p>
              <ul className="chips">
                {text.worldChips.map((c) => (<li key={c} className="chip">{c}</li>))}
              </ul>
            </div>
            {P['04-books'] && (
              <div className="dunia-photo">
                <SmartImage src={P['04-books'].imageUrl} fallback={P['04-books'].fallbackUrl} alt={P['04-books'].alt} width={P['04-books'].width} height={P['04-books'].height} />
              </div>
            )}
          </div>
          <footer className="site-footer">
            <span>© {text.footerYear} {text.name} — {text.callName}. {text.footerNote}</span>
            <nav aria-label="Footer">
              {text.menu.sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); navigate(s.id); }}>
                  {s.label}
                </a>
              ))}
            </nav>
          </footer>
        </section>
      </main>

      {!introDone && <Intro text={text} photos={photos} onDone={onIntroDone} />}
    </>
  );
}
