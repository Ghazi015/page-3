# Hero Site

Website statis (HTML + CSS + JS, tanpa build step).

## Struktur
```
index.html        halaman utama (teks, CSS, animasi, panel admin)
assets/           foto hero (ganti file atau ubah path di <script id="assets">)
vercel.json       konfigurasi Vercel
```

## Jalankan lokal
Buka `index.html` langsung di browser, atau:
```bash
npx serve .
```

## Upload ke GitHub
```bash
cd hero-site
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
(Buat repo kosong dulu di github.com/new, tanpa README.)

## Hosting di Vercel
1. Buka vercel.com > **Add New > Project** > **Import** repo GitHub tadi.
2. Framework Preset: **Other**. Build Command dan Output Directory dibiarkan kosong.
3. Klik **Deploy**. Setiap `git push` ke `main` otomatis deploy ulang.

Atau lewat CLI: `npx vercel --prod`

## Mengisi foto dari cloud
Di `index.html`, isi objek `CLOUD` (bagian script paling bawah):
- `load`  : GET JSON `{hero:[...], cards:[...]}`
- `save`  : PUT JSON yang sama
- `upload`: POST FormData `file`, balasan `{"url":"https://..."}`

Tanpa URL cloud, perubahan dari panel admin hanya tersimpan di browser editor (localStorage) dan tidak terlihat pengunjung lain.
`adminPin` hanya pengaman sisi klien; jangan dianggap aman untuk produksi.
