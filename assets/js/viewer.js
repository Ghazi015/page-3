/* ==========================================================================
   assets/js/viewer.js — DINDING ARSIP + PENAMPIL FOTO + UNDUHAN
   Tanggung jawab: bangun kartu film-strip, buka/tutup penampil, navigasi
   sekolah, unduhan satu per satu maupun borongan, serta keadaan gagal.
   Dipanggil oleh scenes.js hanya lewat window.FILMVIEWER.
   ========================================================================== */
window.FILMVIEWER = (function () {
  'use strict';

  var VIEWER = document.getElementById('viewer');
  var IMG = document.getElementById('viewerImg');
  var COUNT = document.getElementById('viewerCount');
  var TITLE = document.getElementById('viewerTitle');
  var CAP = document.getElementById('viewerCap');
  var DIM = document.getElementById('viewerDim');
  var DL = document.getElementById('viewerDl');
  var BLADES = [document.querySelector('.viewer__blade--t'), document.querySelector('.viewer__blade--b')];
  var TOAST = null;

  var current = null;
  var lastFocus = null;
  var isOpen = false;
  var on = !!window.gsap;

  /* ---------------- toast (pesan singkat) ---------------- */
  function toast(msg, ms) {
    if (!TOAST) {
      TOAST = document.createElement('p');
      TOAST.className = 'toast';
      TOAST.setAttribute('role', 'status');
      document.body.appendChild(TOAST);
    }
    TOAST.textContent = msg;
    TOAST.classList.add('is-on');
    clearTimeout(TOAST._t);
    TOAST._t = setTimeout(function () { TOAST.classList.remove('is-on'); }, ms || 2200);
  }

  /* ---------------- dinding arsip (film-strip) ---------------- */
  function buildCard(p) {
    var li = document.createElement('li');
    li.className = 'card' + (p.tall ? ' card--tall' : '');
    li.dataset.id = p.id;

    var img = document.createElement('img');
    img.className = 'card__img';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = p.alt;
    img.width = p.w;
    img.height = p.h;
    img.src = p.thumb;
    if (p.objectPosition) img.style.objectPosition = p.objectPosition;
    img.addEventListener('error', function () {
      li.classList.add('card--broken');
      li.insertAdjacentHTML('beforeend', '<p class="card__err">Bingkai ini gagal dimuat.<br>Coba muat ulang halaman.</p>');
    });

    var open = document.createElement('button');
    open.type = 'button';
    open.className = 'card__open';
    open.setAttribute('aria-label', 'Buka bingkai ' + p.idx + ' — ' + p.title);
    open.addEventListener('click', function () { api.open(p.id); });

    var dl = document.createElement('a');
    dl.className = 'card__dl';
    dl.href = window.Gallery.downloadUrl(p);
    dl.setAttribute('download', window.Gallery.downloadName(p));
    dl.textContent = 'Unduh';
    dl.setAttribute('aria-label', 'Unduh ' + p.title);

    var meta = document.createElement('div');
    meta.className = 'card__meta';
    meta.innerHTML = '<span class="card__idx">' + p.idx + '</span><span class="card__name">' + p.title + '</span>';

    li.append(img, open, dl, meta);
    return li;
  }

  function buildWall() {
    var wall = document.getElementById('wall');
    if (!wall) return;
    var rows = window.Gallery.rows();
    var hosts = [document.getElementById('stripA'), document.getElementById('stripB')];
    var total = window.Gallery.count();
    if (!total) {
      wall.insertAdjacentHTML('afterend', '<p class="wall__hint">Arsip masih kosong. Taruh foto di <code>images/foto/</code> lalu sunting <code>data/gallery.js</code>.</p>');
      return;
    }
    rows.forEach(function (row, r) {
      var host = hosts[r];
      if (!host) return;
      /* 3 salinan supaya marquee mulus di layar lebar */
      for (var copy = 0; copy < 3; copy++) {
        row.items.forEach(function (p) {
          var li = buildCard(p);
          if (copy > 0) li.setAttribute('aria-hidden', 'true');
          li.querySelectorAll('button,a').forEach(function (el) { if (copy > 0) el.tabIndex = -1; });
          host.appendChild(li);
        });
      }
      host.dataset.dir = row.dir;
    });
  }

  /* ---------------- unduhan ---------------- */
  function downloadAll() {
    var items = window.Gallery.list();
    var i = 0;
    (function next() {
      if (i >= items.length) { toast('Semua ' + items.length + ' foto dikirim ke folder unduhan', 3200); return; }
      var p = items[i++];
      var a = document.createElement('a');
      a.href = window.Gallery.downloadUrl(p);
      a.download = window.Gallery.downloadName(p);
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('Mengunduh ' + p.idx + ' · ' + (i) + '/' + items.length, 1400);
      setTimeout(next, 700);
    })();
  }

  /* ---------------- penampil ---------------- */
  function paint(id) {
    var p = window.Gallery.get(id);
    if (!p) return;
    current = p;
    COUNT.textContent = p.idx + ' / 0' + window.Gallery.count();
    TITLE.textContent = p.title;
    CAP.textContent = p.caption;
    DIM.textContent = p.w + ' × ' + p.h + ' px · tidak dikompres ulang';
    DL.href = window.Gallery.downloadUrl(p);
    DL.setAttribute('download', window.Gallery.downloadName(p));
    IMG.alt = p.alt;

    var revealed = false;
    function reveal() { if (revealed) return; revealed = true; IMG.style.aspectRatio = p.w + ' / ' + p.h; IMG.classList.add('is-loaded'); }
    IMG.classList.remove('is-loaded');
    IMG.onload = reveal;
    IMG.onerror = function () {
      IMG.classList.remove('is-loaded');
      IMG.alt = 'Gagal memuat ' + p.title;
      toast('Foto gagal dimuat. Tetap bisa diunduh lewat tombol Unduh.', 3600);
    };
    IMG.src = p.src;
    if (IMG.complete && IMG.naturalWidth) reveal();

    /* pramuat tetangga supaya navigasi terasa mulus */
    [1, -1].forEach(function (s) {
      var n = window.Gallery.neighbour(p.id, s);
      var pre = new Image();
      pre.src = n.src;
    });
  }

  function bladeClose() {
    if (!on) return;
    window.gsap.set(BLADES[0], { transformOrigin: '50% 0' });
    window.gsap.set(BLADES[1], { transformOrigin: '50% 100%' });
    window.gsap.to(BLADES, { scaleY: 1, duration: 0.42, ease: 'power2.inOut' });
  }
  function bladeOpen() {
    if (!on) return;
    window.gsap.set(BLADES[0], { transformOrigin: '50% 100%' });
    window.gsap.set(BLADES[1], { transformOrigin: '50% 0' });
    window.gsap.to(BLADES, { scaleY: 0, duration: 0.85, ease: 'power3.inOut' });
  }

  function open(id) {
    if (!window.Gallery.get(id)) return;
    lastFocus = document.activeElement;
    paint(id);
    isOpen = true;
    VIEWER.hidden = false;
    VIEWER.classList.add('is-shown');
    document.body.classList.add('is-locked');
    bladeOpen();
    if (on) window.gsap.fromTo('.viewer__ui', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.25 });
    var close = document.getElementById('viewerClose');
    setTimeout(function () { close.focus(); }, 60);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    document.body.classList.remove('is-locked');
    bladeClose();
    var after = on ? 0.45 : 0;
    setTimeout(function () {
      VIEWER.hidden = true;
      VIEWER.classList.remove('is-shown');
      IMG.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, after * 1000);
  }

  function step(dir) {
    if (!current) return;
    var n = window.Gallery.neighbour(current.id, dir);
    paint(n.id);
  }

  /* ---------------- pemasangan ---------------- */
  function bind() {
    buildWall();
    document.getElementById('viewerClose').addEventListener('click', close);
    document.getElementById('viewerPrev').addEventListener('click', function () { step(-1); });
    document.getElementById('viewerNext').addEventListener('click', function () { step(1); });
    VIEWER.addEventListener('click', function (e) { if (e.target === VIEWER || e.target.classList.contains('viewer__stage')) close(); });
    document.getElementById('dlAllBtn').addEventListener('click', downloadAll);
    var finaleOpen = document.getElementById('finaleOpen');
    if (finaleOpen) finaleOpen.addEventListener('click', function () { open('dia'); });
    var finaleDl = document.getElementById('finaleDl');
    if (finaleDl) finaleDl.addEventListener('click', function () { toast('Mengunduh 02 · Dia', 1600); });

    /* geser jari untuk pindah bingkai */
    var x0 = null, y0 = null;
    VIEWER.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    VIEWER.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });

    /* papan tombol */
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowRight') { step(1); }
      else if (e.key === 'ArrowLeft') { step(-1); }
      else if (e.key === 'd' || e.key === 'D') { DL.click(); }
      else if (e.key === 'Tab') {
        /* jaga fokus di dalam penampil */
        var f = VIEWER.querySelectorAll('button,a[href]');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  var api = { bind: bind, open: open, close: close, step: step, isOpen: function () { return isOpen; }, downloadAll: downloadAll, toast: toast };
  return api;
})();
