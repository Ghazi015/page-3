# AR13 — Sebuah Film Foto

Satu halaman, satu take: **awan terbuka → drone turun → gerbang di atas bukit terbuka → kamu masuk ke dalam filmnya.**
Setelah itu enam foto bercerita sampai finale, lalu bisa dibuka penuh & diunduh.

Semua berkas ada di dalam folder ini. **Tidak ada satu pun berkas yang diambil dari internet** — begitu ZIP ini dibuka, filmnya jalan walau tanpa koneksi.

---

## Cara membuka (pilih salah satu)

1. **Paling gampang:** klik dua kali `index.html`.
   Semua sudah lokal, jadi tetap jalan. (Beberapa browser membatasi hal kecil seperti `IntersectionObserver` pada berkas `file://`, tapi filmnya tetap main.)
2. **Paling mulus (disarankan):** taruh folder ini di server/hosting apa pun (Netlify, Vercel, GitHub Pages, cPanel, atau `python3 -m http.server` di komputer sendiri), lalu buka `index.html`.
   Cara tercepat di komputer:
   ```bash
   cd cinematic-photo-film
   python3 -m http.server 8080
   # lalu buka http://localhost:8080
   ```

---

## Cara memakai & mengganti isi

| Mau ganti apa | Sentuh berkas ini |
| --- | --- |
| Foto (tampil penuh + unduhan) | `images/foto/01…06*.jpg` — timpa dengan berkas baru, **nama sama** |
| Judul, kaption, ukuran, urutan, panggung babak | `data/gallery.js` |
| Foto panggung pembuka (gerbang, awan, potongan 21:9, poster) | `images/hero/` |
| Foto detail kecil (merpati, koin) | `images/detail/` |
| Warna, huruf, jarak, irama | `assets/css/main.css` (blok **01 · TOKEN** di paling atas) |
| Gerak kamera pembuka & tiap babak | `assets/js/scenes.js` |
| Tulisan kapten pembuka | `index.html` → cari `film__captions` |
| Teks babak & credits | `index.html` |

Menambah foto ke-7? Tambahkan satu blok di `data/gallery.js` (salin blok yang ada, ganti `id`, `src`, `thumb`, `w`, `h`), taruh berkasnya di `images/foto/`, dan tambahkan pada `ROWS` bila ingin muncul di dinding arsip.

---

## Kontrol

| Tombol | Fungsi |
| --- | --- |
| Geser / gulir | Memutar filmnya (pembuka digerakkan guliran, bukan waktu) |
| **Spasi / → / PageDown** | Maju satu layar saat take pembuka |
| **F** | Lompat ke finale |
| **Shift + R** | Putar ulang dari awan |
| Saat antrian film muncul: **P / T** | Ganti saluran yang "hidup" |
| Saat antrian film muncul: **→** | Masuk ke film · **Esc** | langsung ke finale |
| Di penampil foto: **← →** | Pindah bingkai · **Esc** tutup · **D** unduh |

Tanpa kursor pun jalan penuh: titik babak di kanan, tombol unduh di dalam penampil, dan tombol "Unduh semua foto".

---

## Peta berkas

```
cinematic-photo-film/
├── index.html                  seluruh adegan (satu halaman)
├── README.md                   berkas ini
├── DOKUMENTASI-PRODUKSI.md     catatan sutradara: arah visual, peta adegan, audit
├── data/
│   └── gallery.js              SATU-SATUNYA sumber data foto (via window.Gallery)
├── assets/
│   ├── icon.svg                ikon tab
│   ├── css/main.css            tata rupa + sinematografi (token di baris awal)
│   └── js/
│       ├── boot.js             pemuat awal & penyala semua mesin
│       ├── scenes.js           mesin sinematik (pembuka, babak, arsip, finale, suara)
│       ├── viewer.js           penampil foto, dinding arsip, unduhan
│       └── vendor/             gsap.min.js + ScrollTrigger.min.js (lokal, 3.13.0)
└── images/
    ├── hero/                   panggung pembuka (16:9, 21:9, 4:3, 9:16, poster)
    ├── foto/                   enam foto asli — sasaran unduhan
    └── detail/                 potongan kecil (merpati, koin)
```

Teknologi: **HTML + CSS + JavaScript + GSAP/ScrollTrigger lokal**. Tidak ada framework, tidak ada build step, tidak ada permintaan ke server luar. Adegan memakai `position: sticky` (bukan *pin* GSAP) supaya tata letak aman di iOS/Android.

---

## Catatan produksi

* **Dibuat dari 6 gambar kirimanmu.** Tidak ada gambar baru yang dibuat-buat: awan pembuka adalah foto `Dia` yang dikaburkan, dan maket kawat 3D digambar sendiri mengikuti bentuk gerbang di foto 1 — jadi bingkai pertama dan bingkai berikutnya tetap "satu dunia".
* **Urutan film bukan urutan unggah.** Kurasi: 01 Gerbang → 05 Sakura → 03 Kota → 04 Koin → 06 Arsip → **02 Dia (finale)**, supaya naik dramatis.
* **Suara** dibuat di browser (dengung C + angin), tanpa berkas audio. Tombol "Suara" ada di kanan atas.
* **Antrian film** muncul sendiri kalau penonton diam ±26 detik, dan di akhir take pembuka: itu momen bernapas, bukan iklan.
* Semua foto asli **tidak dikompresi ulang** saat diunduh: yang terunduh adalah berkas di `images/foto/` (1640–2752 px).
* Kurangi gerak? `prefers-reduced-motion` dihormati: gerak kamera berhenti, isi tetap tampil.
* Ukuran seluruh paket ± 5 MB.
