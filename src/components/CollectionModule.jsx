import { useState } from 'react';

/**
 * Modul koleksi: gambar dasar ↔ gambar hover saling bertukar.
 * Hover di pointer halus; tap / Enter (aria-pressed) di layar sentuh & keyboard.
 */
export default function CollectionModule({ collections, photos, heading }) {
  const byId = Object.fromEntries(photos.map((p) => [p.id, p]));
  const [on, setOn] = useState({});

  return (
    <section className="collection">
      <h2 className="display strip-title" style={{ marginBottom: 28 }}>
        {heading}
      </h2>
      <div className="collection-grid">
        {collections.map((c) => {
          const base = byId[c.baseId];
          const hover = byId[c.hoverId];
          const wide = base.width > base.height;
          return (
            <button
              key={c.id}
              type="button"
              className={`collection-item ${wide ? 'collection-item--wide' : ''} ${
                on[c.id] ? 'is-on' : ''
              }`}
              aria-pressed={!!on[c.id]}
              aria-label={`${c.label} — ketuk untuk menukar gambar`}
              onClick={() => setOn((s) => ({ ...s, [c.id]: !s[c.id] }))}
            >
              <img
                className="img-base"
                src={base.imageUrl}
                alt={base.alt}
                width={base.width}
                height={base.height}
                loading="lazy"
              />
              <img
                className="img-hover"
                src={hover.imageUrl}
                alt={hover.alt}
                aria-hidden="true"
                width={hover.width}
                height={hover.height}
                loading="lazy"
              />
              <span className="collection-label">{c.label}</span>
            </button>
          );
        })}
      </div>
      <p className="collection-hint small">arahkan kursor / ketuk untuk menukar gambar</p>
    </section>
  );
}
