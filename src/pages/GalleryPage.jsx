import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getPhotos, getSiteText } from '../services/content';

export default function GalleryPage() {
  const navigate = useNavigate();
  const text = getSiteText();
  const photos = getPhotos();

  return (
    <div>
      <section className="gallery">
        <div className="gallery-head">
          <div>
            <p className="kicker">Arsip foto</p>
            <h1 className="display gallery-title">{text.gallery.title}</h1>
          </div>
          <p className="world-desc" style={{ marginTop: 0 }}>
            {text.gallery.intro}
          </p>
        </div>
        <div className="gallery-grid">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="g-item"
              aria-label={`Buka foto: ${p.alt}`}
              onClick={() => navigate(`/foto/${p.id}`, { state: { returnTo: '/galeri' } })}
            >
              <img
                src={i < 2 ? p.imageUrl : p.thumbnailUrl}
                alt={p.alt}
                width={p.width}
                height={p.height}
                loading={i < 2 ? 'eager' : 'lazy'}
              />
              <span className="small">{p.category}</span>
            </button>
          ))}
        </div>
      </section>
      <Footer text={text} />
    </div>
  );
}
