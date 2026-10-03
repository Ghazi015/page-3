import { useNav } from '../hooks/useTransitionNav';

/** Dua pintu dunia — masing-masing membuka halamannya sendiri. */
export default function WorldDoors({ worlds, photos }) {
  const { go } = useNav();
  const doors = [
    { ...worlds.peran, imgId: 'potret-langit' },
    { ...worlds.karya, imgId: 'kolase-senja' },
  ];
  const byId = Object.fromEntries(photos.map((p) => [p.id, p]));

  return (
    <section aria-label={worlds.title}>
      <h2 className="sr-only">{worlds.title}</h2>
      <div className="doors">
        {doors.map((d) => (
          <button
            key={d.slug}
            type="button"
            className="door"
            onClick={() => go(`/dunia/${d.slug}`)}
          >
            <img src={byId[d.imgId].imageUrl} alt="" aria-hidden="true" loading="lazy" />
            <span className="door-inner">
              <span>
                <span className="display door-title">{d.title}</span>
                <span className="door-desc" style={{ display: 'block' }}>
                  {d.desc}
                </span>
              </span>
              <span className="door-cta">{d.doorLabel} →</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
