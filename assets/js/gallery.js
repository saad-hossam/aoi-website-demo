/* AOI — reusable image gallery: stage + thumbnails + fullscreen lightbox (keyboard, swipe, RTL-aware) */
(function () {
  'use strict';
  function el(t, c) { var e = document.createElement(t); if (c) e.className = c; return e; }
  function url(u) { return window.aoiAsset ? window.aoiAsset(u) : u; }
  function btn(c, label, ic) { var b = el('button', c); b.type = 'button'; b.setAttribute('aria-label', label); b.innerHTML = '<i class="fa-solid ' + ic + '" aria-hidden="true"></i>'; return b; }
  var lb;
  function lightbox() {
    if (lb) return lb;
    var o = el('div', 'aoi-lb'); o.hidden = true; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true');
    var img = el('img'), cap = el('div', 'aoi-lb__count'), x = btn('aoi-lb__close', 'Close', 'fa-xmark');
    var pv = btn('aoi-lb__nav aoi-lb__nav--prev', 'Previous', 'fa-chevron-left'), nx = btn('aoi-lb__nav aoi-lb__nav--next', 'Next', 'fa-chevron-right');
    o.append(x, pv, img, nx, cap); document.body.appendChild(o);
    lb = { o: o, img: img, cap: cap, list: [], i: 0, alt: '' };
    lb.show = function (i) { lb.i = (i + lb.list.length) % lb.list.length; img.src = url(lb.list[lb.i]); img.alt = lb.alt; cap.textContent = (lb.i + 1) + ' / ' + lb.list.length; pv.hidden = nx.hidden = lb.list.length < 2; };
    lb.open = function (list, i, alt) { lb.list = list; lb.alt = alt; lb.show(i); o.hidden = false; document.body.style.overflow = 'hidden'; x.focus(); };
    lb.close = function () { o.hidden = true; document.body.style.overflow = ''; };
    var rtl = function () { return document.documentElement.dir === 'rtl'; };
    x.onclick = lb.close; pv.onclick = function () { lb.show(lb.i + (rtl() ? 1 : -1)); }; nx.onclick = function () { lb.show(lb.i + (rtl() ? -1 : 1)); };
    o.addEventListener('click', function (e) { if (e.target === o) lb.close(); });
    document.addEventListener('keydown', function (e) {
      if (o.hidden) return;
      if (e.key === 'Escape') lb.close(); else if (e.key === 'ArrowRight') (rtl() ? pv : nx).click(); else if (e.key === 'ArrowLeft') (rtl() ? nx : pv).click();
    });
    var sx = null;
    o.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    o.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) (dx < 0 ? nx : pv).click(); sx = null; });
    return lb;
  }
  function create(images, alt, icon) {
    var root = el('div', 'aoi-gal'), stage = el('div', 'aoi-gal__stage'), i = 0;
    function fallback(host) { host.replaceChildren(); var f = el('i', icon || 'fa-solid fa-image'); f.setAttribute('aria-hidden', 'true'); host.appendChild(f); host.classList.add('is-empty'); }
    if (!images || !images.length) { fallback(stage); root.appendChild(stage); return root; }
    var img = el('img'); img.alt = alt; img.referrerPolicy = 'no-referrer'; img.onerror = function () { fallback(stage); };
    stage.appendChild(img);
    var zoom = btn('aoi-gal__zoom', 'Enlarge', 'fa-expand'); stage.appendChild(zoom);
    var thumbs = el('div', 'aoi-gal__thumbs'), tb = [];
    function go(n) {
      i = (n + images.length) % images.length; stage.classList.remove('is-empty');
      if (!img.parentNode) { stage.replaceChildren(img, zoom); }
      img.classList.remove('is-in'); img.src = url(images[i]); requestAnimationFrame(function () { img.classList.add('is-in'); });
      tb.forEach(function (t, k) { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', k === i); });
    }
    if (images.length > 1) {
      var pv = btn('aoi-gal__nav aoi-gal__nav--prev', 'Previous', 'fa-chevron-left'), nx = btn('aoi-gal__nav aoi-gal__nav--next', 'Next', 'fa-chevron-right');
      var rtl = function () { return document.documentElement.dir === 'rtl'; };
      pv.onclick = function () { go(i + (rtl() ? 1 : -1)); }; nx.onclick = function () { go(i + (rtl() ? -1 : 1)); };
      stage.append(pv, nx);
      images.forEach(function (s, k) {
        var t = el('button', 'aoi-gal__thumb'); t.type = 'button'; t.setAttribute('role', 'tab'); t.setAttribute('aria-label', 'Image ' + (k + 1));
        var ti = el('img'); ti.src = url(s); ti.alt = ''; ti.loading = 'lazy'; ti.referrerPolicy = 'no-referrer'; ti.onerror = function () { t.hidden = true; };
        t.appendChild(ti); t.onclick = function () { go(k); }; thumbs.appendChild(t); tb.push(t);
      });
    }
    function open() { lightbox().open(images, i, alt); }
    zoom.onclick = open; img.onclick = open;
    root.appendChild(stage); if (images.length > 1) root.appendChild(thumbs);
    go(0); return root;
  }
  window.AOIGallery = { create: create };
})();
