# JOSC Gallery — Profil Sinematik Genevieve Reine Luciano

Tahap 1: Fondasi dan Beranda. Vite + React + React Router + GSAP/ScrollTrigger + Lenis.
Versi laporan: 3 Oktober 2026.

## Menjalankan

- Node: 18+ (diuji di Node 20.20.2)
- `npm install`
- `npm run dev` → http://localhost:5173
- `npm run build` → output di `dist/`
- `npm run preview` → pratinjau hasil build

Mode debug transisi: buka `/?debug=1` (semua ScrollTrigger menampilkan marker).

## Deploy ke Vercel

1. Buat repositori Git, `git push`.
2. Impor di Vercel → preset **Vite** → output directory `dist` (default).
3. `vercel.json` sudah me-rewrite semua rute ke `index.html`.

## Mengganti foto & teks

- Foto: taruh berkas teroptimalkan (WebP + JPG cadangan) di `public/photos/`, lalu edit
  `public/data/photos.json` (id, imageUrl, fallbackUrl, width, height, alt, caption).
  Ukuran berkas hero disarankan < 150 KB; foto beresolusi rendah jangan jadi hero fullscreen.
- Teks: edit `public/data/site-text.json` (nama, tagline, karakter, pesan, teks menu, footer, state).
- Caption "tempat, tahun" hanya tampil jika Anda mengisi `caption` di photos.json.
  Saat ini semua caption kosong karena data belum diberikan.

## Struktur folder

```
public/data/photos.json      data foto (dibaca content service)
public/data/site-text.json   semua teks situs
public/photos/               gambar teroptimalkan + og.jpg
src/services/content.js      content service (getPhotos/getQuotes/getSiteText)
src/scenes/sceneChoreography.js  SEMUA ScrollTrigger beranda, berurutan sesuai DOM
src/components/              Intro, Nav, SmartImage
src/pages/                   Home, NotFound
src/styles/global.css        token tema, tipografi, semua style
```

Dependensi: react 18, react-router-dom 6, gsap 3, lenis, @fontsource-variable/fraunces,
@fontsource-variable/manrope. Tidak ada WebGL/3D.

## Peta Transisi (Tahap 1)

| A → B | Teknik | Pemicu | Durasi / scrub | Alasan |
|---|---|---|---|---|
| intro → hero | tirai clip-path + huruf stagger | waktu (≤2,5 dtk) / klik / kunci | 0,7 dtk power3 | pembuka signature, preload hero |
| hero → karakter | pengecilan ke kartu + marquee + color wash | scroll | pin, scrub 0.8 | dua sisi (putih→kartu) membuka dunia karakter |
| karakter → pesan | tirai (overlap) + dim | scroll | scrub true | nada berubah dari bising ke hening |
| pesan → galeri | zoom-through foto sakura + elemen tergambar (rantai) | scroll + masuk viewport | pin, scrub 1; rantai 1,1 dtk | "bangkit kembali" = menerobos masuk ke galeri |
| galeri (internal) | horizontal pin + tipografi lapisan belakang | scroll | pin, scrub 1 | ritme lembar album JOSC Gallery |
| galeri → dunia | mask wipe + tipografi raksasa naik | scroll | scrub true | penutup: masuk ke ruang pribadinya |

Dua pasangan berurutan tidak memakai teknik sama. Momen diam: awal scene pesan
(teks + rantai tergambar tanpa pin) sebelum zoom.

## Tabel Implementasi

| A → B | Berkas | Fungsi / selektor | Pin / scrub | Mobile |
|---|---|---|---|---|
| intro → hero | components/Intro.jsx | `.intro.exit`, `.intro-word span` | waktu | sama, pin n/a |
| hero → karakter | scenes/sceneChoreography.js | B1 `.hero-photo`, `.hero-marquee` | pin, scrub 0.8 | +=70% |
| karakter → pesan | scenes/sceneChoreography.js | B2 `.scene-inner`, `.scene-dim` | scrub | sama |
| pesan masuk (diam) | scenes/sceneChoreography.js | `.pesan-quote`, `.pesan-chain path` | non-scrub 0,9–1,1 dtk | sama |
| pesan → galeri | scenes/sceneChoreography.js | B3 `.pesan-photo-frame img`, `.next-bg` | pin, scrub 1 | +=80% |
| galeri strip | scenes/sceneChoreography.js | B4 `.strip-track`, `.galeri-type` | pin, scrub 1 | jarak ×0.7 |
| galeri → dunia | scenes/sceneChoreography.js | B5 `.scene-dunia` clip-path | scrub | sama |
| tema per section | scenes/sceneChoreography.js | `setTheme()` + `[data-theme]` | onEnter 0,8 dtk | sama |

## Lantai Sinematik (A9) — hasil pemeriksaan

1. Uji potong — LULUS. Lima batas (intro→hero, hero→karakter, karakter→pesan,
   pesan→galeri, galeri→dunia) masing-masing punya transisi; tidak ada potongan lurus.
