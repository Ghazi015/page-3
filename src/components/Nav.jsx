import { useEffect, useRef, useState } from 'react';

/* Navigasi kecil + menu fullscreen dengan foto pilihan subjek,
   penanda section, operasi keyboard, dan pemindahan fokus. */
export default function Nav({ text, photos, onNavigate }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      const t = setTimeout(() => closeRef.current && closeRef.current.focus(), 80);
      return () => clearTimeout(t);
    }
    if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    return undefined;
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'Tab' && menuRef.current) {
        const list = Array.from(menuRef.current.querySelectorAll('a, button'));
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const m = text.menu;
  const menuPhoto = photos.find((p) => p.id === '03-gallery');
  const go = (e, id) => { e.preventDefault(); setOpen(false); onNavigate(id); };

  return (
    <>
      <header className="nav">
        <a className="nav-word" href="#hero" onClick={(e) => go(e, 'hero')}>
          {text.wordmark}
        </a>
        <button
          className="nav-burger"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? m.close : m.open}
        </button>
      </header>

      <div
        className={`menu ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={m.title}
        ref={menuRef}
      >
        {menuPhoto && (
          <div className="menu-photo" aria-hidden="true">
            <img src={menuPhoto.imageUrl} alt="" loading="lazy" decoding="async" />
          </div>
        )}
        <button className="menu-close" ref={closeRef} onClick={() => setOpen(false)}>
          {m.close}
        </button>
        <p className="menu-title">{m.title}</p>
        <ul className="menu-list">
          {m.sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={(e) => go(e, s.id)}>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="menu-foot">
          <span>{text.name}</span>
          <span>{text.tagline}</span>
        </div>
      </div>
    </>
  );
}
