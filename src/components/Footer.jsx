import { scrollToTop } from '../hooks/useLenis';

export default function Footer({ text, big = false }) {
  return (
    <>
      {big && (
        <section className="closing">
          <h2 className="closing-big">{text.closing.big}</h2>
          <p className="closing-line">“{text.closing.line}”</p>
          <p className="closing-note">{text.closing.note}</p>
        </section>
      )}
      <footer className="footer-bar">
        <span>{text.footer.credit}</span>
        <span className="footer-tags">
          {text.footer.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
        <span>
          <button type="button" className="menu-btn" onClick={() => scrollToTop()}>
            ke atas ↑
          </button>{' '}
          · © 2026 JosC
        </span>
      </footer>
    </>
  );
}
