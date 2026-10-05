import { useNav } from '../hooks/useTransitionNav';

export default function NotFoundPage() {
  const { go } = useNav();
  return (
    <div className="notfound">
      <div>
        <h1 aria-hidden="true">404</h1>
        <p className="sr-only">Halaman tidak ditemukan</p>
        <p className="world-desc" style={{ margin: '10px auto 26px' }}>
          Halaman ini tidak ada — mungkin masih berupa sketsa di buku gambar.
        </p>
        <button type="button" className="viewer-btn viewer-btn--download" onClick={() => go('/')}>
          kembali ke beranda →
        </button>
      </div>
    </div>
  );
}
