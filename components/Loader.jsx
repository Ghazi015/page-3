'use client';
import { useEffect, useState } from 'react';

export default function Loader() {
  const [p, setP] = useState(0), [out, setOut] = useState(false), [gone, setGone] = useState(false);
  useEffect(() => {
    document.body.classList.add('ld');
    const t0 = performance.now(); let r;
    const f = (t) => {
      const k = Math.min(1, (t - t0) / 2600);
      setP(Math.round(k * 100));
      if (k < 1) r = requestAnimationFrame(f);
      else {
        setOut(true);
        document.body.classList.remove('ld');
        document.body.classList.add('go');
        setTimeout(() => setGone(true), 1700);
      }
    };
    r = requestAnimationFrame(f);
    return () => cancelAnimationFrame(r);
  }, []);
  if (gone) return null;
  return (
    <div id="ld" className={out ? 'out' : ''}>
      <div className="cu t" /><div className="cu b" />
      <div className="lc">
        <svg viewBox="0 0 200 200" role="img" aria-label="Corgi lucu">
          <ellipse cx="100" cy="193" rx="62" ry="6" fill="#0004" />
          <g className="tail"><ellipse cx="156" cy="152" rx="13" ry="9" fill="#E8963C" /></g>
          <ellipse cx="100" cy="150" rx="54" ry="40" fill="#E8963C" />
          <ellipse cx="100" cy="162" rx="28" ry="26" fill="#fff" />
          <ellipse cx="78" cy="184" rx="15" ry="9" fill="#fff" /><ellipse cx="122" cy="184" rx="15" ry="9" fill="#fff" />
          <path d="M50 76L56 18L96 52Z" fill="#E8963C" /><path d="M60 62L62 34L84 54Z" fill="#F7A8B8" />
          <path d="M150 76L144 18L104 52Z" fill="#E8963C" /><path d="M140 62L138 34L116 54Z" fill="#F7A8B8" />
          <ellipse cx="100" cy="86" rx="54" ry="45" fill="#E8963C" />
          <path d="M100 42C92 60 88 76 76 92C80 114 120 114 124 92C112 76 108 60 100 42Z" fill="#fff" />
          <ellipse cx="72" cy="104" rx="19" ry="13" fill="#fff" /><ellipse cx="128" cy="104" rx="19" ry="13" fill="#fff" />
          <ellipse cx="100" cy="106" rx="24" ry="16" fill="#fff" />
          <ellipse cx="78" cy="68" rx="4" ry="3" fill="#F5C27A" /><ellipse cx="122" cy="68" rx="4" ry="3" fill="#F5C27A" />
          <g className="eye"><circle cx="78" cy="82" r="7" fill="#1b1b1b" /><circle cx="80" cy="79" r="2.4" fill="#fff" /><circle cx="122" cy="82" r="7" fill="#1b1b1b" /><circle cx="124" cy="79" r="2.4" fill="#fff" /></g>
          <circle cx="64" cy="96" r="6" fill="#F7A8B8" opacity=".5" /><circle cx="136" cy="96" r="6" fill="#F7A8B8" opacity=".5" />
          <path className="tg" d="M92 112Q100 134 108 112Z" fill="#FF6F91" />
          <ellipse cx="100" cy="98" rx="9" ry="6.5" fill="#1b1b1b" /><ellipse cx="97" cy="96" rx="2.6" ry="1.6" fill="#fff" opacity=".6" />
          <path d="M100 104V110M100 110Q91 118 85 110M100 110Q109 118 115 110" stroke="#1b1b1b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
        <p>MEMUAT CERITA <b>{p}</b>%</p>
        <i className="pb"><u style={{ width: p + '%' }} /></i>
      </div>
    </div>
  );
}
