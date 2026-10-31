/* ============================================================
   AOI Frontend — assets/js/industrial-fields.js  (PAGE MODULE)
   Renders the industrial fields page. Reads window.AOI_DATA_FIELDS
   (the file assets/js/data/industrial-fields.js).
   Category chips rendered from distinct categories in the data.
   Search + category filter combined.
   ============================================================ */
'use strict';

(function () {
  const state = { category: 'all', query: '' };

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('fields-list')) return;
    renderChips();
    render();
    bindSearch();
    document.addEventListener('aoi:language', function () {
      renderChips();
      render();
    });
    initReveal();
  });

  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function data() { return Array.isArray(window.AOI_DATA_FIELDS) ? window.AOI_DATA_FIELDS : []; }

  function localized(v) {
    if (!v) return '';
    if (typeof v === 'object') return v[lang()] || v.ar || '';
    return String(v);
  }

  function normalize(text) {
    if (!text) return '';
    let t = String(text);
    try { t = t.normalize('NFKD'); } catch (e) {}
    t = t.replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, '');
    t = t.replace(/[إأآٱ]/g, 'ا');
    t = t.replace(/ة/g, 'ه');
    t = t.replace(/[ىئ]/g, 'ي');
    t = t.replace(/ک/g, 'ك');
    t = t.replace(/\s+/g, ' ').trim().toLowerCase();
    return t;
  }

  function matches(item) {
    if (state.category !== 'all' && item.category !== state.category) return false;
    const q = normalize(state.query);
    if (!q) return true;
    const hay = normalize(localized(item.title) + ' ' + localized(item.description) + ' ' + (item.category || ''));
    return hay.indexOf(q) !== -1;
  }

  function categoryLabel(id) {
    if (id === 'all') return dict()['fieldsPage.catAll'] || 'الكل';
    const labels = {
      manufacturing: dict()['fieldsPage.catManufacturing'] || 'التصنيع',
      technology:    dict()['fieldsPage.catTechnology']    || 'التقنية',
      energy:        dict()['fieldsPage.catEnergy']        || 'الطاقة',
      defense:       dict()['fieldsPage.catDefense']       || 'الدفاع',
      environment:   dict()['fieldsPage.catEnvironment']   || 'البيئة'
    };
    return labels[id] || id;
  }

  function categories() {
    const set = {};
    data().forEach(function (d) { if (d.category) set[d.category] = true; });
    return ['all'].concat(Object.keys(set));
  }

  function renderChips() {
    const wrap = document.getElementById('fields-chips');
    if (!wrap) return;
    wrap.replaceChildren();
    categories().forEach(function (cat) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (cat === state.category ? ' is-active' : '');
      btn.textContent = categoryLabel(cat);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', cat === state.category ? 'true' : 'false');
      btn.addEventListener('click', function () {
        state.category = cat;
        renderChips();
        render();
      });
      wrap.appendChild(btn);
    });
  }

  function render() {
    const list = document.getElementById('fields-list');
    const empty = document.getElementById('fields-empty');
    const count = document.getElementById('fields-count');
    if (!list || !empty) return;

    list.replaceChildren();
    const items = data().filter(matches);
    if (count) count.textContent = String(items.length);

    if (items.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    items.forEach(function (item) {
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-lg-4';

      const a = document.createElement('a');
      a.className = 'image-card tilt';
      a.href = '#';
      a.setAttribute('aria-label', localized(item.title));

      const media = document.createElement('div');
      media.className = 'image-card__media' + (item.image ? '' : ' image-card__media--placeholder');
      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = localized(item.title);
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        img.onerror = function () {
          media.classList.add('image-card__media--placeholder');
          media.replaceChildren();
          const icon = document.createElement('i');
          icon.className = 'fa-solid ' + (item.icon || 'fa-industry');
          icon.setAttribute('aria-hidden', 'true');
          media.appendChild(icon);
        };
        media.appendChild(img);
      } else {
        const icon = document.createElement('i');
        icon.className = 'fa-solid ' + (item.icon || 'fa-industry');
        icon.setAttribute('aria-hidden', 'true');
        media.appendChild(icon);
      }

      const body = document.createElement('div');
      body.className = 'image-card__body';

      const title = document.createElement('h2');
      title.className = 'image-card__title';
      title.textContent = localized(item.title);

      const text = document.createElement('p');
      text.className = 'image-card__text';
      text.textContent = localized(item.description);

      body.appendChild(title);
      body.appendChild(text);
      a.appendChild(media);
      a.appendChild(body);
      col.appendChild(a);
      list.appendChild(col);
    });
  }

  function bindSearch() {
    const input = document.getElementById('fields-search');
    if (!input) return;
    let timer = null;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.query = input.value;
        render();
      }, 160);
    });
  }

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
})();