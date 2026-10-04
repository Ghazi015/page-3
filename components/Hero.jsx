'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { C } from '../lib/content';

const TR = [
  'M12 54L34 46Q48 42 50 32T66 22L98 22Q112 24 108 36L90 44Q82 48 92 54L102 60Q98 72 72 68L42 64Q18 66 12 54Z',
  'M14 40Q20 18 46 20T80 16Q108 14 106 38T84 62Q60 70 44 58T14 40Z',
  'M10 60L28 30L52 26L60 44L84 40L96 18L110 24L104 56Q96 70 60 66L22 68Z',
];
const Letters = ({ t, o = 0 }) => [...t].map((c, i) => <span key={i} style={{ '--i': i + o }}>{c}</span>);

export default function Hero({ hs, hero }) {
  const stage = useRef(), over = useRef(), pos = useRef(null), lock = useRef(false);
  const [on, setOn] = useState(false), [z, setZ] = useState(1), [ti, setTi] = useState(0);

  useEffect(() => { lock.current = on; }, [on]);
  useEffect(() => { const id = setInterval(() => setTi((i) => (i + 1) % TR.length), 3400); return () => clearInterval(id); }, []);

  /* efek glitch blok-blok piksel: foto kedua muncul seperti helm di web inspirasi */
  useEffect(() => {
    const W = 26, H = 44, A = 0.582; let last = 0, raf;
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 110 || !over.current) return;
      last = t;
      const p = pos.current,
        cx = p ? p.x : 0.5 + 0.14 * Math.sin(t / 1900),
        cy = p ? p.y : 0.26 + 0.09 * Math.sin(t / 1300 + 1),
        R = lock.current ? 3 : (p ? 0.3 : 0.2) + 0.05 * Math.sin(t / 700);
      let d = '';
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const q = Math.hypot(((x + 0.5) / W - cx) * A, (y + 0.5) / H - cy) / R;
        if (q < 1 && Math.random() < 1.6 * (1 - q) + 0.05) d += `M${x} ${y}h1v1h-1z`;
      }
      const u = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'><path d='${d}'/></svg>`)}")`;
      over.current.style.webkitMaskImage = u; over.current.style.maskImage = u;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const mv = (e) => {
    const r = stage.current.getBoundingClientRect();
    pos.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  return (
    <section className="stk hero" onPointerMove={mv} onPointerLeave={() => { pos.current = null; }}>
      <div className="topo" /><div className="mist" />
      <div className="nm"><h1><Letters t={C.name} />{'\u00A0'}<Letters t={C.last} o={C.name.length} /></h1></div>
      <p className="sub">{C.role}</p>
      <div className="stage" ref={stage} style={{ transform: `scale(${z})` }}>
        <img src={hs[0]} alt="Foto utama" />
        <img className="over" ref={over} src={hs[1]} alt="Foto kedua" />
      </div>
      <p className="cred">{hero.map((h, i) => <span key={i}>{`${String(i + 1).padStart(2, '0')} — ${h.name} • ${h.date}`}</span>)}</p>
      <div className="next">
        <small>{C.next.label}</small>
        <div className="box">
          <svg viewBox="0 0 120 80"><path key={ti} pathLength="1" d={TR[ti]} /></svg>
          <b>{C.next.title}</b><hr /><span>{C.next.sub}</span>
        </div>
      </div>
      <div className="zm">
        <button aria-label="Perbesar" onClick={() => setZ((v) => Math.min(1.5, +(v + 0.1).toFixed(2)))}>+</button>
        <button aria-label="Perkecil" onClick={() => setZ((v) => Math.max(0.8, +(v - 0.1).toFixed(2)))}>−</button>
      </div>
      <button className={'lock' + (on ? ' on' : '')} onClick={() => setOn(!on)} aria-pressed={on} aria-label={C.lock}>
        <small>{C.lock}</small>
        <svg viewBox="0 0 24 26" width="26" height="28" fill="none" stroke="#0E0F10" strokeWidth="1.8" strokeLinejoin="round"><path d="M9 11V5a1.5 1.5 0 013 0v5m0-1.5a1.5 1.5 0 013 0V11m0-1a1.5 1.5 0 013 0v5c0 4-2.5 6-6 6h-1c-2 0-3.5-1-4.5-2.5L4 15.5a1.5 1.5 0 012.3-1.8L9 16V11" /></svg>
      </button>
    </section>
  );
}
