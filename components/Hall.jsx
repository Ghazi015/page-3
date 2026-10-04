'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { C } from '../lib/content';
import Lights from './Lights';

export default function Hall({ cards }) {
  const [s, setS] = useState(-1), n = cards.length, c = cards[s];
  useEffect(() => { document.querySelector('.card.on')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); }, [s]);
  return (
    <section className="hall">
      <div className="aur" /><div className="beam" /><Lights n={20} />
      <header>
        <div><p className="eb rv">{C.hall.eb}</p><h2 className="rv">{C.hall.t[0]} <em>{C.hall.t[1]}</em></h2></div>
        <p>{C.hall.p}</p>
      </header>
      <div className="track">
        {cards.map((x, i) => (
          <button key={i} className={'card' + (s === i ? ' on' : '')} onClick={() => setS(s === i ? -1 : i)}>
            <span className="ph">{x.src && <img src={x.src} alt="" />}{x.src2 && <img className="h" src={x.src2} alt="" />}</span>
            <span className="lb"><b>{x.name}</b><i>{x.date}</i></span>
          </button>
        ))}
      </div>
      {c && (
        <article className="detail">
          <div className="ph">{c.src && <img src={c.src} alt="" />}</div>
          <div>
            <h3>{c.name}</h3><p className="dt">{c.date}</p><p className="tx">{c.note}</p>
            <div className="nav">
              <button onClick={() => setS((s - 1 + n) % n)}>Sebelumnya</button>
              <button onClick={() => setS((s + 1) % n)}>Berikutnya</button>
              <button className="g" onClick={() => setS(-1)}>Tutup</button>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
