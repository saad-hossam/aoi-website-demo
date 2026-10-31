/* AOI — modern interactions: scroll progress, glass header, spotlight, ripple, counters, back-to-top */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PROXY = 'https://wsrv.nl/?url=';
  function proxied(u) { return PROXY + encodeURIComponent(u.replace(/^https?:\/\//, '')); }
  // If aoi.org.eg blocks hotlinking, retry the image once through a proxy before any page-level fallback runs
  document.addEventListener('error', function (e) {
    var im = e.target; if (!im || im.tagName !== 'IMG' || im.dataset.aoiRetry) return;
    if (!/^https?:\/\/(www\.)?aoi\.org\.eg\//.test(im.src)) return;
    im.dataset.aoiRetry = '1'; e.stopImmediatePropagation(); im.src = proxied(im.src);
  }, true);
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.hero-slide__bg').forEach(function (d) {
      var m = /url\(["']?(https?:[^"')]+)["']?\)/.exec(d.style.backgroundImage || ''); if (!m) return;
      var t = new Image(); t.onerror = function () { d.style.backgroundImage = 'url("' + proxied(m[1]) + '")'; }; t.src = m[1];
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div'); bar.className = 'aoi-progress'; bar.setAttribute('aria-hidden', 'true');
    var top = document.createElement('button'); top.className = 'aoi-top'; top.type = 'button';
    top.setAttribute('aria-label', 'Back to top'); top.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    top.onclick = function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); };
    document.body.append(bar, top);
    var header = document.getElementById('site-header'), tick = false;
    function onScroll() {
      var h = document.documentElement, max = h.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
      if (header) header.classList.toggle('is-scrolled', scrollY > 24);
      top.classList.toggle('is-on', scrollY > 600); tick = false;
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.tilt'); if (!c) return;
      var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      if (!reduce && e.pointerType === 'mouse') {
        c.style.transform = 'perspective(900px) rotateX(' + ((y / r.height - .5) * -5) + 'deg) rotateY(' + ((x / r.width - .5) * 5) + 'deg) translateY(-4px)';
      }
    });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest('.tilt'); if (c && !c.contains(e.relatedTarget)) c.style.transform = '';
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.btn-aoi'); if (!b || reduce) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement('span');
      d.className = 'aoi-ripple'; d.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
      b.appendChild(d); setTimeout(function () { d.remove(); }, 650);
    });

    // Reveal fallback for pages whose own script doesn't handle it; <el data-count="15000" data-suffix="+"> animates numbers
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return; io.unobserve(en.target);
          var el = en.target;
          if (el.matches('.reveal,.reveal-stagger')) el.classList.add('is-visible');
          if (el.dataset.count) {
            var to = +el.dataset.count, sfx = el.dataset.suffix || '', t0 = performance.now();
            (function step(t) { var p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString() + sfx; if (p < 1) requestAnimationFrame(step); })(t0);
          }
        });
      }, { threshold: .15 });
      document.querySelectorAll('.reveal,.reveal-stagger,[data-count]').forEach(function (el) { io.observe(el); });
    }
  });
})();
