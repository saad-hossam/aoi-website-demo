/* ============================================================
   AOI Frontend — main.js
   Shared UI helpers: back-to-top, small utilities.
   ============================================================ */
'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initBackToTop();
  });

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const threshold = 400;
    let ticking = false;

    function update() {
      const show = window.scrollY > threshold;
      btn.hidden = !show;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    update();
  }
})();
window.aoiAsset = function (u) { return /^(https?:)?\/\//.test(u) ? u : '../' + u; };
