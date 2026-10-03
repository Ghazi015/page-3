import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ChainMotif from './ChainMotif';
import useReducedMotion from '../hooks/useReducedMotion';

const WORD = 'GENEVIEVE';

/**
 * Intro signature: wordmark naik per huruf + motif rantai digambar,
 * lalu tirai terangkat. Maksimal ±2 detik, bisa dilewati, dan
 * langsung dilewati saat prefers-reduced-motion.
 */
export default function Loader({ onDone }) {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const doneRef = useRef(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      document.body.style.overflow = '';
      setGone(true);
      onDone();
    };
    if (reduced) {
      finish();
      return undefined;
    }
    const root = rootRef.current;
    const letters = root.querySelectorAll('.loader-word span');
    const paths = root.querySelectorAll('.chain-path');
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(letters, { y: 0, duration: 0.7, stagger: 0.045, ease: 'power3.out' })
      .to(paths, { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power2.inOut' }, '-=0.35')
      .to(root, { yPercent: -100, duration: 0.65, ease: 'power3.inOut', delay: 0.15 });

    const skip = () => {
      tl.kill();
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: finish,
      });
    };
    const btn = root.querySelector('.loader-skip');
    btn.addEventListener('click', skip);
    return () => {
      btn.removeEventListener('click', skip);
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onDone, reduced]);

  if (gone) return null;

  return (
    <div className="loader" ref={rootRef} role="presentation" aria-hidden="true">
      <p className="kicker" style={{ marginBottom: 6 }}>JOSC · Gallery mempersembahkan</p>
      <div className="loader-word">
        {WORD.split('').map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>
      <ChainMotif />
      <button className="loader-skip" type="button" tabIndex={0}>
        Lewati
      </button>
    </div>
  );
}
