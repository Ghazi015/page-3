/* Koneksi cloud via environment variable (lihat .env.example). Kosong = localStorage. */
export const CLOUD = {
  load: process.env.NEXT_PUBLIC_CLOUD_LOAD || '',   // GET  -> JSON {hero, collage, cards}
  save: process.env.NEXT_PUBLIC_CLOUD_SAVE || '',   // PUT  -> JSON yang sama
  upload: process.env.NEXT_PUBLIC_CLOUD_UPLOAD || '', // POST FormData "file" -> {"url":"https://..."}
  headers: {},
};
export const PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '';

function toDataUrl(f) {
  return new Promise((res) => {
    const i = new Image();
    i.onload = () => {
      const k = Math.min(1, 1000 / Math.max(i.width, i.height)), c = document.createElement('canvas');
      c.width = i.width * k; c.height = i.height * k;
      c.getContext('2d').drawImage(i, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.8));
    };
    i.src = URL.createObjectURL(f);
  });
}
export async function uploadFile(f) {
  if (CLOUD.upload) {
    const fd = new FormData(); fd.append('file', f);
    const r = await fetch(CLOUD.upload, { method: 'POST', headers: CLOUD.headers, body: fd });
    return (await r.json()).url;
  }
  return toDataUrl(f);
}
