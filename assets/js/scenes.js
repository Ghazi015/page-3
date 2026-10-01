/* ==========================================================================
   assets/js/scenes.js — MESIN SINEMATIK
   1 pembuka (awan → drone → gerbang) · 2 babak · 3 dinding arsip
   4 finale · 5 antrian film (video wall) · 6 suara · 7 papan tombol
   Tidak ada pin GSAP: semua adegan memakai position:sticky, jadi tata letak
   tetap utuh di iOS/Android dan tidak ada pin-spacer yang bikin lompat.
   ========================================================================== */
window.FILMSCENES = (function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;  /* aksesibilitas */
  var TOUCH = window.matchMedia('(hover: none)').matches;                      /* layar sentuh */
  var MOTION = !REDUCE && !!(window.gsap && window.ScrollTrigger);             /* gerak penuh */
  var HEAVY = !TOUCH && !REDUCE;                                               /* boleh pakai blur/filter */

  document.documentElement.dataset.mode = (REDUCE || TOUCH) ? 'lite' : 'full';
  document.documentElement.dataset.heavy = HEAVY ? 'yes' : 'no';

  var entered = false;
  var coverOn = false;
  var IDLE_MS = 26000;
  var lastAct = Date.now();
  var liveTimer = null;
  var sound = { on: false, ctx: null, master: null, lp: null };

  /* ======================================================================
     0 · ALAT BANTU
     ====================================================================== */
  function smoothScrollTo(y, dur) {
    if (REDUCE) { window.scrollTo(0, y); return; }
    var y0 = window.scrollY, t0 = performance.now();
    dur = Math.min(Math.max(Math.abs(y - y0) / 2.4, 480), dur || 1100);
    (function frame(t) {
      var k = Math.min(1, (t - t0) / dur);
      var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      window.scrollTo(0, y0 + (y - y0) * e);
      if (k < 1) requestAnimationFrame(frame);
    })(performance.now());
  }
  function smoothScrollBy(dy) { smoothScrollTo(window.scrollY + dy); }
  function toast(msg, ms) { if (window.FILMVIEWER) window.FILMVIEWER.toast(msg, ms); }

  /* ======================================================================
     1 · HUD & TITIK BABAK
     ====================================================================== */
  var SECTIONS = [
    ['#bab-1', 'BABAK I · GERBANG'],
    ['#bab-2', 'BABAK II · SAKURA'],
    ['#bab-3', 'BABAK III · KOTA'],
    ['#bab-4', 'BABAK IV · KOIN'],
    ['#bab-5', 'BABAK V · ARSIP'],
    ['#galeri', 'ARSIP · LEMARI'],
    ['#finale', 'FINALE · DIA'],
    ['#credits', 'SELESAI']
  ];

  function buildHUD() {
    var now = $('#hudNow');
    SECTIONS.forEach(function (pair) {
      var el = $(pair[0]);
      if (!el || !MOTION) return;
      window.ScrollTrigger.create({
        trigger: el, start: 'top 58%', end: 'bottom 42%',
        onToggle: function (self) {
          if (!self.isActive) return;
          now.textContent = pair[1];
          $$('.dots a').forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === pair[0]);
          });
        }
      });
    });
    if (!MOTION) {
      /* tanpa GSAP, HUD tetap hidup lewat IntersectionObserver sederhana */
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (rows) {
          rows.forEach(function (r) {
            if (!r.isIntersecting) return;
            for (var i = 0; i < SECTIONS.length; i++) {
              if (SECTIONS[i][0] === '#' + r.target.id) now.textContent = SECTIONS[i][1];
            }
          });
        }, { rootMargin: '-45% 0px -50% 0px' });
        SECTIONS.forEach(function (p) { var el = $(p[0]); if (el) io.observe(el); });
      }
    }
  }

  function showHUD(v) {
    $('#hud').hidden = !v;
    $('#dots').hidden = !v || window.innerWidth < 821;
  }

  /* ======================================================================
     2 · PEMBUKA: awan → drone → gerbang terbuka
     ====================================================================== */
  function buildFilm() {
    var film = $('#film');
    var cam = $('.film__cam');
    var plate = $('.film__plate');
    var plateImg = $('#plateImg');
    var world = $('.film__world');
    var clouds = $$('.cloud');
    var doors = $$('.gate__door');
    var interior = $('.gate__interior');
    var spill = $('.gate__spill');
    var seam = $('.gate__seam');
    var flash = $('.film__flash');
    var mark = $('.gate__mark');
    var label = $('.gate__label');
    var bars = $$('.bar');
    var caps = $$('.fcap');
    var cue = $('#scrollCue');

    var gsap = window.gsap;

    /* keadaan akhir take: dipakai untuk mode tanpa gerak */    function stateOpen() {
      gsap.set(plate, { autoAlpha: 1 });
      gsap.set(plateImg, { scale: 1.02, filter: 'none' });
      gsap.set(world, { autoAlpha: 0 });
      gsap.set(doors, { scaleY: 0.03, yPercent: -3 });
      gsap.set([interior, spill], { autoAlpha: 0.85 });
      gsap.set(bars, { scaleY: 1 });
      gsap.set(cue, { autoAlpha: 1 });
    }

    if (!MOTION) {
      if (gsap) { gsap.set([plate, world, mark, label, seam, interior, spill, flash], { autoAlpha: 0 }); stateOpen(); }
      else { if (plate) plate.style.opacity = 1; }
      /* tetap tandai masuk setelah sepertiga take */
      var f2 = $('#film');
      var onScroll2 = function () {
        var r = f2.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
        if (p > 0.55) { showHUD(true); }
        if (p >= 0.985) showCover(true, 'end');
      };
      window.addEventListener('scroll', onScroll2, { passive: true });
      onScroll2();
      return;
    }

    gsap.set([plate, world, mark, label, seam, interior, spill, flash], { autoAlpha: 0 });

    /* dipanggil tiap frame oleh ScrollTrigger */
    var onProgress = function (p) {
      if (p > 0.92) showHUD(true);
      if (p >= 0.985) showCover(true, 'end');
      if (sound.on && sound.lp && sound.ctx) {
        sound.lp.frequency.setTargetAtTime(240 + 900 * (1 - p), sound.ctx.currentTime, 0.25);
      }
    };

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: film, start: 'top top', end: 'bottom bottom', scrub: REDUCE ? true : 0.7,
        onUpdate: function (st) { onProgress(st.progress); }
      }
    });

    /* --- awan mengalir sepanjang take --- */
    clouds.forEach(function (c, i) {
      tl.fromTo(c,
        { xPercent: (i % 2 ? 4 : -5), yPercent: (i % 2 ? -3 : 5), scale: 0.94 },
        { xPercent: (i % 2 ? -6 : 7), yPercent: (i % 2 ? 8 : -5), scale: 1.12, duration: 0.62 }, 0);
    });

    /* --- maket kawat: digambar, lalu didekati --- */
    tl.to(world, { autoAlpha: 1, duration: 0.03 }, 0);
    tl.fromTo('.house .ln', { opacity: 0 }, { opacity: 1, duration: 0.06, stagger: { each: 0.006 } }, 0.01);
    tl.fromTo('.house__grid path', { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: { each: 0.008 } }, 0.02);
    tl.fromTo(world,
      { rotateX: HEAVY ? 30 : 16, scale: 0.5, yPercent: -6 },
      { rotateX: 0, scale: 1, yPercent: 0, duration: 0.34, ease: 'power1.inOut' }, 0.10);

    /* --- petunjuk geser --- */
    tl.to(cue, { autoAlpha: 1, duration: 0.03 }, 0.02);
    tl.to(cue, { autoAlpha: 0, duration: 0.04 }, 0.12);

    /* --- drone turun: gerbang jadi nyata --- */
    tl.to(plate, { autoAlpha: 1, duration: 0.14 }, 0.30);
    tl.fromTo(plateImg,
      HEAVY ? { scale: 1.34, yPercent: 4, filter: 'blur(26px) brightness(.9)' }
            : { scale: 1.22, yPercent: 4 },
      HEAVY ? { scale: 1.02, yPercent: 0, filter: 'blur(0px) brightness(1)', duration: 0.42, ease: 'power2.out' }
            : { scale: 1.02, yPercent: 0, duration: 0.42, ease: 'power2.out' }, 0.30);
    tl.to(clouds, { autoAlpha: 0.22, duration: 0.28 }, 0.40);
    tl.to(world, { autoAlpha: 0, duration: 0.10 }, 0.42);

    /* --- bar hitam sinematik --- */
    tl.to(bars, { scaleY: 1, duration: 0.10, ease: 'power2.out' }, 0.46);

    /* --- kapten --- */
    caps.forEach(function (c, i) {
      var at = 0.53 + i * 0.075;
      tl.to(c, { autoAlpha: 1, duration: 0.05, ease: 'power2.out' }, at);
      tl.to(c, { autoAlpha: 0, duration: 0.04, ease: 'power2.in' }, at + 0.055);
    });

    /* --- penanda & label pintu --- */
    tl.fromTo(mark, { scale: 0.62 }, { scale: 1, duration: 0.06 }, 0.58);
    tl.to(mark, { autoAlpha: 1, duration: 0.05, ease: 'power3.out' }, 0.58);
    tl.to(mark, { autoAlpha: 0, duration: 0.04 }, 0.70);
    tl.to(label, { autoAlpha: 1, duration: 0.04 }, 0.72);

    /* --- drone maju menembus pintu --- */
    tl.to(cam, { scale: 4.8, duration: 0.24, ease: 'power2.in' }, 0.72);
    tl.to(seam, { autoAlpha: 0.95, duration: 0.03 }, 0.775);
    tl.to(seam, { autoAlpha: 0, duration: 0.04 }, 0.815);
    tl.to(doors, { scaleY: 0.03, yPercent: -3, duration: 0.12, ease: 'power2.inOut' }, 0.78);
    tl.to(interior, { autoAlpha: 0.92, duration: 0.16, ease: 'power1.in' }, 0.76);
    tl.to(spill, { autoAlpha: 1, duration: 0.14 }, 0.78);
    if (HEAVY) tl.to(cam, { filter: 'brightness(1.3) saturate(1.08)', duration: 0.10 }, 0.86);

    /* --- kedipan cahaya: gerbang terbuka, film dimulai --- */
    tl.to(flash, { autoAlpha: 0.92, duration: 0.04 }, 0.90);
    tl.to(flash, { autoAlpha: 0, duration: 0.06 }, 0.94);
    tl.to([caps, label, cue], { autoAlpha: 0, duration: 0.03 }, 0.96);
  }

  /* ======================================================================
     3 · BABAK
     ====================================================================== */
  function revealText(root, opts) {
    if (!MOTION) return;
    var o = opts || {};
    window.gsap.from($$(o.selector || '.chap__text > *, .finale__text > *', root), {
      y: REDUCE ? 0 : (o.y === undefined ? 30 : o.y),
      autoAlpha: 0, duration: REDUCE ? 0.4 : 1.05,
      stagger: REDUCE ? 0 : 0.11, ease: 'power3.out',
      scrollTrigger: { trigger: root, start: o.start || 'top 66%', once: true }
    });
  }

  function buildChapters() {
    if (!MOTION) return;
    var gsap = window.gsap;
    var scrub = REDUCE ? true : 1;
    var LITE = REDUCE || TOUCH;

    $$('.chap').forEach(function (chap) {
      var id = chap.id;

      if (!LITE) {
        var wide = $('.plate--wide img', chap);
        if (wide) {
          gsap.fromTo(wide, { scale: 1.14 }, { scale: 1.02, ease: 'none',
            scrollTrigger: { trigger: chap, start: 'top bottom', end: 'bottom top', scrub: scrub } });
        }
      }
      revealText(chap, { start: 'top 62%' });
      if (LITE) return;

      var tl = gsap.timeline({ scrollTrigger: { trigger: chap, start: 'top top', end: 'bottom bottom', scrub: scrub } });

      if (id === 'bab-1') {
        /* BABAK I — di dalam: foto dibalik supaya tidak terbaca sebagai ulangan,
           lalu siluet dia muncul sebentar seperti bayangan yang menunggu. */
        var silh = $('.plate--silh', chap);
        tl.fromTo($('.plate--amb img', chap), { scale: 1.06 }, { scale: 1.24, ease: 'none', duration: 1 }, 0);
        tl.fromTo(silh, { autoAlpha: 0 }, { autoAlpha: 0.92, duration: 0.35, ease: 'power1.inOut' }, 0.18)
          .to(silh, { autoAlpha: 0.28, duration: 0.3 }, 0.62);
      }

      if (id === 'bab-2') {
        /* BABAK II — detail merpati masuk seperti foto yang dipasang di meja kerja */
        var inset = $('.plate--inset', chap);
        tl.fromTo(inset, { autoAlpha: 0, scale: 1.14, rotate: -1.4 },
          { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.32, ease: 'power2.out' }, 0.16)
          .to(inset, { autoAlpha: 0, duration: 0.22 }, 0.78);
      }

      if (id === 'bab-3') {
        /* BABAK III — kamera mendorong masuk ke kota */
        tl.fromTo($('.plate--wide img', chap), { scale: 1.0, yPercent: 1 },
          { scale: 1.1, yPercent: -1.5, ease: 'none', duration: 1 }, 0);
      }

      if (id === 'bab-4') {
        /* BABAK IV — dari bingkai lebar, kamera masuk ke wajahnya */
        var close = $('.plate--close', chap);
        var detail = $('.plate--detail', chap);
        tl.fromTo(close, { autoAlpha: 0, scale: 1.16 },
          { autoAlpha: 1, scale: 1.0, duration: 0.34, ease: 'power2.inOut' }, 0.30)
          .to($('.plate--wide', chap), { autoAlpha: 0, scale: 1.1, duration: 0.3, ease: 'power1.in' }, 0.30)
          .fromTo(detail, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.58)
          .to(detail, { autoAlpha: 0, duration: 0.2 }, 0.84)
          .to(close, { scale: 1.06, ease: 'none', duration: 0.3 }, 0.7);
      }

      if (id === 'bab-5') {
        /* BABAK V — kamera mundur dari buku bercahaya, siap ke finale */
        tl.fromTo($('.plate--wide img', chap), { scale: 1.20, filter: 'brightness(.72)' },
          { scale: 1.0, filter: 'brightness(1)', duration: 0.6, ease: 'power2.out' }, 0.1);
      }
    });
  }

  /* ======================================================================
     4 · DINDING ARSIP (film-strip)
     ====================================================================== */
  function buildWall() {
    var rows = $$('.wall__row');
    if (!MOTION || REDUCE || TOUCH) {
      rows.forEach(function (r) { r.classList.add('wall__row--swipe'); });
      return;
    }
    var dist = 100 / 3;   /* tiga salinan kartu → geser satu salinan */
    var tweens = [
      window.gsap.to('#stripA', { xPercent: -dist, duration: 130, ease: 'none', repeat: -1 }),
      window.gsap.fromTo('#stripB', { xPercent: -dist }, { xPercent: 0, duration: 130, ease: 'none', repeat: -1 })
    ];
    rows.forEach(function (row, i) {
      var t = tweens[i];
      if (!t) return;
      row.addEventListener('mouseenter', function () { t.timeScale(0.18); });
      row.addEventListener('mouseleave', function () { t.timeScale(1); });
      row.addEventListener('touchstart', function () {
        t.timeScale(0); clearTimeout(row._t);
        row._t = setTimeout(function () { t.timeScale(1); }, 3200);
      }, { passive: true });
      window.gsap.from(row, {
        xPercent: i ? 7 : -7, autoAlpha: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 90%', once: true }
      });
    });
  }

  /* ======================================================================
     5 · FINALE
     ====================================================================== */
  function buildFinale() {
    var fin = $('#finale');
    if (!fin) return;
    revealText(fin, { selector: '.finale__text > *', start: 'top 72%' });
    if (!MOTION) return;
    var gsap = window.gsap;
    var tl = gsap.timeline({
      scrollTrigger: { trigger: fin, start: 'top bottom', end: 'bottom bottom', scrub: REDUCE ? true : 1 }
    });
    tl.fromTo('.finale__plate img', { scale: 1.07, yPercent: 2 },
      { scale: 1, yPercent: 0, duration: 0.7, ease: 'power2.out' }, 0);
    /* cahaya gerbang di pembuka menyala lagi di belakang kepalanya */
    tl.fromTo('.finale__glow', { autoAlpha: 0, scale: 0.7 },
      { autoAlpha: 0.9, scale: 1.15, duration: 0.6, ease: 'power2.out' }, 0.12);
    tl.fromTo('.finale__halo', { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 0.75, scale: 1.05, duration: 0.6, ease: 'power2.out' }, 0.22);
    tl.to('.finale__halo', { autoAlpha: 0, duration: 0.3 }, 0.74);
  }

  /* ======================================================================
     6 · ANTRIAN FILM (video wall) — momen jeda, tanpa gerak
     ====================================================================== */
  function showCover(v, reason) {
    if (window.FILMVIEWER && window.FILMVIEWER.isOpen()) v = false;
    if (v === coverOn) { if (v && reason === 'end') $('#coverBar').style.width = '100%'; return; }
    coverOn = v;
    var cover = $('#cover');
    cover.hidden = !v;
    void cover.offsetWidth;                     /* reflow supaya transisi opacity jalan */
    cover.classList.toggle('is-on', v);
    if (v) {
      $('#coverBar').style.width = reason === 'end' ? '100%' : '38%';
      document.body.classList.add('cover-on');
    } else {
      document.body.classList.remove('cover-on');
    }
  }

  function buildCover() {
    var grid = $('#coverGrid');
    var list = window.Gallery.list();
    var cells = [];

    for (var i = 0; i < 8; i++) {
      var li = document.createElement('li');
      var ulang = i >= list.length;                       /* saluran 07–08: siaran ulang */
      var p = list[ulang ? i - list.length : i];
      if (p) {
        li.innerHTML =
          '<img src="' + p.thumb + '" alt="" loading="lazy" decoding="async"' +
          (p.objectPosition ? ' style="object-position:' + p.objectPosition + '"' : '') + '>' +
          '<span class="cover__cap"><span>SALURAN ' + (ulang ? '0' + (i + 1) : p.idx) + '</span>' +
          '<span>' + (ulang ? 'siaran ulang · ' + p.scene : p.scene) + '</span></span>';
      } else {
        li.className = 'is-empty';
        li.innerHTML = '<span>Saluran 0' + (i + 1) + ' · kosong</span>';
      }
      grid.appendChild(li);
      cells.push(li);
    }

    var live = 0;
    function setLive(n) {
      cells.forEach(function (c, k) { c.classList.toggle('is-live', k === n); });
      live = n;
    }
    function cycle() {
      setLive((live + 1) % 6);
      clearInterval(liveTimer);
      liveTimer = setInterval(cycle, 4600);
    }
    setLive(0);

    document.addEventListener('keydown', function (e) {
      if (!coverOn) return;
      var k = e.key.toLowerCase();
      if (k === 'p' || k === 't') { cycle(); }
      else if (e.key === 'ArrowRight') { showCover(false, 'user'); smoothScrollBy(window.innerHeight * 0.9); }
      else if (e.key === 'Escape') { showCover(false, 'user'); goFinale(); }
    });

    setInterval(function () { if (coverOn) setLive(Math.floor(Math.random() * 6)); }, 12000);
    return { setLive: setLive };
  }

  /* ======================================================================
     7 · SUARA (dibuat di browser, tanpa berkas audio)
     ====================================================================== */
  function initAudio() {
    if (sound.ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    var ctx = new AC();
    var master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    var d1 = ctx.createOscillator(); d1.type = 'sine'; d1.frequency.value = 55;
    var d2 = ctx.createOscillator(); d2.type = 'triangle'; d2.frequency.value = 82.5;
    var g2 = ctx.createGain(); g2.gain.value = 0.05;
    var lfo = ctx.createOscillator(); lfo.frequency.value = 0.06;
    var lfoG = ctx.createGain(); lfoG.gain.value = 1.6;
    lfo.connect(lfoG); lfoG.connect(d1.frequency);

    var len = 4 * ctx.sampleRate;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.1;
    }
    var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; lp.Q.value = 0.5;
    var ng = ctx.createGain(); ng.gain.value = 0.55;

    d1.connect(master); d2.connect(g2); g2.connect(master);
    src.connect(lp); lp.connect(ng); ng.connect(master);
    d1.start(); d2.start(); lfo.start(); src.start();

    sound.ctx = ctx; sound.master = master; sound.lp = lp;
  }

  function setSound(v) {
    initAudio();
    var btn = $('#soundBtn');
    if (!sound.ctx) {
      toast('Browser ini belum mendukung suara', 2400);
      btn.textContent = 'Suara: tidak tersedia';
      btn.disabled = true;
      return false;
    }
    if (sound.ctx.state === 'suspended') sound.ctx.resume();
    sound.on = v;
    if (window.gsap) gsap.to(sound.master.gain, { value: v ? 0.17 : 0, duration: 1.4, ease: 'power2.out' });
    else sound.master.gain.value = v ? 0.17 : 0;
    btn.textContent = v ? 'Suara: hidup' : 'Suara: mati';
    btn.setAttribute('aria-pressed', v ? 'true' : 'false');
    return true;
  }

  /* ======================================================================
     8 · ALUR: masuk, lewati, finale, putar ulang
     ====================================================================== */
  function sectionTop(sel, bias) {
    var el = $(sel);
    if (!el) return 0;
    var y = el.getBoundingClientRect().top + window.scrollY + (bias || 0);
    return Math.max(0, y);
  }
  function enter() {
    entered = true;
    showHUD(true);
    document.body.classList.remove('is-locked');
    if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 260);
  }
  function skipIntro() { enter(); smoothScrollTo(sectionTop('#bab-1'), 1600); }
  function goFinale() { enter(); smoothScrollTo(sectionTop('#finale'), 1800); }
  function replay() { enter(); smoothScrollTo(0, 2400); }

  /* ======================================================================
     9 · PAPAN TOMBOL GLOBAL
     ====================================================================== */
  function nearFilm() {
    var r = $('#film').getBoundingClientRect();
    return r.bottom > window.innerHeight * 0.6;
  }

  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (window.FILMVIEWER && window.FILMVIEWER.isOpen()) return;
      if (coverOn) return;                                 /* antrian film punya tombolnya sendiri */

      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); goFinale(); return; }
      if (e.shiftKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); replay(); return; }

      /* selagi take pembuka berjalan: spasi/kanan = maju satu layar */
      if (entered && nearFilm() && (e.key === ' ' || e.key === 'PageDown' || e.key === 'ArrowRight')) {
        e.preventDefault();
        smoothScrollBy(window.innerHeight * 0.85);
      }
    });

    ['wheel', 'touchstart', 'scroll', 'keydown', 'pointerdown'].forEach(function (ev) {
      window.addEventListener(ev, function () {
        lastAct = Date.now();
        if (coverOn) showCover(false, 'user');
      }, { passive: true });
    });
  }

  /* ======================================================================
     10 · PASANG SEMUANYA
     ====================================================================== */
  function init() {
    buildHUD();
    buildFilm();
    buildChapters();
    buildWall();
    buildFinale();
    buildCover();
    bindKeys();

    $('#soundBtn').addEventListener('click', function () { setSound(!sound.on); });
    $('#replayBtn').addEventListener('click', replay);
    var backTop = $('#backToStart');
    if (backTop) backTop.addEventListener('click', replay);

    $$('.dots a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = a.getAttribute('href');
        enter();
        smoothScrollTo(sectionTop(target), 1400);
        var t = $(target);
        if (t) { t.setAttribute('tabindex', '-1'); setTimeout(function () { t.focus({ preventScroll: true }); }, 1500); }
      });
    });

    /* antrian film otomatis saat penonton diam */
    setInterval(function () {
      if (!entered) return;
      if (window.FILMVIEWER && window.FILMVIEWER.isOpen()) return;
      if (!coverOn && Date.now() - lastAct > IDLE_MS) showCover(true, 'idle');
    }, 2500);

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }, 220);
    });
    window.addEventListener('load', function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); });
    if (window.gsap) window.gsap.ticker.lagSmoothing(500, 33);
  }

  return {
    init: init,
    enter: enter,
    skipIntro: skipIntro,
    goFinale: goFinale,
    replay: replay,
    setSound: setSound,
    isLite: function () { return REDUCE || TOUCH; },
    isEntered: function () { return entered; },
    showCover: showCover
  };
})();
