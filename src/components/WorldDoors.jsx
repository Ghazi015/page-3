import { useNav } from '../hooks/useTransitionNav';

export default function WorldDoors({ worlds, photos }) {
  const { go } = useNav();
  const doors = [
    { ...worlds.peran, imgId: 'potret-langit', eyebrow: '01 — IN CHARACTER', mode: 'in-role' },
    { ...worlds.karya, imgId: 'kolase-senja', eyebrow: '02 — BEYOND THE ROLE', mode: 'creative' },
  ];
  const byId = Object.fromEntries(photos.map((p) => [p.id, p]));

  return (
    <section className="doors-wrap" aria-label={worlds.title}>
      <div className="doors">
        {doors.map((d) => (
          <button key={d.slug} type="button" className="door" onClick={() => go(`/dunia/${d.slug}`)}>
            <img src={byId[d.imgId].imageUrl} alt="" aria-hidden="true" loading="lazy" />
            <div className="door-shade" />
            <span className="door-topline">
              <span>{d.eyebrow}</span>
              <span>{d.mode}</span>
            </span>
            <span className="door-inner">
              <span>
                <span className="display door-title">{d.title}</span>
                <span className="door-desc">{d.desc}</span>
              </span>
              <span className="door-cta">{d.doorLabel} ↗</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
