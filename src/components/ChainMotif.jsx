/**
 * Motif visual subjek: rantai bros kerah yang muncul di hampir
 * semua foto Genevieve. Dipakai sebagai pembatas & tanda tangan visual.
 */
export default function ChainMotif({ className = '' }) {
  return (
    <svg
      className={`chain ${className}`}
      viewBox="0 0 220 78"
      fill="none"
      aria-hidden="true"
    >
      <rect x="6" y="6" width="22" height="5" rx="2.5" fill="currentColor" opacity="0.9" />
      <circle cx="208" cy="26" r="3.4" fill="currentColor" />
      <path
        className="chain-path"
        d="M14 11 C 70 54, 150 54, 208 26"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className="chain-path"
        d="M14 11 C 82 72, 142 72, 208 26"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}
