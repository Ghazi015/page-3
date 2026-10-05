# Genevieve Reine Luciano — Profil & Galeri

Ruang digital personal untuk **Genevieve Reine Luciano** (panggilan: JosC) — karakter IC di
GTA V Roleplay yang diperankan oleh JosC. Website profil + portofolio foto dalam Bahasa
Indonesia, dengan hero interaktif dua foto (lingkaran mengikuti kursor), parallax, strip
foto horizontal, dua "dunia", galeri + photo viewer dengan unduh, dan admin sementara.

## Stack

- Vite + React 18 + React Router 6
- GSAP + ScrollTrigger (koreografi scroll, pinning, parallax, transisi)
- Lenis (smooth scroll — hanya pointer halus & non reduced-motion)
- Font variable open-source: Fraunces (display) + Manrope (body), dibundel lokal via Fontsource
- Foto WebP responsif di `public/photos/`

## Menjalankan

Butuh Node 18+ (diuji di Node 20).

```bash
npm install
npm run dev       # pengembangan di http://localhost:5173
npm run build     # build produksi ke dist/
npm run preview   # pratinjau hasil build
```

## Struktur penting

```
src/data/photos.json      # semua foto: file, caption, lokasi, tanggal, alt, kategori + koleksi
src/data/quotes.json      # kutipan (isi, sumber, tampil/tidak)
src/data/site-text.json   # semua teks situs (hero, pesan, judul, penutup, footer)
src/services/content.js   # lapisan data: getPhotos/updatePhoto/getQuotes/… (siap disambungkan ke API)
src/components/           # Hero, Loader, PhotoStrip, QuoteBlock, WorldDoors, CollectionModule, PhotoViewer, …
src/pages/                # HomePage, WorldPage, GalleryPage, AdminPage, NotFoundPage
public/photos/            # foto WebP (full + thumb)
```

## Mengganti foto & teks

1. **Foto**: letakkan berkas WebP di `public/photos/` dengan nama `<id>.webp` dan
   `<id>-thumb.webp` (id sesuai `photos.json`), lalu edit `src/data/photos.json`
   (caption/lokasi/tanggal/alt/urutan). Alternatif tanpa menyentuh kode: buka `/admin`
   saat pengembangan, edit, lalu **Ekspor JSON** dan timpa berkas di `src/data/`.
2. **Teks**: edit `src/data/site-text.json` (atau lewat tab "Teks Situs" di `/admin`).
3. **Kutipan**: edit `src/data/quotes.json` (atau tab "Kutipan").

Caption hanya ditampilkan jika Anda mengisinya (format "tempat, tahun"); saat ini semua
caption sengaja kosong karena datanya tidak diberikan — foto tampil tanpa caption tebakan.

## Admin sementara (Tahap 1)

- Aktif saat `npm run dev`, atau di build dengan `VITE_ENABLE_ADMIN=true`
  (lihat `.env.example`). Di produksi defaultnya **mati** → `/admin` menampilkan 404
  bergaya situs, tanpa tautan publik, dan diberi `noindex`.
- Perubahan tersimpan **hanya di localStorage** perangkat itu dan bisa diekspor sebagai
  JSON. Banner "Mode sementara" ditampilkan jujur; tombol "Simpan ke server" nonaktif
  dengan label "Segera hadir". Tidak ada login palsu.
- Tahap 2 (belumdibuat): Worker Cloudflare + R2 untuk penyimpanan sungguhan — lapisan
  `content.js` sudah dirancang agar penggantian implementasi tidak mengubah UI.

## Deploy ke GitHub + Vercel

```bash
git init && git add -A && git commit -m "init: profil Genevieve"
git remote add origin <url-repo> && git push -u origin main
```

Di Vercel: *Import Project* → pilih repo → preset **Vite**
(build `npm run build`, output `dist`) → Deploy. `vercel.json` sudah me-rewrite semua
rute ke `index.html` agar refresh / deep-link tidak 404. Vercel Hobby hanya untuk
penggunaan non-komersial; untuk klien/berbayar gunakan paket Pro atau hosting lain.

## Batas paket gratis (Tahap 2, Cloudflare)

Workers gratis: 100.000 permintaan/hari dan 10 ms CPU per pemanggilan. R2 gratis: 10 GB
penyimpanan, 1 juta operasi Class A & 10 juta Class B/bulan, tanpa biaya egress
(mengaktifkan R2 mungkin meminta metode pembayaran; tagihan hanya muncul jika melewati
kuota — pantau di dashboard Cloudflare). Angka bisa berubah; cek halaman harga resmi
masing-masing layanan sebelum mengandalkan batas ini.

## Asumsi yang diambil

1. Hobi "menggambar & desain baju" diperlakukan sebagai hal nyata tentang subjek dan
   ditampilkan sebagai momen tipografik di Ruang Karya.
2. Kutipan besar diambil langsung dari pesan yang Anda berikan
   ("Jangan biarkan siapa pun membatasi pencapaianmu."); baris pesan pertama memakai
   tema ketegaran/bangkit kembali yang Anda tulis, hampir verbatim.
3. Tidak ada data tempat/tahun untuk caption, maka semua caption dikosongkan
   (foto tampil tanpa caption, sesuai aturan "jangan menebak").
4. "JOSC Gallery" (tercipta pada aset notebook Anda) dipakai sebagai motif pembuka kecil,
   dan kalimat penutup diambil dari teks yang tercetak di notebook tersebut.
5. Foto `sakura-dove.png` dan `Max_a_Jadikan_lebih_jernih_1.png` ternyata identik; keduanya
   tetap disertakan sebagai dua entri galeri.
6. `buku-kuno` (ancient.jpg) beresolusi rendah (380×500) sehingga hanya dipakai sebagai
   gambar hover/kecil, tidak pernah fullscreen.
7. Koleksi "dua sisi" (putih ↔ hitam) dan "buku" (spiral ↔ detail) dibangun dari foto yang
   ada, dengan tap-to-toggle di layar sentuh dan dukungan keyboard.

## Sengaja tidak dibuat (dan alasannya)

- Toko, kalender acara, marquee partner, grid sosial media, form sign-up, halaman legal —
  tidak ada kontennya, jadi dilewati (aturan skala).
- Halaman kutipan terpisah — kutipan cukup satu dan sudah menjadi momen besar di beranda.
- WebGL/3D, partikel, gradien neon — tidak diminta dan bertentangan dengan aturan efek.
- Backend admin sungguhan (Tahap 2) — menunggu permintaan Anda; kerangka sementaranya sudah jujur.
- Analitik/cookie — tidak diminta; tidak ada pelacakan.
