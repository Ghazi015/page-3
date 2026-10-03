import { useEffect, useState } from 'react';
import NotFoundPage from './NotFoundPage';
import {
  adminEnabled,
  exportJSON,
  getCollections,
  getPhotos,
  getQuotes,
  getSiteText,
  resetAdmin,
  updatePhoto,
  updateQuote,
  updateSiteText,
} from '../services/content';

const TABS = [
  { id: 'foto', label: 'Foto' },
  { id: 'kutipan', label: 'Kutipan' },
  { id: 'teks', label: 'Teks Situs' },
];

/**
 * Admin sementara (Tahap 1): perubahan tersimpan di localStorage
 * perangkat ini dan bisa diekspor sebagai JSON untuk diganti manual
 * di repositori. Backend sungguhan menyusul di Tahap 2.
 */
export default function AdminPage() {
  const [tab, setTab] = useState('foto');
  const [photos, setPhotos] = useState(getPhotos);
  const [quotes, setQuotes] = useState(getQuotes);
  const [site, setSite] = useState(getSiteText);

  useEffect(() => {
    if (!adminEnabled) return undefined;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  if (!adminEnabled) return <NotFoundPage />;

  const refresh = () => {
    setPhotos(getPhotos());
    setQuotes(getQuotes());
    setSite(getSiteText());
  };

  return (
    <div className="admin">
      <p className="kicker">Mode sementara</p>
      <h1 className="display">Admin</h1>
      <div className="admin-banner" role="note">
        Mode sementara: perubahan belum tersimpan ke situs. Ekspor JSON, lalu ganti berkas di
        repositori.
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Tab admin">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`admin-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'foto' &&
        photos.map((p) => (
          <div className="admin-card" key={p.id}>
            <h3>{p.id}</h3>
            <img src={p.thumbnailUrl} alt={p.alt} />
            {[
              ['caption', 'Caption (tempat, tahun)'],
              ['location', 'Lokasi'],
              ['date', 'Tanggal'],
              ['alt', 'Alt text'],
            ].map(([field, label]) => (
              <div className="admin-field" key={field}>
                <label htmlFor={`${p.id}-${field}`}>{label}</label>
                <input
                  id={`${p.id}-${field}`}
                  value={p[field] || ''}
                  onChange={(e) => setPhotos(updatePhoto(p.id, { [field]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        ))}

      {tab === 'kutipan' &&
        quotes.map((q) => (
          <div className="admin-card" key={q.id}>
            <h3>{q.id}</h3>
            <div className="admin-field">
              <label htmlFor={`${q.id}-text`}>Isi kutipan</label>
              <textarea
                id={`${q.id}-text`}
                rows={3}
                value={q.text}
                onChange={(e) => setQuotes(updateQuote(q.id, { text: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor={`${q.id}-source`}>Sumber</label>
              <input
                id={`${q.id}-source`}
                value={q.source}
                onChange={(e) => setQuotes(updateQuote(q.id, { source: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor={`${q.id}-show`}>Tampilkan</label>
              <input
                id={`${q.id}-show`}
                type="checkbox"
                style={{ width: 'auto' }}
                checked={!!q.show}
                onChange={(e) => setQuotes(updateQuote(q.id, { show: e.target.checked }))}
              />
            </div>
          </div>
        ))}

      {tab === 'teks' && (
        <>
          <div className="admin-card">
            <h3>Hero</h3>
            {[
              ['kicker', 'Kicker'],
              ['alias', 'Alias'],
              ['scrollHint', 'Petunjuk gulir'],
            ].map(([field, label]) => (
              <div className="admin-field" key={field}>
                <label htmlFor={`hero-${field}`}>{label}</label>
                <input
                  id={`hero-${field}`}
                  value={site.hero[field]}
                  onChange={(e) => setSite(updateSiteText('hero', { [field]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="admin-card">
            <h3>Pesan</h3>
            <div className="admin-field">
              <label htmlFor="msg-lines">Baris pesan (satu per baris)</label>
              <textarea
                id="msg-lines"
                rows={4}
                value={site.message.lines.join('\n')}
                onChange={(e) =>
                  setSite(updateSiteText('message', { lines: e.target.value.split('\n') }))
                }
              />
            </div>
          </div>
          <div className="admin-card">
            <h3>Penutup & Footer</h3>
            <div className="admin-field">
              <label htmlFor="closing-line">Kalimat penutup</label>
              <input
                id="closing-line"
                value={site.closing.line}
                onChange={(e) => setSite(updateSiteText('closing', { line: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="footer-credit">Kredit footer</label>
              <input
                id="footer-credit"
                value={site.footer.credit}
                onChange={(e) => setSite(updateSiteText('footer', { credit: e.target.value }))}
              />
            </div>
          </div>
        </>
      )}

      <div className="admin-actions">
        {tab === 'foto' && (
          <button
            type="button"
            className="viewer-btn viewer-btn--download"
            onClick={() => exportJSON('photos.json', { photos, collections: getCollections() })}
          >
            Ekspor photos.json ↓
          </button>
        )}
        {tab === 'kutipan' && (
          <button
            type="button"
            className="viewer-btn viewer-btn--download"
            onClick={() => exportJSON('quotes.json', quotes)}
          >
            Ekspor quotes.json ↓
          </button>
        )}
        {tab === 'teks' && (
          <button
            type="button"
            className="viewer-btn viewer-btn--download"
            onClick={() => exportJSON('site-text.json', site)}
          >
            Ekspor site-text.json ↓
          </button>
        )}
        <button
          type="button"
          className="viewer-btn"
          onClick={() => {
            resetAdmin();
            refresh();
          }}
        >
          Kembalikan ke bawaan
        </button>
        <button type="button" className="viewer-btn" disabled title="Segera hadir">
          Simpan ke server — Segera hadir
        </button>
      </div>
    </div>
  );
}
