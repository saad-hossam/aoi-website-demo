/* ============================================================
   AOI Frontend — assets/js/pages/careers.js
   Careers listing: empty-state-driven when AOI_JOBS is empty.
   Search + department filter + sort + pagination render only
   when verified jobs exist. Re-renders on language change.
   Safe DOM. No fabricated data.
   ============================================================ */
'use strict';

(function () {
  const PER_PAGE = 6;

  const state = {
    department: 'all',
    query: '',
    sort: 'default',
    page: 1
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('careers-grid')) return;

    initToolbarVisibility();
    if (hasJobs()) {
      renderChips();
      renderGrid();
      bindControls();
    } else {
      initEmptyState();
    }
    document.addEventListener('aoi:language', function () {
      if (hasJobs()) {
        renderChips();
        renderGrid();
      } else {
        initEmptyState();
      }
    });
    initReveal();
  });

  /* ---------------- helpers ---------------- */
  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function jobs() { return Array.isArray(window.AOI_JOBS) ? window.AOI_JOBS : []; }
  function meta() { return window.AOI_JOBS_META || {}; }
  function departments() { return Array.isArray(meta().departments) ? meta().departments : []; }
  function hasJobs() { return jobs().length > 0; }

  function departmentName(id) {
    const l = lang();
    const dep = departments().find(function (d) { return d.id === id; });
    return dep && dep.name ? (dep.name[l] || dep.name.ar || id) : id;
  }

  function localized(value) {
    if (!value) return '';
    if (typeof value === 'object') return value[lang()] || value.ar || '';
    return String(value);
  }

  function validDate(iso) {
    if (!iso) return null;
    const t = Date.parse(iso);
    return isNaN(t) ? null : t;
  }
  function formatDate(iso) {
    const t = validDate(iso);
    if (t === null) return '';
    try {
      return new Date(t).toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-GB', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) { return ''; }
  }
  function isClosed(job) {
    const t = validDate(job.deadline);
    if (t === null) return false;
    return Date.now() > t;
  }
  function statusLabel(job) {
    const d = dict();
    if (isClosed(job)) return d['careersPage.statusClosed'] || 'Closed';
    return d['careersPage.statusOpen'] || 'Open';
  }
  function employmentTypeLabel(type) {
    if (!type) return '';
    const d = dict();
    const key = 'careersPage.type_' + type.replace('-', '');
    return d[key] || type;
  }

  /* ---------------- toolbar / empty ---------------- */
  function initToolbarVisibility() {
    const wrap = document.getElementById('careers-toolbar-wrap');
    const empty = document.getElementById('careers-empty');
    const notice = document.getElementById('careers-notice');
    if (!wrap || !empty) return;
    if (hasJobs()) {
      wrap.hidden = false;
      empty.hidden = true;
      if (notice) notice.hidden = true;
    } else {
      wrap.hidden = true;
      empty.hidden = false;
      if (notice) notice.hidden = true;
    }
  }

  function initEmptyState() {
    const link = document.getElementById('careers-official-link');
    const note = document.querySelector('.careers-empty__note');
    const url = meta().officialUrl;
    if (!link) return;
    if (url) {
      link.href = url;
      link.hidden = false;
      if (note) note.hidden = true;
    } else {
      link.hidden = true;
      if (note) note.hidden = false;
    }
  }

  /* ---------------- filtering & sorting ---------------- */
  function filtered() {
    const l = lang();
    const q = state.query.trim().toLowerCase();
    return jobs().filter(function (j) {
      if (state.department !== 'all' && j.department !== state.department) return false;
      if (!q) return true;
      const title = (j.title && j.title[l]) || '';
      const ref = j.reference || '';
      const desc = (j.description && j.description[l]) || '';
      return (title + ' ' + ref + ' ' + desc).toLowerCase().indexOf(q) !== -1;
    });
  }

  function sorted(arr) {
    const l = lang();
    const copy = arr.slice();
    if (state.sort === 'title-asc') {
      copy.sort(function (a, b) {
        return ((a.title && a.title[l]) || '').localeCompare((b.title && b.title[l]) || '', l);
      });
    } else if (state.sort === 'date-newest' || state.sort === 'date-oldest') {
      const dir = state.sort === 'date-newest' ? -1 : 1;
      copy.sort(function (a, b) {
        const da = validDate(a.publishedAt);
        const db = validDate(b.publishedAt);
        if (da === null && db === null) return 0;
        if (da === null) return 1;
        if (db === null) return -1;
        return (da - db) * dir;
      });
    }
    return copy;
  }

  /* ---------------- chips ---------------- */
  function renderChips() {
    const wrap = document.getElementById('careers-chips');
    if (!wrap) return;
    const d = dict();
    wrap.replaceChildren();

    const items = [{ id: 'all', label: d['common.all'] || 'All' }];
    departments().forEach(function (dep) {
      items.push({ id: dep.id, label: dep.name ? (dep.name[lang()] || dep.name.ar) : dep.id });
    });

    items.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (item.id === state.department ? ' is-active' : '');
      btn.textContent = item.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', item.id === state.department ? 'true' : 'false');
      btn.addEventListener('click', function () {
        state.department = item.id;
        state.page = 1;
        renderChips();
        renderGrid();
      });
      wrap.appendChild(btn);
    });
  }

  /* ---------------- active filters ---------------- */
  function renderActiveFilters() {
    const wrap = document.getElementById('active-filters');
    if (!wrap) return;
    const d = dict();
    wrap.replaceChildren();

    const hasFilter = state.department !== 'all' || state.query.trim() !== '';
    if (!hasFilter) { wrap.hidden = true; return; }
    wrap.hidden = false;

    if (state.department !== 'all') {
      wrap.appendChild(makePill(departmentName(state.department), function () {
        state.department = 'all'; state.page = 1; renderChips(); renderGrid();
      }));
    }
    if (state.query.trim() !== '') {
      wrap.appendChild(makePill('"' + state.query.trim() + '"', function () {
        state.query = ''; state.page = 1; syncSearchInput(); renderGrid();
      }));
    }
    const clearAll = document.createElement('button');
    clearAll.type = 'button';
    clearAll.className = 'filters-clear-all';
    clearAll.textContent = d['careersPage.clearAll'] || 'Clear all';
    clearAll.addEventListener('click', resetFilters);
    wrap.appendChild(clearAll);
  }

  function makePill(label, onRemove) {
    const pill = document.createElement('span');
    pill.className = 'filter-pill';
    const text = document.createElement('span');
    text.textContent = label;
    pill.appendChild(text);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Remove filter: ' + label);
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-xmark';
    icon.setAttribute('aria-hidden', 'true');
    btn.appendChild(icon);
    btn.addEventListener('click', onRemove);
    pill.appendChild(btn);
    return pill;
  }

  function resetFilters() {
    state.department = 'all';
    state.query = '';
    state.page = 1;
    syncSearchInput();
    renderChips();
    renderGrid();
  }

  function syncSearchInput() {
    const input = document.getElementById('careers-search');
    const clearBtn = document.getElementById('careers-search-clear');
    if (input && input.value !== state.query) input.value = state.query;
    if (clearBtn) clearBtn.hidden = state.query.length === 0;
  }

  /* ---------------- card ---------------- */
  function buildCard(job) {
    const l = lang();
    const d = dict();
    const closed = isClosed(job);

    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    const article = document.createElement('article');
    article.className = 'job-tile';

    const head = document.createElement('div');
    head.className = 'job-tile__head';

    const cat = document.createElement('span');
    cat.className = 'job-tile__category';
    cat.textContent = departmentName(job.department);

    const statusEl = document.createElement('span');
    statusEl.className = 'job-tile__status ' + (closed ? 'job-tile__status--closed' : 'job-tile__status--open');
    statusEl.textContent = statusLabel(job);

    head.appendChild(cat);
    head.appendChild(statusEl);
    article.appendChild(head);

    const title = document.createElement('h3');
    title.className = 'job-tile__title';
    const link = document.createElement('a');
    link.href = 'job-details.html?id=' + encodeURIComponent(job.id);
    link.textContent = (job.title && job.title[l]) || '';
    title.appendChild(link);
    article.appendChild(title);

    if (job.reference) {
      const ref = document.createElement('p');
      ref.className = 'job-tile__ref';
      ref.textContent = job.reference;
      article.appendChild(ref);
    }

    const desc = document.createElement('p');
    desc.className = 'job-tile__desc';
    desc.textContent = (job.description && job.description[l]) || '';
    article.appendChild(desc);

    const metaEl = document.createElement('div');
    metaEl.className = 'job-tile__meta';

    const loc = localized(job.location);
    if (loc) metaEl.appendChild(metaItem('fa-location-dot', loc));
    const type = employmentTypeLabel(job.employmentType);
    if (type) metaEl.appendChild(metaItem('fa-briefcase', type));
    const pub = formatDate(job.publishedAt);
    if (pub) metaEl.appendChild(metaItem('fa-calendar', pub));
    const dl = formatDate(job.deadline);
    if (dl) metaEl.appendChild(metaItem('fa-hourglass-end', dl));

    if (metaEl.children.length) article.appendChild(metaEl);

    const cta = document.createElement('a');
    cta.className = 'job-tile__cta';
    cta.href = 'job-details.html?id=' + encodeURIComponent(job.id);
    const ctaLabel = document.createElement('span');
    ctaLabel.textContent = d['careersPage.viewJob'] || 'View Job';
    const arrow = document.createElement('i');
    arrow.className = 'fa-solid fa-arrow-left';
    arrow.setAttribute('aria-hidden', 'true');
    cta.appendChild(ctaLabel);
    cta.appendChild(arrow);
    article.appendChild(cta);

    col.appendChild(article);
    return col;
  }

  function metaItem(icon, text) {
    const span = document.createElement('span');
    const i = document.createElement('i');
    i.className = 'fa-solid ' + icon;
    i.setAttribute('aria-hidden', 'true');
    const t = document.createElement('span');
    t.textContent = text;
    span.appendChild(i);
    span.appendChild(t);
    return span;
  }

  /* ---------------- pagination ---------------- */
  function renderPagination(totalPages) {
    const nav = document.getElementById('careers-pagination');
    if (!nav) return;
    nav.replaceChildren();
    if (totalPages <= 1) return;

    const prev = pagerBtn('prev', false);
    prev.disabled = state.page === 1;
    prev.addEventListener('click', function () {
      if (state.page > 1) { state.page--; renderGrid(); }
    });
    nav.appendChild(prev);

    paginationRange(state.page, totalPages).forEach(function (p) {
      if (p === '…') {
        const span = document.createElement('span');
        span.className = 'pager-ellipsis';
        span.textContent = '…';
        nav.appendChild(span);
      } else {
        const btn = pagerBtn(String(p), p === state.page);
        btn.setAttribute('aria-label', 'Page ' + p);
        if (p === state.page) btn.setAttribute('aria-current', 'page');
        btn.addEventListener('click', function () { state.page = p; renderGrid(); });
        nav.appendChild(btn);
      }
    });

    const next = pagerBtn('next', false);
    next.disabled = state.page === totalPages;
    next.addEventListener('click', function () {
      if (state.page < totalPages) { state.page++; renderGrid(); }
    });
    nav.appendChild(next);
  }

  function pagerBtn(kind, isCurrent) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pager-btn' + (isCurrent ? ' is-current' : '');
    if (kind === 'prev' || kind === 'next') {
      const i = document.createElement('i');
      i.className = 'fa-solid ' + (kind === 'prev' ? 'fa-chevron-right' : 'fa-chevron-left');
      i.setAttribute('aria-hidden', 'true');
      b.appendChild(i);
      b.setAttribute('aria-label', kind === 'prev' ? 'Previous page' : 'Next page');
    } else {
      b.textContent = kind;
    }
    return b;
  }

  function paginationRange(current, total) {
    const range = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) range.push(i);
      return range;
    }
    range.push(1);
    if (current > 3) range.push('…');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) range.push(i);
    if (current < total - 2) range.push('…');
    range.push(total);
    return range;
  }

  /* ---------------- render grid ---------------- */
  function renderGrid() {
    const grid = document.getElementById('careers-grid');
    const noMatch = document.getElementById('careers-no-match');
    const countEl = document.getElementById('careers-count');
    if (!grid || !noMatch) return;

    const all = sorted(filtered());
    const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PER_PAGE;
    const slice = all.slice(start, start + PER_PAGE);

    grid.replaceChildren();
    slice.forEach(function (j) { grid.appendChild(buildCard(j)); });

    noMatch.hidden = all.length !== 0;
    grid.hidden = all.length === 0;

    if (countEl) countEl.textContent = String(all.length);
    renderPagination(totalPages);
    renderActiveFilters();
  }

  /* ---------------- events ---------------- */
  function bindControls() {
    const input = document.getElementById('careers-search');
    const clearBtn = document.getElementById('careers-search-clear');
    const sort = document.getElementById('careers-sort');
    const resetEmpty = document.getElementById('careers-empty-reset');

    if (input) {
      let timer = null;
      input.addEventListener('input', function () {
        clearTimeout(timer);
        const v = input.value;
        timer = setTimeout(function () {
          state.query = v;
          state.page = 1;
          if (clearBtn) clearBtn.hidden = v.length === 0;
          renderGrid();
        }, 180);
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        state.query = '';
        state.page = 1;
        syncSearchInput();
        renderGrid();
      });
    }
    if (sort) {
      sort.addEventListener('change', function () {
        state.sort = sort.value || 'default';
        state.page = 1;
        renderGrid();
      });
    }
    if (resetEmpty) resetEmpty.addEventListener('click', resetFilters);
  }

  /* ---------------- reveal ---------------- */
  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll('.reveal');
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
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (t) { io.observe(t); });
  }
})();