import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { getPhotos } from '../services/content';

/**
 * Photo viewer: gambar besar, sebelumnya/berikutnya, tutup, unduh,
 * navigasi keyboard, fokus terkunci, URL sendiri (/foto/:id).
 */
export default function PhotoViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const photos = getPhotos();
  const idx = Math.max(0, photos.findIndex((p) => p.id === id));
  const photo = photos[idx] || photos[0];

  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const imgRef = useRef(null);
  const [status, setStatus] = useState('');

  const returnTo = location.state?.returnTo || '/galeri';

  const close = useCallback(() => navigate(returnTo), [navigate, returnTo]);
  const step = useCallback(
    (dir) => {
      const next = (idx + dir + photos.length) % photos.length;
      navigate(`/foto/${photos[next].id}`, { state: { returnTo } });
    },
    [idx, photos, navigate, returnTo]
  );

  /* keyboard + fokus */
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') {
        const focusables = rootRef.current.querySelectorAll('button, a');
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
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [close, step]);

  /* transisi ganti foto + preload tetangga + judul dokumen */
  useEffect(() => {
    gsap.fromTo(imgRef.current, { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
    [idx + 1, idx - 1].forEach((i) => {
      const p = photos[(i + photos.length) % photos.length];
      if (p) new Image().src = p.imageUrl;
    });
    const prev = document.title;
    document.title = `Foto ${idx + 1} — Genevieve Reine Luciano`;
    setStatus('');
    return () => {
      document.title = prev;
    };
  }, [idx, photos]);

  /* unduh: same-origin → fetch blob agar andal, cadangan tab baru */
  const download = async () => {
    setStatus('mengunduh…');
    try {
      const res = await fetch(photo.imageUrl);
      if (!res.ok) throw new Error(res.status);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photo.id}.webp`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setStatus('berhasil diunduh ✓');
    } catch {
      window.open(photo.imageUrl, '_blank', 'noopener');
      setStatus('membuka gambar di tab baru');
    }
  };

  return (
    <div className="viewer" ref={rootRef} role="dialog" aria-modal="true" aria-label={`Penampil foto: ${photo.alt}`}>
      <div className="viewer-top">
        <button type="button" className="viewer-btn" ref={closeRef} onClick={close}>
          ← Kembali
        </button>
        <span className="small">
          {String(idx + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </span>
        <button type="button" className="viewer-btn viewer-btn--download" onClick={download}>
          Unduh ↓
        </button>
      </div>
      <div className="viewer-stage">
        <button type="button" className="viewer-nav viewer-nav--prev" aria-label="Foto sebelumnya" onClick={() => step(-1)}>
          ←
        </button>
        <img ref={imgRef} src={photo.imageUrl} alt={photo.alt} />
        <button type="button" className="viewer-nav viewer-nav--next" aria-label="Foto berikutnya" onClick={() => step(1)}>
          →
        </button>
      </div>
      <div className="viewer-foot">
        <span className="small">{photo.category}</span>
        <span className="viewer-status" role="status">{status}</span>
      </div>
    </div>
  );
}
