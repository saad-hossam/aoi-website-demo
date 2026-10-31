/* ============================================================
   AOI Frontend — Phase 3: Navigation interactions
   Vanilla JavaScript; preserves Bootstrap 5 collapse/dropdown behavior.
   ============================================================ */
'use strict';
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.main-menu');
    const collapseEl = document.getElementById('primaryNav');
    const toggler = document.querySelector('.navbar-toggler');
    const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    // Mark the current page and its parent dropdown without changing routes.
    if (nav) {
      nav.querySelectorAll('a[href]').forEach(function (link) {
        const rawHref = link.getAttribute('href') || '';
        if (!rawHref || rawHref === '#' || /^(https?:|mailto:|tel:|javascript:)/i.test(rawHref)) return;
        let hrefPath = rawHref.split('?')[0].split('#')[0].split('/').pop().toLowerCase();
        if (!hrefPath) hrefPath = 'index.html';
        if (hrefPath === currentPath) {
          if (link.classList.contains('nav-link')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            const parent = link.closest('.dropdown');
            const parentLink = parent && parent.querySelector(':scope > .nav-link');
            if (parentLink) parentLink.classList.add('active');
          }
        }
      });
    }

    // Collapse the mobile menu after selecting a destination, but allow dropdown toggles.
    function closeMobileMenu() {
      if (!collapseEl || !window.bootstrap || !collapseEl.classList.contains('show')) return;
      if (window.matchMedia('(min-width: 992px)').matches) return;
      window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
    }
    if (collapseEl) {
      collapseEl.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function () {
          if (link.matches('[data-bs-toggle="dropdown"]')) return;
          closeMobileMenu();
        });
      });
      document.addEventListener('click', function (event) {
        if (!collapseEl.classList.contains('show')) return;
        if (event.target.closest('#primaryNav') || event.target.closest('.navbar-toggler')) return;
        closeMobileMenu();
      });
    }

    // Keep the toggler's accessible state in sync with Bootstrap's collapse events.
    if (collapseEl && toggler) {
      collapseEl.addEventListener('shown.bs.collapse', function () { toggler.setAttribute('aria-expanded', 'true'); });
      collapseEl.addEventListener('hidden.bs.collapse', function () { toggler.setAttribute('aria-expanded', 'false'); });
    }

    // Escape closes an open mobile menu and any open dropdown.
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      const openDropdown = document.querySelector('.main-nav .dropdown-menu.show');
      if (openDropdown && window.bootstrap) {
        const toggle = openDropdown.parentElement.querySelector('[data-bs-toggle="dropdown"]');
        if (toggle) window.bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
      }
      if (collapseEl && collapseEl.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
        if (toggler) toggler.focus();
      }
    });
  });
})();
