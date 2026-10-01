# AR13 — SEBUAH FILM FOTO · Catatan Produksi
Dokumen kerja: arah visual, peta adegan, keputusan teknis, audit akhir.
Dibuat dari 6 gambar kiriman. Format mengikuti urutan kerja: diagnosis → arah → peta → uji.

---

## 1 · DIAGNOSIS PROYEK
**Mode A — bangun dari nol.** Tidak ada kode sumber yang dikirim, hanya 6 gambar dan satu ide.

Fondasi yang dipilih:
* satu halaman, tanpa framework, tanpa build step — bisa dibuka langsung dari `file://` maupun hosting,
* panggung sinematik memakai **`position: sticky`**, bukan *pin* GSAP: tidak ada `pin-spacer`, tidak ada lompatan tata letak di iOS/Android,
* data foto dipisah dari tampilan (`window.Gallery`), jadi mengganti foto tidak menyentuh kode UI,
* GSAP + ScrollTrigger disimpan lokal di `assets/js/vendor/` — tidak ada permintaan ke CDN, film jalan luring.

## 2 · ARAH VISUAL
* **Sua­sana:** sinematik, hangat, sedikit melankolis. Warna filmnya sudah ada di fotonya: senja jingga (foto 1), langit biru pucat (foto 2), biru malam berpercikan emas (foto 4).
* **Palet:** tinta `#07070a` (ruang gelapnya bioskop), kertas `#f2ece1` (huruf), emas `#d9a441` (aksen tunggal), pirus jingga `#ffd8a3` untuk cahaya pintu.
* **Huruf:** *Bodoni/Didot* untuk semua kalimat film (serif tinggi, berjarak lebar), *sans* netral untuk mikro-teks teknis (label bingkai, tombol). Satu keluarga untuk emosi, satu untuk mesin.
* **Perlakuan foto:** tidak ada efek gaya-gayaan. Tiap babak punya satu gerak kamera dan satu *grade*:
  gerbang dibalik + digelapkan (kita sudah "di dalam"), sakura dibiarkan terang, kota didorong masuk, koin ditarik ke wajahnya, arsip ditarik mundur.
* **Ruang negatif:** teks selalu diletakkan di sisi yang tidak menutup wajah — babak sakura & koin teksnya ke kanan karena subjeknya di kiri.
* **Irama:** ramai (pembuka) → tenang → terang → gelap → percikan → hening → finale.
* Yang **tidak** dipakai: kaca buram, neon, gradien ungu, kartu membulat, partikel, teks raksasa di tengah.

## 3 · PEMETAAN REFERENSI
| Foto | Nama berkas | Peran |
| --- | --- | --- |
| **1** | `Max_a_bikin_tulisannya_hil.png` | **Panggung pembuka + gerbang.** Titik pintu gulung (`MUSEO ATAP 02`) diukur di 71,2% × 68,3% bingkai dan dipakai sebagai titik zoom kamera & titik bukaan pintu. Peta kawat 3D digambar mengikuti bentuk rumah, dua menara, dan atap miringnya. |
| **2** | `IMG_20261001_130155.png` | **Subjek / dia.** Finale (potongan 4:5), siluet di Babak I, dan bahan awan pembuka (versi kabur — jadi pembuka tidak meminjam dunia lain). |
| **3** | `city-corgi.png` | **Babak III — Kota.** Gerak: kamera mendorong masuk. |
| **4** | `coin-gold.png` | **Babak IV — Koin.** Dari bingkai lebar → potongan wajah (push-in) + potongan detail koin. |
| **5** | `sakura-dove.png` | **Babak II — Sakura** (dipilih sebagai babak pertama setelah gerbang karena paling terang/lepas) + potongan detail merpati. |
| **6** | `books.jpg` | **Babak V — Arsip**, langsung menyambung ke lemari arsip & unduhan. |

## 4 · KONSEP SINEMATIK
Momen yang dikejar: *"aku seperti sedang masuk ke sebuah film tentang dia."*

