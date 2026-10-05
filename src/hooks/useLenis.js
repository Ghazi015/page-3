import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll Lenis: hanya untuk perangkat pointer halus dan
 * saat prefers-reduced-motion tidak aktif. Di layar sentuh scroll
 * native dipertahankan demi INP yang baik.
 */
export default function useLenis() {
  const reduced = useReducedMotion();
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !fine) return undefined;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [reduced]);
}

export function scrollToTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
