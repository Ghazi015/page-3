/* eslint-disable @next/next/no-img-element */
export const Crop = ({ h = 0, c, hs }) => (
  <div className="cr" style={{ '--img': `url(${hs[h]})`, '--bs': c[0] + '%', '--bx': c[1] + '%', '--by': c[2] + '%' }} />
);
/* Foto dari cloud (src) > potongan foto hero (c) > kotak putih polos */
export default function Pic({ it, hs }) {
  if (it.src) return <img src={it.src} alt={it.name || ''} />;
  if (it.c) return <Crop h={it.h} c={it.c} hs={hs} />;
  return null;
}