Jadi gerbangnya bukan hiasan — **gerbang itu pintu masuk filmnya.** Penonton dibawa drone menembus awan, melihat dunia itu masih berupa gambar arsitek (peta kawat) yang lalu menjadi nyata, lalu **masuk lewat pintu yang terbuka** — dan baru setelah itu bertemu dia. Cahaya hangat dari pintu itu muncul lagi di finale sebagai halo di belakang kepalanya: satu-satunya efek yang diulang, dan sengaja.

## 5 · PETA ADEGAN
| # | Adegan | Gerak | Isi |
| --- | --- | --- | --- |
| 0 | **Pemuat** | foto gerbang kabur + bilah | "Awan" — pilih: Buka filmnya / Lewati pembuka |
| 1 | **Pembuka (0–700vh)** | guliran menggerakkan kamera | awan → peta kawat digambar & didekati → fokus ke pintu (penanda) → drone maju, pintu gulung naik, cahaya melimpah → kedipan |
| 2 | **BABAK I · Gerbang** | dorong sangat pelan | gerbang dibalik & digelapkan: kita sudah di dalam; siluet dia lewat sebentar |
| 3 | **BABAK II · Sakura** | dorong pelan | bingkai lebar + foto detail merpati masuk seperti ditempel di meja kerja |
| 4 | **BABAK III · Kota** | dorong masuk | satu bingkai lebar, teks di kiri bawah |
| 5 | **BABAK IV · Koin** | *crossfade* lalu push-in | bingkai lebar → potongan wajah → potongan detail koin |
| 6 | **BABAK V · Arsip** | tarik mundur | buku bercahaya, lalu pintu menuju lemari |
| 7 | **Lembari Arsip** | dua jalur film-strip otomatis | 6 kartu, arah berlawanan; sentuh untuk berhenti sebentar, klik untuk buka penuh |
| 8 | **FINALE · Dia** | kamera mengendap + halo menyala | potongan 4:5 di kanan, teks di kiri, dua tombol: buka penuh / unduh |
| 9 | **Credits** | hening | asal-usul, tombol putar ulang, unduh semua |
| — | **Antrian film** | muncul sendiri saat diam / di ujung pembuka | dinding 8 saluran, bukan iklan: ruang bernapas |

## 6 · STRATEGI FOTO
* **Dipakai apa adanya untuk unduhan:** enam berkas asli di `images/foto/` (941×1617 s.d. 2080×1161, 223–421 KB) — tidak dikompresi ulang, tanpa tanda air.
* **Potongan turunan** hanya untuk panggung (agar guliran mulus): `hero/` berisi potongan 21:9, 4:5, 9:16, 16:9 sesuai peran tiap adegan; `detail/` untuk dua potongan kecil.
* **Tidak ada gambar baru yang dibuat-buat.** Dua "gambar jembatan" dibuat dari bahan yang sudah ada:
  1. **awan pembuka** = foto 2 yang dikaburkan 38 px (jadi warna langit pembuka satu keluarga dengan foto dia),
  2. **peta kawat rumah** = gambar vektor yang digambar sendiri mengikuti siluet gerbang di foto 1.
* **Urutan** sengaja bukan urutan unggah (lihat README): 01 → 05 → 03 → 04 → 06 → 02.

## 7 · RENCANA TRANSISI
| Peralihan | Teknik |
| --- | --- |
| Awan → dunia | kabut mengabur + peta kawat muncul (crossfade berlapis) |
| Peta kawat → foto gerbang | penajaman bertahap (blur 26→0 px) sambil kamera turun, garis kawat memudar — *match cut* bentuk rumah |
| Foto gerbang → dalam gerbang | kamera menembus pintu: zoom 4,8× ke titik pintu + pintu gulung naik + cahaya melimpah + kedipan putih → potong |
| Antar babak | potong keras dengan bar hitam sempit (lingkaran penuh) — biar terbaca sebagai babak, bukan geseran |
| Babak IV | *crossfade* lebar → wajah (kamera meneruskan gerak) |
| Babak V → arsip | kamera mundur, lalu dinding film-strip masuk dari luar bingkai |
| Arsip → finale | halo emas menyala di belakang kepalanya (kembalinya cahaya gerbang) |
| Foto → penampil | dua bilah tirai menutup lalu membuka ke bingkai penuh (layar bioskop) |

