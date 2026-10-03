import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSiteText } from '../services/content.js';

export default function NotFound() {
  const [text, setText] = useState(null);
  useEffect(() => {
    getSiteText().then(setText).catch(() => setText(null));
  }, []);
  const st = (text && text.states) || {};
  return (
    <div className="nf">
      <div>
        <h1>{st.notFoundTitle || '404'}</h1>
        <p>{st.notFoundBody || 'Halaman ini tidak ada.'}</p>
        <Link className="btn" to="/">{st.notFoundLink || 'Kembali ke beranda'}</Link>
      </div>
    </div>
  );
}
