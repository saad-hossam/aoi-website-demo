/* ============================================================
   AOI Frontend — assets/js/pages/news.js
   Phase 15 patch: conditional sample tag on listing.
   ============================================================ */
'use strict';

(function () {
  const PER_PAGE = 6;

  const state = {
    category: 'all',
    query: '',
    sort: 'default',
    page: 1
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('news-grid')) return;

    renderFeatured();
    renderChips();
    render();
    bindEvents();
    document.addEventListener('aoi:language', function () {
      renderFeatured();
      renderChips();
      render();
    });
    initReveal();
  });

  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function news() { return Array.isArray(window.AOI_NEWS) ? window.AOI_NEWS : []; }
  function categories() { return Array.isArray(window.AOI_NEWS_CATEGORIES) ? window.AOI_NEWS_CATEGORIES : []; }

  function categoryName(id) {
    const l = lang();
    const cat = categories().find(function (c) { return c.id === id; });
    return cat && cat.name ? (cat.name[l] || cat.name.ar || id) : id;
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

  function renderFeatured() {
    const host = document.getElementById('news-featured');
    if (!host) return;
    host.replaceChildren();

    const featured = news().find(function (n) { return n.featured; });
    if (!featured) return;

    const l = lang();
    const d = dict();
    const wrap = document.createElement('article');
    wrap.className = 'featured-news';

    const media = document.createElement('div');
    media.className = 'featured-news__media';
    if (featured.image) {
      const img = document.createElement('img');
      img.src = window.aoiAsset(featured.image);
      img.alt = (featured.title && featured.title[l]) || '';
      img.loading = 'lazy';
      media.appendChild(img);
    } else {
      const icon = document.createElement('i');
      icon.className = 'fa-regular fa-newspaper';
      icon.setAttribute('aria-hidden', 'true');
      media.appendChild(icon);
    }
    const badge = document.createElement('span');
    badge.className = 'featured-news__badge';
    badge.textContent = d['newsPage.featuredBadge'] || 'Featured';
    media.appendChild(badge);

    const body = document.createElement('div');
    body.className = 'featured-news__body';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'featured-news__eyebrow';
    eyebrow.textContent = categoryName(featured.category);

    const title = document.createElement('h2');
    title.className = 'featured-news__title';
    const titleLink = document.createElement('a');
    titleLink.href = 'news-details.html?id=' + encodeURIComponent(featured.id);
    titleLink.textContent = (featured.title && featured.title[l]) || '';
    title.appendChild(titleLink);

    const excerpt = document.createElement('p');
    excerpt.className = 'featured-news__excerpt';
    excerpt.textContent = (featured.excerpt && featured.excerpt[l]) || '';

    const actions = document.createElement('div');
    actions.className = 'featured-news__actions';

    const readMore = document.createElement('a');
    readMore.className = 'btn btn-aoi btn-aoi--primary';
    readMore.href = 'news-details.html?id=' + encodeURIComponent(featured.id);
    readMore.textContent = d['common.readMore'] || 'Read More';

    const meta = document.createElement('span');
    meta.className = 'news-tile__meta';
    const dateText = formatDate(featured.publishedAt);
    if (dateText) {
      const dateEl = document.createElement('span');
      const di = document.createElement('i');
      di.className = 'fa-regular fa-calendar';
      di.setAttribute('aria-hidden', 'true');
      const dt = document.createElement('span');
      dt.textContent = dateText;
      dateEl.appendChild(di);
      dateEl.appendChild(dt);
      meta.appendChild(dateEl);
    }
    actions.appendChild(readMore);
    if (meta.children.length) actions.appendChild(meta);

    body.appendChild(eyebrow);
    body.appendChild(title);
    body.appendChild(excerpt);
    body.appendChild(actions);

    wrap.appendChild(media);
    wrap.appendChild(body);
    host.appendChild(wrap);
  }

  function filtered() {
    const l = lang();
    const q = state.query.trim().toLowerCase();
    return news().filter(function (n) {
      if (state.category !== 'all' && n.category !== state.category) return false;
      if (!q) return true;
      const title = (n.title && n.title[l]) || '';
      const excerpt = (n.excerpt && n.excerpt[l]) || '';
      const cat = categoryName(n.category);
      return (title + ' ' + excerpt + ' ' + cat).toLowerCase().indexOf(q) !== -1;
    });
  }

  function sorted(arr) {
    const l = lang();
    const copy = arr.slice();
    if (state.sort === 'title-asc') {
      copy.sort(function (a, b) {
        return ((a.title && a.title[l]) || '').localeCompare((b.title && b.title[l]) || '', l);
      });
    } else if (state.sort === 'title-desc') {
      copy.sort(function (a, b) {
        return ((b.title && b.title[l]) || '').localeCompare((a.title && a.title[l]) || '', l);
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

  function renderChips() {
    const wrap = document.getElementById('news-chips');
    if (!wrap) return;
    const d = dict();
    wrap.replaceChildren();
    const items = [{ id: 'all', label: d['common.all'] || 'All' }];
    categories().forEach(function (c) {
      items.push({ id: c.id, label: c.name ? (c.name[lang()] || c.name.ar) : c.id });
    });
    items.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (item.id === state.category ? ' is-active' : '');
      btn.textContent = item.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', item.id === state.category ? 'true' : 'false');
      btn.addEventListener('click', function () {
        state.category = item.id;
        state.page = 1;
        renderChips();
        render();
      });
      wrap.appendChild(btn);
    });
  }

  function renderActiveFilters() {
    const wrap = document.getElementById('active-filters');
    if (!wrap) return;
    const d = dict();
    wrap.replaceChildren();
    const hasFilter = state.category !== 'all' || state.query.trim() !== '';
    if (!hasFilter) { wrap.hidden = true; return; }
    wrap.hidden = false;
    if (state.category !== 'all') {
      wrap.appendChild(makePill(categoryName(state.category), function () {
        state.category = 'all'; state.page = 1; renderChips(); render();
      }));
    }
    if (state.query.trim() !== '') {
      wrap.appendChild(makePill('"' + state.query.trim() + '"', function () {
        state.query = ''; state.page = 1; syncSearchInput(); render();
      }));
    }
    const clearAll = document.createElement('button');
    clearAll.type = 'button';
    clearAll.className = 'filters-clear-all';
    clearAll.textContent = d['newsPage.clearAll'] || 'Clear all';
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
    state.category = 'all';
    state.query = '';
    state.page = 1;
    syncSearchInput();
    renderChips();
    render();
  }
  function syncSearchInput() {
    const input = document.getElementById('news-search');
    const clearBtn = document.getElementById('news-search-clear');
    if (input && input.value !== state.query) input.value = state.query;
    if (clearBtn) clearBtn.hidden = state.query.length === 0;
  }

  function buildCard(item) {
    const l = lang();
    const d = dict();
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';
    const article = document.createElement('article');
    article.className = 'news-tile';
    const media = document.createElement('div');
    media.className = 'news-tile__media';
    if (item.image) {
      const img = document.createElement('img');
      img.src = window.aoiAsset(item.image);
      img.alt = (item.title && item.title[l]) || '';
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        img.remove();
        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-newspaper';
        icon.setAttribute('aria-hidden', 'true');
        media.appendChild(icon);
      });
      media.appendChild(img);
    } else {
      const icon = document.createElement('i');
      icon.className = 'fa-regular fa-newspaper';
      icon.setAttribute('aria-hidden', 'true');
      media.appendChild(icon);
    }
    if (item.isSample) {
      const badge = document.createElement('span');
      badge.className = 'news-tile__badge';
      badge.textContent = d['common.sample'] || 'Sample';
      media.appendChild(badge);
    }
    const body = document.createElement('div');
    body.className = 'news-tile__body';
    const meta = document.createElement('div');
    meta.className = 'news-tile__meta';
    const dateText = formatDate(item.publishedAt);
    if (dateText) {
      const span = document.createElement('span');
      const i = document.createElement('i');
      i.className = 'fa-regular fa-calendar';
      i.setAttribute('aria-hidden', 'true');
      const t = document.createElement('span');
      t.textContent = dateText;
      span.appendChild(i);
      span.appendChild(t);
      meta.appendChild(span);
    }
    if (meta.children.length) body.appendChild(meta);
    const cat = document.createElement('span');
    cat.className = 'news-tile__category';
    cat.textContent = categoryName(item.category);
    const title = document.createElement('h3');
    title.className = 'news-tile__title';
    const link = document.createElement('a');
    link.href = 'news-details.html?id=' + encodeURIComponent(item.id);
    link.textContent = (item.title && item.title[l]) || '';
    title.appendChild(link);
    const text = document.createElement('p');
    text.className = 'news-tile__text';
    text.textContent = (item.excerpt && item.excerpt[l]) || '';
    const cta = document.createElement('a');
    cta.className = 'news-tile__cta';
    cta.href = 'news-details.html?id=' + encodeURIComponent(item.id);
    const ctaLabel = document.createElement('span');
    ctaLabel.textContent = d['common.readMore'] || 'Read More';
    const arrow = document.createElement('i');
    arrow.className = 'fa-solid fa-arrow-left';
    arrow.setAttribute('aria-hidden', 'true');
    cta.appendChild(ctaLabel);
    cta.appendChild(arrow);
    body.appendChild(cat);
    body.appendChild(title);
    body.appendChild(text);
    body.appendChild(cta);
    article.appendChild(media);
    article.appendChild(body);
    col.appendChild(article);
    return col;
  }

  function renderPagination(totalPages) {
    const nav = document.getElementById('news-pagination');
    if (!nav) return;
    nav.replaceChildren();
    if (totalPages <= 1) return;

    const prev = pagerBtn('prev', false);
    prev.disabled = state.page === 1;
    prev.addEventListener('click', function () {
      if (state.page > 1) { state.page--; render(); }
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
        btn.addEventListener('click', function () { state.page = p; render(); });
        nav.appendChild(btn);
      }
    });

    const next = pagerBtn('next', false);
    next.disabled = state.page === totalPages;
    next.addEventListener('click', function () {
      if (state.page < totalPages) { state.page++; render(); }
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

  function hasAnySample(records) {
    return records.some(function (r) { return r && r.isSample === true; });
  }

  function render() {
    const grid = document.getElementById('news-grid');
    const empty = document.getElementById('news-empty');
    const countEl = document.getElementById('news-count');
    const sampleTag = document.getElementById('news-sample-tag');
    if (!grid || !empty) return;

    const all = sorted(filtered());
    const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PER_PAGE;
    const slice = all.slice(start, start + PER_PAGE);

    grid.replaceChildren();
    slice.forEach(function (n) { grid.appendChild(buildCard(n)); });

    empty.hidden = all.length !== 0;
    grid.hidden = all.length === 0;

    if (countEl) countEl.textContent = String(all.length);
    if (sampleTag) sampleTag.hidden = !hasAnySample(slice);
    renderPagination(totalPages);
    renderActiveFilters();
  }

  function bindEvents() {
    const input = document.getElementById('news-search');
    const clearBtn = document.getElementById('news-search-clear');
    const sort = document.getElementById('news-sort');
    const resetEmpty = document.getElementById('news-empty-reset');

    if (input) {
      let timer = null;
      input.addEventListener('input', function () {
        clearTimeout(timer);
        const v = input.value;
        timer = setTimeout(function () {
          state.query = v;
          state.page = 1;
          if (clearBtn) clearBtn.hidden = v.length === 0;
          render();
        }, 180);
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        state.query = '';
        state.page = 1;
        syncSearchInput();
        render();
      });
    }
    if (sort) {
      sort.addEventListener('change', function () {
        state.sort = sort.value || 'default';
        state.page = 1;
        render();
      });
    }
    if (resetEmpty) resetEmpty.addEventListener('click', resetFilters);
  }

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