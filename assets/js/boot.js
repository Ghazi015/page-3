/* ==========================================================================
   assets/js/boot.js — PEMUAT & PEMBUKA
   Tugas: buka kelas .js, siapkan berkas gambar penting, jalankan pemuat,
   sambungkan tombol "Buka filmnya" / "Lewati pembuka", dan pasang semua
   mesin (dinding arsip + sinematik). Sengaja ditaruh paling akhir.
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  html.classList.remove('no-js');
  html.classList.add('js');

  var boot = document.getElementById('boot');
  var bar = document.getElementById('bootBar');
  var status = document.getElementById('bootStatus');
  var titleEl = document.getElementById('bootTitle');
  var enterBtn = document.getElementById('bootEnter');
  var skipBtn = document.getElementById('bootSkip');
  var MIN_MS = 1500;
  var MAX_MS = 9000;
  var t0 = performance.now();
  var ready = false;
  var gone = false;

  var CRITICAL = [
    'images/hero/gate.jpg',
    'images/hero/sky-soft.jpg',
    'images/hero/poster-45.jpg',
    'images/hero/sakura-219.jpg',
    'images/hero/dia-916.jpg',
    'images/hero/kota-219.jpg'
  ];

  var STEPS = [
    [0.00, 'Menyiapkan bingkai pertama…'],
    [0.22, 'Membuka awan…'],
    [0.48, 'Menurunkan drone…'],
    [0.72, 'Mencari gerbangnya…'],
    [0.92, 'Siap. Tekan “Buka filmnya”.']
  ];

  /* ---------------------------------------------------------------------
     Kunci gulir selama pemuat masih menutup layar
     --------------------------------------------------------------------- */
  document.body.classList.add('is-locked');

  /* ---------------------------------------------------------------------
     Muat gambar penting dengan decode() bila ada
     --------------------------------------------------------------------- */
  var done = 0;
  function mark() {
    done++;
    setProgress(done / CRITICAL.length);
  }
  function loadOne(src) {
    var img = new Image();
    img.onload = mark;
    img.onerror = mark;                 /* gagal pun jangan menahan penonton */
    img.src = src;
    if (img.decode) img.decode().then(mark, function () {});
  }

  /* ---------------------------------------------------------------------
     Bilah & kalimat status
     --------------------------------------------------------------------- */
  function setProgress(p, force) {
    p = Math.max(0, Math.min(1, p));
    if (!force) p = Math.min(p, 0.94);   /* 100% hanya setelah benar-benar siap */
    if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    if (status) {
      var label = STEPS[0][1];
      for (var i = 0; i < STEPS.length; i++) if (p >= STEPS[i][0]) label = STEPS[i][1];
      if (status.textContent !== label) status.textContent = label;
    }
  }

  function settle() {
    if (ready) return;
    ready = true;
    setProgress(1, true);
    if (status) status.textContent = 'Siap. Tekan “Buka filmnya”.';
    if (titleEl) titleEl.textContent = 'Siap';
    if (boot) boot.classList.add('is-ready');
    if (enterBtn) enterBtn.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------------
     Buka / lewati
     --------------------------------------------------------------------- */
  function fadeBoot() {
    if (!boot || gone) return;
    gone = true;
    boot.classList.add('is-out');
    setTimeout(function () { boot.style.display = 'none'; }, 950);
  }

  function openFilm() {
    fadeBoot();
    window.FILMSCENES.enter();
    var main = document.getElementById('bab-1');
    if (main) { main.setAttribute('tabindex', '-1'); setTimeout(function () { main.focus({ preventScroll: true }); }, 800); }
  }

  function skip() {
    fadeBoot();
    window.FILMSCENES.skipIntro();
  }

  /* ---------------------------------------------------------------------
     Pasang
     --------------------------------------------------------------------- */
  function start() {
    /* antrian film + dinding arsip dulu (biar marquee dapat wadahnya) */
    if (window.FILMVIEWER && window.FILMVIEWER.bind) window.FILMVIEWER.bind();
    if (window.FILMSCENES && window.FILMSCENES.init) window.FILMSCENES.init();

    setProgress(0);
    CRITICAL.forEach(loadOne);

    /* animasi bilah selama menunggu */
    var t = setInterval(function () {
      var p = done / CRITICAL.length;
      var elapsed = performance.now() - t0;
      var fake = Math.min(0.9, elapsed / 4200);
      setProgress(Math.max(p, fake));
      if (ready || elapsed > MAX_MS && done > 0) { clearInterval(t); }
    }, 120);

    /* siap setelah gambar inti termuat ATAU batas waktu habis */
    var check = setInterval(function () {
      var elapsed = performance.now() - t0;
      if ((done >= CRITICAL.length && elapsed >= MIN_MS) || elapsed > MAX_MS) {
        clearInterval(check);
        settle();
      }
    }, 100);

    if (enterBtn) enterBtn.addEventListener('click', openFilm);
    if (skipBtn) skipBtn.addEventListener('click', skip);

    document.addEventListener('keydown', function (e) {
      if (gone) return;
      if (e.key === 'Escape') skip();
      if ((e.key === 'Enter' || e.key === ' ') && ready) { e.preventDefault(); openFilm(); }
    });

    /* kalau ada tautan langsung (#galeri, #bab-3, …) lewati pembuka */
    if (location.hash && document.querySelector(location.hash)) {
      fadeBoot();
      window.FILMSCENES.enter();
      setTimeout(function () {
        var el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 60);
    }

    /* keadaan gagal: beri tahu, jangan biarkan layar bisu */
    window.addEventListener('error', function (ev) {
      var t = ev.target;
      if (t && t.tagName === 'IMG') {
        if (window.FILMVIEWER && window.FILMVIEWER.toast) window.FILMVIEWER.toast('Ada foto yang gagal dimuat', 2600);
      }
    }, true);

    /* tanpa GSAP: beri tahu penonton dengan jujur, film tetap bisa dinikmati */
    if (!window.gsap) {
      var banner = document.createElement('p');
      banner.className = 'toast is-on';
      banner.setAttribute('role', 'status');
      banner.textContent = 'Mode sederhana: gerak kamera dilewati';
      document.body.appendChild(banner);
      setTimeout(function () { banner.classList.remove('is-on'); }, 4200);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
