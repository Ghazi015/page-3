'use client';
/* eslint-disable @next/next/no-img-element */
import { Fragment, useState } from 'react';
import { C } from '../lib/content';
import Pic, { Crop } from './Pic';
import Lights from './Lights';

const Head = ({ eb, t, c }) => (<><p className="eb">{eb}</p><h2 className={c}>{t[0]} <em>{t[1]}</em></h2></>);

function W({ t }) {
  let i = 0;
  return t.split('*').map((s, k) => k % 2
    ? <em key={k} style={{ '--i': i++ }}>{s} </em>
    : s.split(' ').filter(Boolean).map((w, j) => <span key={k + '-' + j} style={{ '--i': i++ }}>{w} </span>));
}

/* transisi tanda tangan + teks berjalan */
export function Sig() {
  const row = C.sig.map((s) => <b key={s}>{s}<i>✦</i></b>);
  return (
    <section className="sig" aria-hidden="true">
      <svg className="scrawl" viewBox="0 0 400 140"><path pathLength="1" d="M10 110C60 20 90 150 140 60S210 10 250 90 330 120 390 20" /></svg>
      <div className="mq"><span>{row}</span><span>{row}</span></div>
      <div className="mq r"><span>{row}</span><span>{row}</span></div>
    </section>
  );
}

export function Mani() {
  return (
    <section className="stk mani">
      <div className="topo d" /><div className="aur" /><Lights n={20} />
      <p className="words"><W t={C.mani} /></p>
    </section>
  );
}

export function Profile({ hs }) {
  const p = C.profile;
  return (
    <section className="stk prof">
      <div className="topo" />
      <figure className="fr"><div className="ph"><Crop h={0} c={[330, 50, 17]} hs={hs} /></div><div className="beam" /><figcaption>{p.tag}</figcaption></figure>
      <div className="pt">
        <Head eb={p.eb} t={p.t} />
        {p.p.map((x, i) => <p key={i} className="tx">{x}</p>)}
        <dl>{p.f.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
        <svg className="sg" viewBox="0 0 200 60"><path pathLength="1" d="M6 46C28 8 40 58 58 26S92 8 108 40S150 54 194 12" /></svg>
      </div>
    </section>
  );
}

export function Duo({ hs }) {
  const d = C.duo, [c, setC] = useState(null);
  return (
    <section className="stk duo">
      <header><div><Head eb={d.eb} t={d.t} /></div><p>{d.p}</p></header>
      <div className={'cmp' + (c !== null ? ' t' : '')} style={c !== null ? { '--c': c + '%' } : undefined}>
        <div className="ly"><img src={hs[0]} alt="Sisi terang" /></div>
        <div className="ly"><img src={hs[1]} alt="Sisi gelap" /></div>
        <div className="ln" />
        <div className="lt a">{d.a[0]}<small>{d.a[1]}</small></div>
        <div className="lt b">{d.b[0]}<small>{d.b[1]}</small></div>
        <input type="range" min="0" max="100" defaultValue="50" aria-label="Geser perbandingan" onChange={(e) => setC(+e.target.value)} />
      </div>
      <footer><span>{d.f[0]}</span><span>{d.f[1]}</span></footer>
    </section>
  );
}

export function Journey({ hs }) {
  const j = C.jr;
  return (
    <section className="jr">
      <div className="aur" /><Lights n={14} />
      <div className="hd"><Head eb={j.eb} t={j.t} c="rv" /></div>
      <ol className="tl">
        {j.items.map((x) => (
          <li key={x.y} className="rv">
            <div className="ph"><Pic it={x} hs={hs} /></div>
            <time>{x.y}</time><h3>{x.t}</h3><p>{x.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
