/* AOI — interactive navbar: hide on scroll down, shrink, sliding indicator, animated burger, mobile backdrop */
'use strict';
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var menu = header.querySelector('.main-menu');
    var collapse = document.getElementById('primaryNav');
    var toggler = header.querySelector('.navbar-toggler');
    var desktop = window.matchMedia('(min-width: 992px)');

    // Animated burger
    if (toggler && !toggler.querySelector('.nav-burger')) {
      var b = document.createElement('span'); b.className = 'nav-burger'; b.setAttribute('aria-hidden', 'true');
      toggler.appendChild(b);
    }

    // Stagger index for mobile items
    if (collapse) collapse.querySelectorAll('.main-menu > .nav-item, .nav-cta, .lang-toggle--nav')
      .forEach(function (el, i) { el.style.setProperty('--i', i); });

    // Backdrop + body lock on mobile
    var backdrop = document.createElement('div'); backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function () {
      if (window.bootstrap && collapse) window.bootstrap.Collapse.getOrCreateInstance(collapse, { toggle: false }).hide();
    });
    if (collapse) {
      collapse.addEventListener('show.bs.collapse', function () { document.body.classList.add('nav-open'); });
      collapse.addEventListener('hide.bs.collapse', function () { document.body.classList.remove('nav-open'); });
    }

    // Shrink + hide on scroll down, show on scroll up
    var lastY = window.scrollY, ticking = false;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      var menuOpen = document.body.classList.contains('nav-open') || header.querySelector('.dropdown-menu.show');
      header.classList.toggle('is-hidden', !menuOpen && y > 200 && y > lastY + 4);
      if (y < lastY - 4 || y < 200) header.classList.remove('is-hidden');
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

    // Sliding indicator (desktop)
    if (menu) {
      var ind = document.createElement('span'); ind.className = 'nav-indicator'; ind.setAttribute('aria-hidden', 'true');
      menu.appendChild(ind); menu.classList.add('has-indicator');
      function moveTo(link) {
        if (!desktop.matches || !link) { ind.style.opacity = 0; return; }
        var m = menu.getBoundingClientRect(), r = link.getBoundingClientRect();
        ind.style.left = (r.left - m.left + 8) + 'px';
        ind.style.width = Math.max(r.width - 16, 0) + 'px';
        ind.style.opacity = 1;
      }
      function active() { return menu.querySelector(':scope > .nav-item > .nav-link.active'); }
      menu.querySelectorAll(':scope > .nav-item > .nav-link').forEach(function (l) {
        l.addEventListener('mouseenter', function () { moveTo(l); });
        l.addEventListener('focus', function () { moveTo(l); });
      });
      menu.addEventListener('mouseleave', function () { moveTo(active()); });
      window.addEventListener('resize', function () { moveTo(active()); });
      new MutationObserver(function () { setTimeout(function () { moveTo(active()); }, 50); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['dir', 'lang'] });
      if (document.fonts) document.fonts.ready.then(function () { moveTo(active()); });
      setTimeout(function () { moveTo(active()); }, 100);
    }
  });
})();
