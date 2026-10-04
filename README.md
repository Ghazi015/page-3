# Hero Site (Next.js)

Website profil + album foto sinematik. Next.js 14 (App Router) + React 18, tanpa library tambahan.

## Jalankan
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Struktur
```
app/                layout (font), page, globals.css (semua gaya & animasi)
components/         Hero, Sections, Collage, Hall, Footer, Admin, Loader, ScrollFX, ...
lib/content.js      SEMUA TEKS (ganti di sini)
lib/cloud.js        koneksi cloud via environment variable
public/             hero-1.webp, hero-2.webp (foto hero)
```

## Mengganti teks & foto
- Teks: `lib/content.js`.
- Foto hero: ganti file di `public/` atau isi URL lewat panel admin (tombol ⚙).
- Nama/tanggal/cerita tiap foto kolase dan kartu arsip: panel admin (⚙).

## Cloud
Salin `.env.example` menjadi `.env.local` lalu isi `NEXT_PUBLIC_CLOUD_LOAD`, `..._SAVE`, `..._UPLOAD`
(upload: POST FormData `file`, balasan `{"url":"https://..."}`). Tanpa itu data tersimpan di localStorage
browser editor. `NEXT_PUBLIC_ADMIN_PIN` hanya pengaman sisi klien.

## GitHub + Vercel
```bash
git init && git add . && git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
Di vercel.com: **Add New > Project > Import** repo itu. Framework terdeteksi otomatis sebagai Next.js, lalu **Deploy**.
Isi environment variable di Project Settings > Environment Variables bila memakai cloud.

## Kalau deploy di Vercel gagal / 404
1. **package.json harus ada di root repo** (bukan di dalam subfolder). Cek di github.com: file `package.json` dan folder `app/` harus langsung terlihat di halaman utama repo. Kalau ada di subfolder, di Vercel buka Settings > General > **Root Directory** lalu pilih subfolder itu.
2. **Framework Preset harus Next.js**, bukan "Other". Kalau project Vercel lama dibuat untuk versi HTML statis, buka Settings > General > Build & Development Settings, pilih Next.js, hapus isian Build Command dan Output Directory (atau buat project baru). File `vercel.json` di sini sudah memaksa preset Next.js.
3. Node.js Version di Vercel minimal 18.17 (pilih 20.x).
4. Setelah mengubah pengaturan, klik **Redeploy** dan lihat tab **Build Logs** untuk pesan error.
