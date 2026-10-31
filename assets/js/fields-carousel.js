/* AOI — industrial fields auto-moving carousel (RTL-aware) */
(function () {
  'use strict';

  var state = {
    index: 0,
    perView: 4,
    timer: null,
    paused: false
  };

  function track() { return document.getElementById('fields-track'); }
  function root() { return document.getElementById('fields-carousel'); }
  function slides() {
    var t = track();
    return t ? Array.prototype.slice.call(t.querySelectorAll('.fields-carousel__slide')) : [];
  }
  function isRtl() { return document.documentElement.dir === 'rtl'; }

  function calcPerView() {
    var w = window.innerWidth || 1200;
    if (w < 576) return 1;
    if (w < 768) return 2;
    if (w < 1100) return 3;
    return 4;
  }

  function maxIndex() {
    return Math.max(0, slides().length - state.perView);
  }

  function apply() {
    var t = track();
    if (!t) return;
    var items = slides();
    if (!items.length) return;
    state.perView = calcPerView();
    if (state.index > maxIndex()) state.index = maxIndex();

    var slideW = items[0].getBoundingClientRect().width;
    var gap = parseFloat(getComputedStyle(t).gap || '16') || 16;
    var offset = state.index * (slideW + gap);
    // In RTL, flex direction is row; translateX direction flips with dir
    var x = isRtl() ? offset : -offset;
    t.style.transform = 'translate3d(' + x + 'px,0,0)';

    // dots
    var dots = document.getElementById('fields-dots');
    if (dots) {
      var pages = maxIndex() + 1;
      if (dots.children.length !== pages) {
        dots.replaceChildren();
        for (var i = 0; i < pages; i++) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'fields-carousel__dot' + (i === state.index ? ' is-active' : '');
          b.setAttribute('aria-label', 'Slide ' + (i + 1));
          b.setAttribute('aria-selected', i === state.index ? 'true' : 'false');
          (function (idx) {
            b.addEventListener('click', function () {
              state.index = idx;
              apply();
              restart();
            });
          })(i);
          dots.appendChild(b);
        }
      } else {
        Array.prototype.forEach.call(dots.children, function (d, i) {
          d.classList.toggle('is-active', i === state.index);
          d.setAttribute('aria-selected', i === state.index ? 'true' : 'false');
        });
      }
    }

    var prev = document.getElementById('fields-prev');
    var next = document.getElementById('fields-next');
    if (prev) prev.disabled = state.index <= 0;
    if (next) next.disabled = state.index >= maxIndex();
  }

  function next() {
    state.index = state.index >= maxIndex() ? 0 : state.index + 1;
    apply();
  }
  function prev() {
    state.index = state.index <= 0 ? maxIndex() : state.index - 1;
    apply();
  }

  function stop() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
  }
  function restart() {
    stop();
    if (state.paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    state.timer = setInterval(next, 4200);
  }

  function bind() {
    var r = root();
    if (!r || r.dataset.bound === '1') return;
    r.dataset.bound = '1';
    var prevBtn = document.getElementById('fields-prev');
    var nextBtn = document.getElementById('fields-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    r.addEventListener('mouseenter', function () { state.paused = true; stop(); });
    r.addEventListener('mouseleave', function () { state.paused = false; restart(); });
    r.addEventListener('focusin', function () { state.paused = true; stop(); });
    r.addEventListener('focusout', function () { state.paused = false; restart(); });
    window.addEventListener('resize', function () {
      state.perView = calcPerView();
      apply();
    });
  }

  function refresh() {
    state.index = 0;
    state.perView = calcPerView();
    bind();
    apply();
    restart();
  }

  window.AOIFieldsCarousel = { refresh: refresh };

  document.addEventListener('DOMContentLoaded', function () {
    if (track() && track().children.length) refresh();
  });
})();
