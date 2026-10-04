import { C } from '../lib/content';
import Lights from './Lights';

export default function Footer() {
  const e = C.end;
  return (
    <footer className="end">
      <div className="aur" /><Lights n={18} />
      <p className="eb">{e.eb}</p>
      <h2 className="shine">{e.t[0]} <em>{e.t[1]}</em></h2>
      <nav>{e.links.map((l) => <a key={l} href="#">{l}</a>)}</nav>
      <div className="two">
        <div><h4>{e.partners}</h4><div className="lgs">{Array.from({ length: 8 }, (_, i) => <div key={i} className="lg">LOGO</div>)}</div></div>
        <div><h4>{e.socials}</h4><div className="soc">{e.handles.map((h, i) => <a key={i} href="#"><span className="ph" /><small>{h}</small></a>)}</div></div>
      </div>
      <p className="ml">{e.mail}</p>
      <small>{e.copy}</small>
    </footer>
  );
}