2. Pergantian tema — LULUS. light → dark → accent → light → dark (4 kali),
   di-tween 0,8 dtk oleh `setTheme()` (sceneChoreography.js).
3. Gerak terikat scroll — LULUS. 5 ScrollTrigger scrub/pin (B1–B5), di luar fade teks kecil.
4. Lapisan — LULUS. hero: marquee+foto+judul; karakter: 5 kata + 2 kartu melayang;
   galeri: strip + tipografi belakang; dunia: wordmark + foto + tekstur.
5. Tipografi besar — LULUS. marquee 17vw, kata karakter 13.5vw, wordmark dunia 22vw.
6. Mobile — LULUS secara desain (pin +=70–80%, lapisan dipertahankan, hover/kursor diganti tap).
   BELUM diuji di perangkat nyata — lihat daftar cek manual.
7. Bukti — LULUS. Tabel Implementasi di atas + `?debug=1`.

## Asumsi

- Kutipan di scene Pesan diformat dari deskripsi IDE SAYA ("ketegaran… bangkit kembali…
  jangan membiarkan siapa pun membatasi pencapaian") menjadi dua kalimat; ganti isi
  `message`/`messageCta` di site-text.json jika ada kalimat aslinya.
- "JOSC Gallery" + "Kumpulan momen, sebuah cerita dalam gambar." diambil dari teks pada
  buku di foto 03 (aset milik subjek), bukan karangan.
- Foto 1 (setelan putih) = dasar hero; foto 2 (setelan hitam) = lapisan reveal
  (IDE: "foto pertama dan kedua jadi hero page").
- Tidak ada data tempat/tahun → foto ditampilkan tanpa caption.
- Aksen pink #E8A3C1 diturunkan dari foto sakura/blush; ungu #B79CED dari daftar warna disukai.
- Lenis (smooth scroll) hanya untuk pointer halus; layar sentuh & reduced motion pakai scroll native.

## Sengaja tidak dibuat (Tahap 1)

Halaman galeri terpisah, photo viewer, download, admin, backend, halaman kutipan terpisah,
kursor kustom, analitik — semuanya Tahap 2–4 atau opsional dan tidak diminta sekarang.

## Daftar cek manual (jalankan di perangkat nyata)

- [ ] Scroll pelan tiap batas section: tidak ada potongan lurus; tema berganti halus.
- [ ] `/?debug=1`: marker muncul di tiap transisi.
- [ ] iOS Safari & Android Chrome: pinned scroll tidak lompat saat address bar berubah;
      pastikan "Reduce Motion"/"Hapus animasi" MATI saat menguji transisi.
- [ ] Aktifkan Reduce Motion: semua jadi crossfade/tema instan, konten tetap lengkap.
- [ ] Hero desktop: kursor membuka lingkaran foto hitam; tombol "Sisi lain" bekerja; keyboard fokus terlihat.
- [ ] Hero sentuh: ketuk foto membuka/menutup lingkaran.
- [ ] Menu: buka/tutup (Escape), fokus terperangkap dan kembali ke tombol menu.
- [ ] Deep link `/#galeri` mendarat di galeri; tombol Back mengembalikan scroll.
- [ ] Rute acak (mis. `/abc`) menampilkan 404 bergaya.
- [ ] Matikan jaringan setelah load → state error tidak muncul (data sudah termuat);
      hapus satu foto di photos.json → fallback "Foto tidak tersedia" bergaya.
- [ ] Lighthouse mobile: LCP < 2,5 dtk (hero webp 60 KB), CLS < 0,1.

## Ringkasan Keputusan — Tahap 1

1. Identitas
   - Aksen: pink sakura #E8A3C1 (ungu lavender #B79CED sekunder, emas #C9A35C tersier)
   - Tema latar: light #F4F2F6 (hero, galeri) · dark #0D0A12 (karakter, dunia) · accent #F6DCE7 (pesan)
   - Font: Fraunces Variable (display) + Manrope Variable (body), self-hosted
   - Motif/tekstur: jacquard brokat (SVG data-uri), rantai bros (SVG tergambar), wordmark raksasa
2. Struktur
   - Adegan: hero → karakter → pesan → galeri → dunia
   - Rute: `/` dan `*` (404)
3. Peta Transisi: lihat tabel di atas (6 teknik berbeda: tirai intro, shrink-to-card,
   curtain, zoom-through + drawn line, horizontal pin, mask wipe)
4. Parameter motion: scrub 0.6–1 ease none; non-scrub power3.inOut 0.6–1.1 dtk;
   pin mobile +=70–80%; reduced motion = tema instan + crossfade 300 ms
5. Teknis: struktur folder di atas; content service getPhotos/getQuotes/getSiteText;
   Node 20 teruji; dependensi react 18 / router 6 / gsap 3 / lenis
6. Asumsi & tunda: lihat daftar di atas
7. Instruksi tahap berikut: pertahankan palet, motif, tipografi, dan Peta Transisi;
   tempel ringkasan ini + kode src/ di percakapan Tahap 2.
