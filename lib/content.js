/* ===== SEMUA TEKS ADA DI SINI. Ganti sesuka hati. Tanda *kata* = huruf miring berwarna aksen. ===== */
export const C = {
  name: 'NAMA', last: 'KAMU',
  role: 'MODEL • PENCERITA • PEMBUAT TREN',
  store: 'STORE',
  hero: [
    { name: 'Nama Foto Utama', date: '01 JAN 2026', note: '', src: '' },
    { name: 'Nama Foto Kedua', date: '02 JAN 2026', note: '', src: '' },
  ],
  next: { label: 'NEXT EVENT', title: 'NAMA ACARA', sub: 'KOTA • 12 OKT 2026' },
  lock: 'TAP TO LOCK',
  sig: ['Tagline kamu', 'Kata kunci', 'Sejak 2019', 'Terus melaju'],
  mani: 'Tulis *manifesto* singkatmu di sini, satu kalimat besar yang *berani*, mudah diingat, dan bikin orang ingin tahu *kelanjutannya*.',
  profile: {
    eb: 'Babak I', t: ['Siapa', 'dia'], tag: 'POTRET 01 — CLOSE UP',
    p: [
      'Tulis paragraf pembuka tentang dirinya: dari mana ia datang, dan apa yang membuat orang berhenti menatap fotonya.',
      'Paragraf kedua bercerita tentang gaya khasnya: jas yang selalu rapi, rantai perak kecil, dan tatapan yang selalu punya rahasia.',
    ],
    f: [['Nama', 'Nama Lengkap Kamu'], ['Lahir', 'Kota, 01 Januari 2000'], ['Profesi', 'Model, kreator, penulis cerita'], ['Ciri khas', 'Rambut perak & setelan monokrom']],
  },
  duo: {
    eb: 'Babak II', t: ['Dua', 'sisi'],
    p: 'Geser garis di tengah foto untuk berpindah antara sisi terang dan sisi gelapnya. Tulis satu kalimat tentang dua kepribadian dalam satu sosok.',
    a: ['Terang', 'Tenang, anggun, dan penuh perhitungan.'],
    b: ['Gelap', 'Berani, nakal, dan tak terduga.'],
    f: ['SETELAN PUTIH / SETELAN HITAM', 'GESER ← →'],
  },
  col: { eb: 'Babak III', t: ['Album', 'foto'], p: 'Pilih salah satu foto untuk membaca cerita di baliknya. Setiap frame punya waktu, tempat, dan rahasianya sendiri.' },
  /* c = [skala%, posisi-x%, posisi-y%] potongan foto hero, h = foto hero ke-berapa (0/1). Tanpa c = kotak putih (isi lewat admin). */
  collage: [
    { name: 'Tatapan', date: 'FRAME 01 • KOTA, 2024', note: 'Ceritakan momen di balik foto ini: siapa yang memotret, di mana, dan apa yang sedang dipikirkan.', c: [420, 50, 17], h: 0 },
    { name: 'Anting salib', date: 'FRAME 02 • KOTA, 2024', note: 'Detail perak kecil yang jadi tanda pengenal. Tulis cerita tentang anting ini.', c: [420, 33, 23], h: 0 },
    { name: 'Rantai', date: 'FRAME 03 • KOTA, 2025', note: 'Bros dan rantai di atas setelan serba hitam. Tulis catatan sesi fotonya.', c: [420, 79, 44], h: 1 },
    { name: 'Kacamata', date: 'FRAME 04 • KOTA, 2025', note: 'Kacamata hitam yang selalu bertengger di atas rambut perak.', c: [420, 50, 0], h: 0 },
    { name: 'Sisi nakal', date: 'FRAME 05 • KOTA, 2025', note: 'Satu detik ketika sisi jahil keluar. Tulis ceritanya.', c: [330, 50, 18], h: 1 },
    { name: 'Cincin', date: 'FRAME 06 • KOTA, 2026', note: 'Cincin perak di tangan kiri. Tulis catatan kecil tentang benda ini.', c: [420, 4, 100], h: 0 },
    { name: 'Dasi', date: 'FRAME 07 • KOTA, 2026', note: 'Garis tegas dasi dan kerah putih. Tulis detail sesi busananya.', c: [260, 50, 38], h: 0 },
    { name: 'Potret putih', date: 'FRAME 08 • KOTA, 2026', note: 'Potret penuh setelan putih. Tulis cerita sesi ini.', c: [330, 50, 17], h: 0 },
    { name: 'Judul foto 9', date: 'FRAME 09 • KOTA, 2026', note: 'Isi foto dan cerita lewat panel admin.' },
    { name: 'Judul foto 10', date: 'FRAME 10 • KOTA, 2026', note: 'Isi foto dan cerita lewat panel admin.' },
    { name: 'Judul foto 11', date: 'FRAME 11 • KOTA, 2026', note: 'Isi foto dan cerita lewat panel admin.' },
    { name: 'Judul foto 12', date: 'FRAME 12 • KOTA, 2026', note: 'Isi foto dan cerita lewat panel admin.' },
  ],
  hall: { eb: 'Babak IV', t: ['Arsip', 'foto'], p: 'Telusuri seluruh arsip. Pilih sebuah kartu untuk melihat foto, nama, tanggal, dan cerita singkatnya.', n: 36 },
  jr: {
    eb: 'Babak V', t: ['Perjalanan', 'karier'],
    items: [
      { y: '2019', t: 'Langkah pertama', d: 'Ceritakan awal mula: sesi foto pertama, rasa gugup, dan siapa yang percaya padanya.', c: [300, 50, 17], h: 0 },
      { y: '2021', t: 'Mulai dikenal', d: 'Ceritakan titik balik: kampanye besar atau foto yang membuat namanya beredar.', c: [300, 50, 40], h: 1 },
      { y: '2024', t: 'Gaya yang khas', d: 'Ceritakan bagaimana setelan monokrom dan rambut peraknya jadi tanda pengenal.', c: [300, 33, 25], h: 0 },
      { y: '2026', t: 'Babak berikutnya', d: 'Ceritakan apa yang sedang ia siapkan, dan kenapa semua orang perlu menunggu.', c: [300, 50, 18], h: 1 },
    ],
  },
  end: {
    eb: 'Fin.', t: ['Terima', 'kasih'], links: ['Tiktok', 'Instagram', 'Youtube', 'Twitch'],
    mail: 'Kerja sama & kontak: email@kamu.com', partners: 'Mitra & kolaborasi', socials: 'Di media sosial',
    handles: ['@nama', '@nama', '@nama', '@nama', '@nama', '@nama'],
    copy: '© 2026 Nama Kamu. Semua hak dilindungi.',
  },
};
