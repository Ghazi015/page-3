'use client';
import { useEffect, useState } from 'react';
import { C } from '../lib/content';
import Pic from './Pic';

const SP = [4, 3, 5, 3, 4, 5, 5, 3, 4, 4, 5, 3];
const AR = ['3/4', '1', '4/5', '4/5', '3/4', '1', '1', '3/4', '4/5', '3/4', '1', '4/5'];
const OY = [0, 6, -3, 4, 0, 5, -4, 0, 6, -2, 3, 0];
const RT = [-1.2, 1, -0.6, 0.8, -0.9, 1.1, -1, 0.6, -0.7, 1, -0.5, 0.9];

export default function Collage({ items, hs }) {
  const [i, setI] = useState(-1), n = items.length, it = items[i];
  useEffect(() => {
    if (i < 0) return;
    const k = (e) => {
      if (e.key === 'Escape') setI(-1);
      if (e.key === 'ArrowRight') setI((j) => (j + 1) % n);
      if (e.key === 'ArrowLeft') setI((j) => (j - 1 + n) % n);
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [i, n]);
  return (
    <section className="col" id="album">
      <div className="topo" />
      <header>
        <div><p className="eb rv">{C.col.eb}</p><h2 className="rv">{C.col.t[0]} <em>{C.col.t[1]}</em></h2></div>
        <p>{C.col.p}</p>
      </header>
      <div className={'cg' + (i >= 0 ? ' has' : '')}>
        {items.map((x, j) => (
          <button key={j} className={'tile rv' + (i === j ? ' on' : '')} onClick={() => setI(i === j ? -1 : j)}
            style={{ '--sp': SP[j % 12], '--ar': AR[j % 12], '--oy': OY[j % 12] + 'vh', '--rt': RT[j % 12] + 'deg', transitionDelay: (j % 3) * 0.12 + 's' }}>
            <span className="ph"><Pic it={x} hs={hs} /></span>
            <b>{x.name}</b><i>{x.date}</i>
          </button>
        ))}
      </div>
      {it && (
        <div className="vw" onClick={() => setI(-1)}>
          <div className="in" onClick={(e) => e.stopPropagation()}>
            <div className="ph"><Pic it={it} hs={hs} /></div>
            <div>
              <p className="eb">{`Foto ${i + 1} / ${n}`}</p>
              <h3>{it.name}</h3><p className="dt">{it.date}</p><p className="tx">{it.note}</p>
              <div className="nav">
                <button onClick={() => setI((i - 1 + n) % n)}>Sebelumnya</button>
                <button onClick={() => setI((i + 1) % n)}>Berikutnya</button>
                <button className="g" onClick={() => setI(-1)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
