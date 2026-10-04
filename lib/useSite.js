'use client';
import { useEffect, useState } from 'react';
import { C } from './content';
import { CLOUD } from './cloud';

export const blank = (i) => ({ name: `Nama Foto ${String(i + 1).padStart(2, '0')}`, date: '01 JAN 2026', note: 'Catatan foto.', src: '', src2: '' });
const seed = () => ({
  hero: C.hero.map((x) => ({ ...x })),
  collage: C.collage.map((x) => ({ src: '', src2: '', ...x })),
  cards: Array.from({ length: C.hall.n }, (_, i) => blank(i)),
});

export function useSite() {
  const [S, setS] = useState(seed);
  useEffect(() => {
    (async () => {
      let d;
      try {
        d = CLOUD.load
          ? await (await fetch(CLOUD.load, { headers: CLOUD.headers })).json()
          : JSON.parse(localStorage.getItem('site-state'));
      } catch (e) {}
      if (d && d.hero && d.collage && d.cards) setS(d);
    })();
  }, []);
  const save = async () => {
    if (CLOUD.save) {
      try { await fetch(CLOUD.save, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...CLOUD.headers }, body: JSON.stringify(S) }); }
      catch (e) { alert('Gagal simpan ke cloud'); }
    }
    try { localStorage.setItem('site-state', JSON.stringify(S)); } catch (e) {}
  };
  return { S, setS, save };
}
