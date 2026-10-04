'use client';
import { useState } from 'react';
import { blank } from '../lib/useSite';
import { uploadFile, PIN } from '../lib/cloud';

const K = [['name', 'Nama'], ['date', 'Tanggal'], ['note', 'Catatan / cerita'], ['src', 'URL foto (cloud)'], ['src2', 'URL foto hover']];
const SEC = [['hero', 'Foto hero', 2], ['collage', 'Kolase album', 5], ['cards', 'Arsip kartu', 5]];

export default function Admin({ S, setS, save }) {
  const [open, setOpen] = useState(false);
  const upd = (sec, i, k, v) => setS((s) => ({ ...s, [sec]: s[sec].map((x, j) => (j === i ? { ...x, [k]: v } : x)) }));
  const go = () => { if (PIN && prompt('PIN admin') !== PIN) return; setOpen(true); };
  return (
    <>
      <button id="gear" aria-label="Buka panel admin" onClick={go}>⚙</button>
      <aside id="admin" className={open ? 'open' : ''} aria-label="Panel admin">
        <header><b>Panel Admin</b><button className="btn" onClick={() => setOpen(false)}>Tutup</button></header>
        <div id="rows">
          {SEC.map(([sec, label, nk]) => S[sec].map((o, i) => (
            <div className="row" key={sec + i}>
              <h4>{label} {i + 1}</h4>
              {K.slice(0, sec === 'hero' ? 4 : nk).map(([k, p]) => (
                <input key={k} placeholder={p} value={o[k] || ''} onChange={(e) => upd(sec, i, k, e.target.value)} />
              ))}
              <input type="file" accept="image/*" onChange={async (e) => e.target.files[0] && upd(sec, i, 'src', await uploadFile(e.target.files[0]))} />
              {sec === 'cards' && <button className="x" onClick={() => setS((s) => ({ ...s, cards: s.cards.filter((_, j) => j !== i) }))}>Hapus kartu</button>}
            </div>
          )))}
        </div>
        <footer>
          <button className="btn" onClick={() => setS((s) => ({ ...s, cards: [...s.cards, blank(s.cards.length)] }))}>+ Kartu</button>
          <button className="btn" onClick={async () => { await save(); alert('Tersimpan'); }}>Simpan</button>
          <button className="btn" onClick={() => navigator.clipboard.writeText(JSON.stringify(S)).then(() => alert('JSON disalin'))}>Salin JSON</button>
          <button className="btn" onClick={() => { if (confirm('Reset semua perubahan?')) { try { localStorage.removeItem('site-state'); } catch (e) {} location.reload(); } }}>Reset</button>
        </footer>
      </aside>
    </>
  );
}
