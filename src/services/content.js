// Lapisan data (content service).
// Sekarang membaca berkas JSON + overlay localStorage (mode sementara admin).
// Nanti implementasi ini bisa diganti ke API (Cloudflare Worker + R2)
// tanpa mengubah UI sedikit pun.
import photosData from '../data/photos.json';
import quotesData from '../data/quotes.json';
import siteTextData from '../data/site-text.json';

const LS = {
  photos: 'josc.admin.photos',
  quotes: 'josc.admin.quotes',
  site: 'josc.admin.sitetext',
};

function readLS(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLS(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* penyimpanan penuh / privat — abaikan dengan anggun */
  }
}

/* ---------- Foto ---------- */
export function getPhotos() {
  return readLS(LS.photos) || photosData.photos;
}

export function getCollections() {
  return photosData.collections;
}

export function getPhotoById(id) {
  return getPhotos().find((p) => p.id === id) || null;
}

export function updatePhoto(id, patch) {
  const next = getPhotos().map((p) => (p.id === id ? { ...p, ...patch } : p));
  writeLS(LS.photos, next);
  return next;
}

/* ---------- Kutipan ---------- */
export function getQuotes() {
  return readLS(LS.quotes) || quotesData;
}

export function updateQuote(id, patch) {
  const next = getQuotes().map((q) => (q.id === id ? { ...q, ...patch } : q));
  writeLS(LS.quotes, next);
  return next;
}

/* ---------- Teks situs ---------- */
export function getSiteText() {
  const overlay = readLS(LS.site);
  if (!overlay) return siteTextData;
  const merged = { ...siteTextData };
  for (const key of Object.keys(overlay)) {
    merged[key] =
      overlay[key] && typeof overlay[key] === 'object' && !Array.isArray(overlay[key])
        ? { ...siteTextData[key], ...overlay[key] }
        : overlay[key];
  }
  return merged;
}

export function updateSiteText(section, patch) {
  const current = readLS(LS.site) || {};
  current[section] = { ...(current[section] || {}), ...patch };
  writeLS(LS.site, current);
  return getSiteText();
}

/* ---------- Util admin ---------- */
export function resetAdmin() {
  try {
    Object.values(LS).forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* noop */
  }
}

export function exportJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- Gate admin ---------- */
export const adminEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === 'true';
