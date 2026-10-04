'use client';
import { useEffect, useState } from 'react';

export default function Lights({ n = 16 }) {
  const [a, setA] = useState([]);
  useEffect(() => {
    setA(Array.from({ length: n }, () => ({ l: Math.random() * 100, t: Math.random() * 100, z: 2 + Math.random() * 5, d: 2 + Math.random() * 4, s: Math.random() * 6 })));
  }, [n]);
  return (
    <div className="lights">
      {a.map((p, i) => <i key={i} style={{ left: p.l + '%', top: p.t + '%', '--z': p.z + 'px', '--t': p.d + 's', '--dl': -p.s + 's' }} />)}
    </div>
  );
}