## 8 · STRATEGI ARSIP, PENAMPIL, UNDUHAN
* **Arsip:** dua jalur film-strip berjalan berlawanan (bukan grid kartu) supaya terasa seperti meja penyuntingan. Kursor menghampiri = jalur melambat; menyentuh di ponsel = jalur berhenti 3 detik; di mode hemat: jadi rel yang digeser jari.
* **Penampil:** bingkai besar, antarmuka minimum (tutup, sebelumnya/berikutnya, unduh), tombol ← → Esc D, geser jari untuk pindah, fokus terkunci di dalam dialog, tetangga bingkai dipramuat.
* **Unduhan:** satu klik di dalam penampil, satu klik di kartu arsip, satu tombol "Unduh semua foto (06)", dan rujukan langsung pada finale. Tidak ada langkah tersembunyi, tidak ada gerbang masuk.

## 9 · STRATEGI RESPONSIF
**Bukan versi kecil dari desktop — komposisinya dibuat ulang.**
* **≥1100 px:** teks bergantian kiri/kanan, potongan detail muncul, jalur arsip berjalan sendiri, titik babak di kanan.
* **821–1100 px:** panggung tetap, potongan detail diperkecil, panjang tiap babak tetap.
* **≤820 px:** semua teks pindah ke kiri bawah, buang penanda bingkai yang bertumpuk, finale jadi potongan tegak penuh dengan teks di bawah, dinding arsip jadi rel geser jari, antrian film jadi 2×4 saluran, titik babak disembunyikan (sudah ada HUD).
* **Sentuh:** tanpa hover → kartu menampilkan tombol unduh permanen halus; take pembuka disederhanakan (tanpa kabur/filter) dan lintasannya dipendekkan (340vh) supaya tetap ringan.
* Selalu `aspect-ratio` + `width/height` pada gambar: tidak ada lompatan tata letak.

## 10 · KEPUTUSAN TEKNOLOGI
| Kebutuhan | Pilihan | Alasan |
| --- | --- | --- |
| Gerak yang digerakkan guliran | **GSAP + ScrollTrigger (lokal)** | satu-satunya cara yang rapi untuk menggeser garis waktu panjang & mencucinya bolak-balik |
| Adegan melekat | **CSS `position: sticky`** | tanpa pin GSAP: lebih aman di iOS, tanpa penataan ulang DOM |
| Penampil & arsip | **JS biasa** | tidak butuh kerangka kerja; 6 foto tidak sebanding dengan berat React |
| Guliran halus | **bawaan browser** | Lenis tidak menambah apa pun di sini; bawaan lebih hemat baterai |
| Awan, kabut, kawat 3D | **CSS transform + SVG** | cukup, dan jauh lebih murah daripada WebGL |
| Suara | **Web Audio API** | satu dengung C + angin; tanpa berkas audio |
| Gerak dikurangi | **`prefers-reduced-motion`** | mematikan gerak kamera, isi tetap lengkap |

Tanpa build step. Tanpa kerangka kerja. Tanpa CDN.

## 11 · ARSITEKTUR KOMPONEN
```
index.html
├── #film                 pembuka: track → stage → cam → (langit, awan, dunia kawat, piringan gerbang, bar, kapten)
├── header.hud            nama + babak sekarang + tombol suara
├── nav.dots              titik babak
├── main
│   ├── section.chap ×5   babak (plate + inset/detail + teks + meta)
│   ├── section.galeri    arsip → wall → strip ×2 → card ×18
│   ├── section.finale    plate + glow + halo + teks + aksi
│   └── footer.credits    asal-usul + aksi + catatan berkas
├── section.cover         antrian film (8 saluran)
├── div.viewer            penampil foto
└── div.boot              pemuat
```
Modul: `Gallery` (data) → `FILMVIEWER` (arsip, penampil, unduhan) → `FILMSCENES` (sinematik, suara, papan tombol) → `boot` (penyala). Satu arah, tanpa saling silang.

