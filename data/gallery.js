/* ==========================================================================
   data/gallery.js — SATU-SATUNYA sumber data foto.
   UI hanya bicara lewat window.Gallery (services), tidak pernah menyentuh
   daftar ini langsung. Ganti/ tambah foto → cukup ubah berkas ini.
   ========================================================================== */
window.Gallery = (function () {
  'use strict';

  var FOTOS = [
    {
      id: 'gerbang',
      idx: '01',
      title: 'Gerbang di Atas Bukit',
      caption: 'Drone tiba tepat saat matahari turun di balik awan. Pintu itu menunggu.',
      alt: 'Gerbang dan rumah gudang seni di atas bukit saat senja; matahari di balik awan.',
      src: 'images/foto/01-gerbang-di-atas-bukit.jpg',
      thumb: 'images/hero/gate.jpg',
      w: 1672, h: 941, kb: 251,
      scene: 'Pembuka'
    },
    {
      id: 'sakura',
      idx: '05',
      title: 'Sakura & Merpati',
      caption: 'Bunga jatuh seperti cahaya yang turun perlahan. Seekor merpati lepas dari rantingnya.',
      alt: 'Dia berdiri di bawah ranting sakura; bunga berjatuhan dan seekor merpati melintas.',
      src: 'images/foto/05-sakura.jpg',
      thumb: 'images/hero/sakura-219.jpg',
      w: 1672, h: 941, kb: 286,
      scene: 'BABAK II'
    },
    {
      id: 'kota',
      idx: '03',
      title: 'Kota & Corgi',
      caption: 'Dari atas, kota ini cuma suara. Di punggung jaketnya, seekor corgi menatap kita.',
      alt: 'Dia membelakangi kota di bawah langit pucat; di punggung jaketnya seekor corgi.',
      src: 'images/foto/03-kota.jpg',
      thumb: 'images/hero/kota-219.jpg',
      w: 1672, h: 941, kb: 267,
      scene: 'BABAK III'
    },
    {
      id: 'koin',
      idx: '04',
      title: 'Koin High Table',
      caption: 'Satu koin, satu pilihan. Percikan emasnya jatuh lebih lama daripada kejapannya.',
      alt: 'Dia menunjuk satu koin emas bercahaya bergambar tengkorak bermahkota dan tulisan HIGH TABLE.',
      src: 'images/foto/04-koin.jpg',
      thumb: 'images/hero/koin-wide.jpg',
      w: 1640, h: 959, kb: 421,
      scene: 'BABAK IV'
    },
    {
      id: 'arsip',
      idx: '06',
      title: 'Arsip',
      caption: 'Buku-buku tua berputar mengelilingi satu buku bercahaya. Semua cerita disimpan di sini.',
      alt: 'Buku-buku tua berputar mengelilingi satu buku bercahaya di dalam cincin cahaya keemasan.',
      src: 'images/foto/06-arsip.jpg',
      thumb: 'images/hero/arsip-219.jpg',
      w: 2080, h: 1161, kb: 232,
      scene: 'BABAK V'
    },
    {
      id: 'dia',
      idx: '02',
      title: 'Dia',
      caption: 'Wajah yang menyambut kita setelah gerbangnya terbuka.',
      alt: 'Dia berdiri menghadap langit, blazer putih berenda, kacamata bertengger di rambut putihnya.',
      src: 'images/foto/02-dia.jpg',
      thumb: 'images/hero/dia-916.jpg',
      w: 941, h: 1617, kb: 223,
      tall: true,
      objectPosition: '50% 12%',
      scene: 'FINALE'
    }
  ];

  var byId = {};
  for (var i = 0; i < FOTOS.length; i++) byId[FOTOS[i].id] = FOTOS[i];

  /* --- urutan kurasi (bukan urutan unggah) untuk dinding arsip --------- */
  var ROWS = [
    { dir: 'fwd', ids: ['gerbang', 'sakura', 'kota'] },
    { dir: 'rev', ids: ['koin', 'arsip', 'dia'] }
  ];

  return {
    /** semua foto, urutan film */
    list: function () { return FOTOS.slice(); },
    /** satu foto berdasarkan id */
    get: function (id) { return byId[id] ? Object.assign({}, byId[id]) : null; },
    /** url unduhan resolusi penuh */
    downloadUrl: function (idOrObj) {
      var p = typeof idOrObj === 'string' ? byId[idOrObj] : idOrObj;
      return p ? p.src : '';
    },
    /** nama berkas unduhan yang rapi */
    downloadName: function (idOrObj) {
      var p = typeof idOrObj === 'string' ? byId[idOrObj] : idOrObj;
      return p ? p.idx + '-' + p.id + '.jpg' : 'foto.jpg';
    },
    /** baris dinding arsip */
    rows: function () { return ROWS.map(function (r) { return { dir: r.dir, items: r.ids.map(function (i) { return Object.assign({}, byId[i]); }) }; }); },
    /** tetangga untuk navigasi viewer */
    neighbour: function (id, step) {
      var i = FOTOS.findIndex(function (p) { return p.id === id; });
      if (i < 0) return FOTOS[0];
      var n = (i + step + FOTOS.length) % FOTOS.length;
      return FOTOS[n];
    },
    /** jumlah foto */
    count: function () { return FOTOS.length; }
  };
})();
