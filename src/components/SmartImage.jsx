import { useState } from 'react';

/* Gambar dengan state anggun: fade-in saat muat, fallback bergaya
   situs saat gagal, dan jalur cadangan webp -> jpg. */
export default function SmartImage({ src, fallback, alt, width, height, eager = false, className = '' }) {
  const [cur, setCur] = useState(src);
  const [st, setSt] = useState('loading');

  if (!src || st === 'err') {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt || 'Foto tidak tersedia'}>
        <span>Foto tidak tersedia</span>
      </div>
    );
  }

  return (
    <img
      className={`si ${st === 'ok' ? 'is-loaded' : ''} ${className}`.trim()}
      src={cur}
      alt={alt || ''}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchpriority: 'high' } : {})}
      onLoad={() => setSt('ok')}
      onError={() => {
        if (fallback && cur !== fallback) { setCur(fallback); setSt('loading'); }
        else setSt('err');
      }}
    />
  );
}
