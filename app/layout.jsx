import { Anton, Instrument_Serif } from 'next/font/google';
import './globals.css';

const d = Anton({ subsets: ['latin'], weight: '400', variable: '--font-d', display: 'swap' });
const s = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-s', display: 'swap' });

export const metadata = {
  title: 'NAMA KAMU — Sebuah Film Pendek',
  description: 'Profil dan album foto sinematik.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${d.variable} ${s.variable}`}>
      <body>{children}</body>
    </html>
  );
}