## 12 · STRUKTUR BERKAS
Lihat README.md. Ringkas: `index.html`, `data/gallery.js`, `assets/css/main.css`, `assets/js/{boot,scenes,viewer}.js`, `assets/js/vendor/`, `images/{hero,foto,detail}/`.

## 13 · IMPLEMENTASI
Berjalan sepenuhnya di dalam folder ini (tanpa pseudo-kode). Bagian yang paling perlu dibaca saat menyunting: blok **01 · TOKEN** di `main.css` (warna/huruf/jarak) dan `buildFilm()` di `scenes.js` (seluruh irama take pembuka, satu garis waktu, angka 0–1 = posisi guliran).

## 14 · PROMPT GAMBAR
Tidak dipakai. Semua adegan dibangun dari enam foto kiriman; dua "jembatan" (awan & peta kawat) dibuat dengan mengaburkan foto sendiri dan menggambar SVG. Aturan yang dipegang: *foto asli dulu, baru karangan.*

## 15 · PENGUJIAN
| Uji | Hasil |
| --- | --- |
| Desktop 1440×900 | seluruh adegan berjalan, guliran mulus |
| Tablet 834×1112 | tata letak berganti, potongan 21:9 tetap utuh |
| Ponsel 390×844 | take pembuka ringan, finale tegak penuh, arsip jadi rel geser |
| Sentuh | geser jari pindah bingkai, tanpa efek hover yang menggantung |
| Papan tombol | Tab → titik babak → kartu → penampil; fokus terkunci di penampil; Esc menutup dan mengembalikan fokus |
| `prefers-reduced-motion` | gerak kamera mati, isi tetap tampil |
| Jaringan lambat / berkas hilang | bilah pemuat berhenti pada "Menunggu…" lalu lanjut setelah 9 detik; gambar gagal → tulisan "Bingkai ini gagal dimuat", penampil tetap memberi tombol unduh |
| Arsip besar | jalur film-strip berjalan sendiri; di mode hemat jadi rel geser (mampu menampung puluhan foto) |
| Unduhan | satu klik per foto dari penampil & kartu; 6 berkas berurutan dari "Unduh semua" |
| Tanpa JavaScript | enam foto tampil sebagai daftar unduhan (`<noscript>`) |

## 16 · AUDIT AKHIR
| Patokan | Nilai |
| --- | --- |
| **Visual** — sinematik? | ✅ pembuka satu take 700vh, kapten, bar hitam, pasir film |
| **Fotografi** — lebih dominan daripada antarmuka? | ✅ tidak ada kisi kartu; HUD cuma nama, babak, suara |
| **Cerita** — runtut? | ✅ gerbang → masuk → dia → pilihan → arsip → finale |
| **Gerak** — punya alasan? | ✅ tiap babak satu gerak kamera; sisa benar-benar diam |
| **Referensi** — dipetakan benar? | ✅ pintu `MUSEO ATAP 02` dari foto 1 benar-benar diukur dan dibuka; foto 2 jadi subjek & finale |
| **Ponsel** — disengaja? | ✅ komposisi ulang, bukan pengecilan |
| **Performa** — hemat? | ✅ ±5 MB total, 6 permintaan JS/CSS, tanpa CDN, gambar bertahap |
| **Aksesibilitas** — terpakai? | ✅ struktur semantik, alt bermakna, fokus terkunci, `prefers-reduced-motion`, `<noscript>` |
| **Kepribadian** — hanya milik dia? | ✅ dibangun dari gerbang & wajahnya sendiri |
| **AI-slop** — dihindari? | ✅ tanpa kaca buram, neon, gradien, teks raksasa di tengah, kartu membulat |

**Penyederhanaan terakhir (apa yang dibuang):** Lenis (tidak perlu), Three.js/WebGL (cukup CSS+SVG), *service worker* (tidak perlu bila semua berkas lokal), bagian harga/statistik/testimoni (bukan film pribadi), animasi pada setiap elemen (gerak = kamera saja).
