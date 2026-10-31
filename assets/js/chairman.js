/* ============================================================
   AOI Frontend — assets/js/chairman.js  (PAGE MODULE)
   Renders the chairman profile from window.AOI_DATA_CHAIRMAN.
   Runs on pages/chairman.html. Re-renders on aoi:language.
   Falls back to a professional "awaiting data" state when the
   dataset is null (should not happen now that the data file
   has been populated).
   ============================================================ */
'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('chairman-root');
    if (!root) return;

    render();
    document.addEventListener('aoi:language', render);
    initReveal();
  });

  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function data() { return window.AOI_DATA_CHAIRMAN || null; }

  function localized(v) {
    if (!v) return '';
    if (typeof v === 'object') return v[lang()] || v.ar || '';
    return String(v);
  }
  function arrayOf(v) {
    if (!v) return [];
    if (typeof v === 'object' && Array.isArray(v[lang()])) return v[lang()];
    if (typeof v === 'object' && Array.isArray(v.ar)) return v.ar;
    return [];
  }

  function render() {
    var root = document.getElementById('chairman-root');
    if (!root) return;

    var c = data();
    root.replaceChildren();

    var container = document.createElement('div');
    container.className = 'container';

    if (!c) {
      container.appendChild(buildMissing());
      root.appendChild(container);
      return;
    }

    container.appendChild(buildFeature(c));
    container.appendChild(buildBio(c));
    container.appendChild(buildMessage(c));

    root.appendChild(container);
  }

  function buildFeature(c) {
    var wrap = document.createElement('div');
    wrap.className = 'chairman-feature';

    var portrait = document.createElement('div');
    portrait.className = 'chairman-feature__portrait';
    portrait.setAttribute('aria-label', localized(c.name));
    if (c.portraitUrl) {
      var img = document.createElement('img');
      img.src = window.aoiAsset(c.portraitUrl);
      img.alt = localized(c.name);
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        img.remove();
        var icon = document.createElement('i');
        icon.className = 'fa-solid fa-user-tie';
        icon.setAttribute('aria-hidden', 'true');
        portrait.appendChild(icon);
      });
      portrait.appendChild(img);
    } else {
      var icon = document.createElement('i');
      icon.className = 'fa-solid fa-user-tie';
      icon.setAttribute('aria-hidden', 'true');
      portrait.appendChild(icon);
    }

    var content = document.createElement('div');
    content.className = 'chairman-feature__content';

    var eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = dict()['chairmanPage.eyebrow'] || 'القيادة';

    var name = document.createElement('h2');
    name.className = 'section-title';
    name.textContent = localized(c.name);

    var role = document.createElement('p');
    role.className = 'section-text';
    role.textContent = localized(c.title);

    content.appendChild(eyebrow);
    content.appendChild(name);
    content.appendChild(role);

    wrap.appendChild(portrait);
    wrap.appendChild(content);
    return wrap;
  }

  function buildBio(c) {
    var paras = arrayOf(c.bio);
    if (paras.length === 0) return document.createElement('div');

    var section = document.createElement('section');
    section.className = 'section reveal';
    section.innerHTML = '';

    var container = document.createElement('div');
    container.className = 'container';

    var head = document.createElement('div');
    head.className = 'section-head';
    var eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = dict()['chairmanPage.eyebrow'] || 'القيادة';
    var title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = dict()['chairmanPage.bioTitle'] || 'نبذة';
    head.appendChild(eyebrow);
    head.appendChild(title);

    var bioWrap = document.createElement('div');
    bioWrap.className = 'chairman-bio';
    paras.forEach(function (p) {
      var para = document.createElement('p');
      para.textContent = p;
      bioWrap.appendChild(para);
    });

    container.appendChild(head);
    container.appendChild(bioWrap);
    section.appendChild(container);
    return section;
  }

  function buildMessage(c) {
    var msg = localized(c.message);
    if (!msg) return document.createElement('div');

    var section = document.createElement('section');
    section.className = 'section section--alt reveal';

    var container = document.createElement('div');
    container.className = 'container';

    var head = document.createElement('div');
    head.className = 'section-head';
    var eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = dict()['chairmanPage.msgEyebrow'] || 'كلمة';
    var title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = dict()['chairmanPage.msgTitle'] || 'كلمة رئيس الهيئة';
    head.appendChild(eyebrow);
    head.appendChild(title);

    var quote = document.createElement('blockquote');
    quote.className = 'chairman-quote';
    quote.textContent = msg;

    container.appendChild(head);
    container.appendChild(quote);
    section.appendChild(container);
    return section;
  }

  function buildMissing() {
    var wrap = document.createElement('div');
    wrap.className = 'empty-state empty-state--page';
    wrap.setAttribute('role', 'status');
    var title = document.createElement('p');
    title.className = 'empty-state__title';
    title.textContent = 'Chairman data not available.';
    var text = document.createElement('p');
    text.className = 'empty-state__text';
    text.textContent = 'The chairman dataset has not been populated.';
    wrap.appendChild(title);
    wrap.appendChild(text);
    return wrap;
  }

  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (t) { io.observe(t); });
  }
})();