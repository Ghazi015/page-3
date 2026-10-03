/* Content service — lapisan data.
 * Fungsi dibuat tetap (getPhotos / getQuotes / getSiteText) agar nanti
 * bisa diganti ke API/backend tanpa mengubah UI. */

const base = import.meta.env.BASE_URL;

async function getJSON(path) {
  const res = await fetch(`${base}${path}`, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

export function getPhotos() {
  return getJSON('data/photos.json');
}

export function getQuotes() {
  // Stage 1: kutipan hidup di site-text.json; quotes.json opsional untuk Tahap 2.4
  return getJSON('data/quotes.json').catch(() => []);
}

export function getSiteText() {
  return getJSON('data/site-text.json');
}
