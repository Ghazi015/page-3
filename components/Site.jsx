'use client';
import { C } from '../lib/content';
import { useSite } from '../lib/useSite';
import Loader from './Loader';
import Hero from './Hero';
import { Sig, Mani, Profile, Duo, Journey } from './Sections';
import Collage from './Collage';
import Hall from './Hall';
import Footer from './Footer';
import Admin from './Admin';
import ScrollFX from './ScrollFX';

export default function Site() {
  const { S, setS, save } = useSite();
  const hs = [S.hero[0].src || '/hero-1.webp', S.hero[1].src || '/hero-2.webp'];
  return (
    <>
      <Loader />
      <div className="grain" /><div className="vig" /><div className="bar" />
      <a className="pill" href="#">{C.store}</a>
      <main>
        <Hero hs={hs} hero={S.hero} />
        <Sig />
        <Mani />
        <Profile hs={hs} />
        <Duo hs={hs} />
        <Collage items={S.collage} hs={hs} />
        <Hall cards={S.cards} />
        <Journey hs={hs} />
        <Footer />
      </main>
      <Admin S={S} setS={setS} save={save} />
      <ScrollFX />
    </>
  );
}
