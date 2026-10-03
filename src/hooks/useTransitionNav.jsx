import { createContext, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useReducedMotion from './useReducedMotion';
import { scrollToTop } from './useLenis';

const NavContext = createContext(null);

/**
 * Transisi halaman: dua panel tirai menyapu saat berpindah rute,
 * menjaga kontinuitas visual antar halaman. Reduced motion = langsung.
 */
export function NavProvider({ children }) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const curtainRef = useRef(null);
  const busy = useRef(false);

  const go = useCallback(
    (path, opts = {}) => {
      if (busy.current) return;
      if (reduced || opts.immediate) {
        navigate(path);
        scrollToTop();
        return;
      }
      const curtain = curtainRef.current;
      if (!curtain) {
        navigate(path);
        scrollToTop();
        return;
      }
      busy.current = true;
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
        },
      });
      tl.set(curtain, { autoAlpha: 1, pointerEvents: 'all' })
        .fromTo(
          curtain.children,
          { scaleY: 0, transformOrigin: 'bottom' },
          { scaleY: 1, duration: 0.38, stagger: 0.06, ease: 'power3.inOut' }
        )
        .add(() => {
          navigate(path);
          scrollToTop();
        })
        .to(curtain.children, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.45,
          stagger: 0.06,
          ease: 'power3.inOut',
          delay: 0.05,
        })
        .set(curtain, { autoAlpha: 0, pointerEvents: 'none' });
    },
    [navigate, reduced]
  );

  return (
    <NavContext.Provider value={{ go }}>
      {children}
      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <div className="curtain-panel" />
        <div className="curtain-panel curtain-panel--accent" />
      </div>
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext) || { go: () => {} };
}
