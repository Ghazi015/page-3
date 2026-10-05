import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNav } from '../hooks/useTransitionNav';

const LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/dunia/dalam-peran', label: 'Dalam Peran' },
  { to: '/dunia/ruang-karya', label: 'Ruang Karya' },
  { to: '/galeri', label: 'Galeri' },
];

const COLLAGE = [
  '/photos/potret-hitam-thumb.webp',
  '/photos/kolase-senja-thumb.webp',
  '/photos/sakura-merpati-thumb.webp',
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);
  const btnRef = useRef(null);
  const closeRef = useRef(null);
  const { go } = useNav();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const overlay = overlayRef.current;
    closeRef.current.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab') {
        const focusables = overlay.querySelectorAll('a, button');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      btnRef.current?.focus();
    };
  }, [open]);

  const nav = (to) => {
    setOpen(false);
    // beri waktu overlay menutup sebelum tirai transisi
    setTimeout(() => go(to), 30);
  };

  return (
    <>
      <header className="site-header">
        <NavLink
          to="/"
          className="wordmark"
          onClick={(e) => {
            e.preventDefault();
            nav('/');
          }}
        >
          Genevieve
        </NavLink>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'is-active' : ''}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          ref={btnRef}
          type="button"
          className="menu-btn menu-btn--mobile"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </header>

      <div
        className={`menu-overlay ${open ? 'is-open' : ''}`}
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        aria-hidden={!open}
      >
        <nav className="menu-nav">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `menu-link ${isActive ? 'is-active' : ''}`}
              tabIndex={open ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                nav(l.to);
              }}
            >
              {l.label}
            </NavLink>
          ))}
          <p className="menu-foot">Genevieve Reine Luciano · diperankan oleh JosC</p>
        </nav>
        <div className="menu-collage" aria-hidden="true">
          {COLLAGE.map((src) => (
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
        <button
          ref={closeRef}
          type="button"
          className="menu-close"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          Tutup ✕
        </button>
      </div>
    </>
  );
}
