import { useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';
import PhotoViewer from './components/PhotoViewer';
import HomePage from './pages/HomePage';
import WorldPage from './pages/WorldPage';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import { NavProvider } from './hooks/useTransitionNav';
import useLenis, { scrollToTop } from './hooks/useLenis';

/**
 * Perilaku scroll & riwayat: menyimpan posisi per halaman,
 * mengembalikan posisi saat tombol Back, dan me-refresh
 * ScrollTrigger setelah berpindah rute.
 */
function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();
  const positions = useRef(new Map());
  const prevKey = useRef(location.key);

  useEffect(() => {
    positions.current.set(prevKey.current, window.scrollY);
    const isPop = navType === 'POP';
    const saved = positions.current.get(location.key);
    const raf = requestAnimationFrame(() => {
      if (isPop && typeof saved === 'number') window.scrollTo(0, saved);
      else if (!isPop) scrollToTop();
      ScrollTrigger.refresh();
    });
    prevKey.current = location.key;
    return () => cancelAnimationFrame(raf);
  }, [location, navType]);

  return null;
}

function Shell() {
  useLenis();
  return (
    <>
      <a className="skip-link" href="#konten">
        Lewati ke konten
      </a>
      <Header />
      <ScrollManager />
      <main id="konten">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dunia/:slug" element={<WorldPage />} />
          <Route path="/galeri" element={<GalleryPage />} />
          <Route path="/foto/:id" element={<PhotoViewer />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavProvider>
        <Shell />
      </NavProvider>
    </BrowserRouter>
  );
}
