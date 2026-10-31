/* ============================================================
   AOI Frontend — home.js
   Accessible hero slider + scroll reveal + tilt cards.
   ============================================================ */
'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initHeroSlider();
    initReveal();
    initTilt();
  });

  /* ---------------- HERO SLIDER ---------------- */
  function initHeroSlider() {
    const root = document.querySelector('.hero-slider');
    if (!root) return;

    const slides = root.querySelectorAll('.hero-slide');
    const dots = root.querySelectorAll('.hero-slider__dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    const pauseBtn = document.getElementById('hero-pause');
    const progress = document.getElementById('hero-progress');
    if (slides.length === 0) return;

    const AUTOPLAY_MS = 6500;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let index = 0;
    let autoplayTimer = null;
    let progressTimer = null;
    let progressStart = 0;
    let userPaused = reduceMotion;

    function setActive(next) {
      if (next === index) return;
      slides[index].classList.remove('is-active');
      slides[index].setAttribute('aria-hidden', 'true');
      dots[index].classList.remove('is-active');
      dots[index].setAttribute('aria-selected', 'false');

      index = (next + slides.length) % slides.length;

      slides[index].classList.add('is-active');
      slides[index].setAttribute('aria-hidden', 'false');
      dots[index].classList.add('is-active');
      dots[index].setAttribute('aria-selected', 'true');

      restartProgress();
    }

    function restartProgress() {
      if (progressTimer) cancelAnimationFrame(progressTimer);
      if (!progress) return;
      progress.style.width = '0%';
      if (userPaused) return;
      progressStart = performance.now();
      const step = function (now) {
        if (userPaused) return;
        const pct = Math.min(100, ((now - progressStart) / AUTOPLAY_MS) * 100);
        progress.style.width = pct + '%';
        if (pct < 100) progressTimer = requestAnimationFrame(step);
      };
      progressTimer = requestAnimationFrame(step);
    }

    function startAutoplay() {
      if (userPaused) return;
      stopAutoplay();
      autoplayTimer = setInterval(function () { setActive(index + 1); }, AUTOPLAY_MS);
      restartProgress();
    }

    function stopAutoplay() {
      if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
      if (progressTimer) { cancelAnimationFrame(progressTimer); progressTimer = null; }
    }

    function updatePauseUI() {
      if (!pauseBtn) return;
      pauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
      pauseBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
      const icon = pauseBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-pause', !userPaused);
        icon.classList.toggle('fa-play', userPaused);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { setActive(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setActive(index + 1); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        setActive(parseInt(d.dataset.slide, 10) || 0);
      });
    });

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        userPaused = !userPaused;
        updatePauseUI();
        if (userPaused) { stopAutoplay(); if (progress) progress.style.width = '0%'; }
        else { startAutoplay(); }
      });
    }

    // Keyboard support
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { setActive(index - 1); }
      else if (e.key === 'ArrowRight') { setActive(index + 1); }
    });

    // Pause on hover / focus
    root.addEventListener('mouseenter', function () { stopAutoplay(); });
    root.addEventListener('mouseleave', function () { startAutoplay(); });
    root.addEventListener('focusin', function () { stopAutoplay(); });
    root.addEventListener('focusout', function () {
      if (!root.contains(document.activeElement)) startAutoplay();
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    updatePauseUI();
    if (!userPaused) startAutoplay();
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------------- TILT CARDS ---------------- */
  function initTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return; // skip touch

    const cards = document.querySelectorAll('.tilt');
    cards.forEach(function (card) {
      let raf = null;
      card.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          const r = card.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = (e.clientX - cx) / r.width;
          const dy = (e.clientY - cy) / r.height;
          const rx = Math.max(-4, Math.min(4, -dy * 6));
          const ry = Math.max(-4, Math.min(4,  dx * 6));
          card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-2px)';
          raf = null;
        });
      });
      card.addEventListener('pointerleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = '';
      });
    });
  }
})();