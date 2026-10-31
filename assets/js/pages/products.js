/* ============================================================
   AOI Frontend — assets/js/pages/products.js
   Phase 15 patch: the sample tag is now data-driven. It only
   appears when at least one visible record has isSample: true.
   ============================================================ */
'use strict';

(function () {
  const PER_PAGE = 6;

  const state = {
    category: (function () {
      var c = new URLSearchParams(window.location.search).get('category');
      var ok = c && Array.isArray(window.AOI_PRODUCT_CATEGORIES) && window.AOI_PRODUCT_CATEGORIES.some(function (x) { return x.id === c; });
      return ok ? c : 'all';
    })(),
    query: '',
    sort: 'default',
    page: 1
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('product-grid')) return;

    renderChips();
    render();
    bindEvents();
    document.addEventListener('aoi:language', function () {
      renderChips();
      render();
    });
    initReveal();
  });

  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function products() { return Array.isArray(window.AOI_PRODUCTS) ? window.AOI_PRODUCTS : []; }
  function categories() { return Array.isArray(window.AOI_PRODUCT_CATEGORIES) ? window.AOI_PRODUCT_CATEGORIES : []; }

  function categoryName(id) {
    const l = lang();
    const cat = categories().find(function (c) { return c.id === id; });
    return cat && cat.name ? (cat.name[l] || cat.name.ar || id) : id;
  }

  function filtered() {
    const l = lang();
    const q = state.query.trim().toLowerCase();
    return products().filter(function (p) {
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (!q) return true;
      const name = (p.name && p.name[l]) || '';
      const desc = (p.shortDescription && p.shortDescription[l]) || '';
      const cat = categoryName(p.category);
      return (name + ' ' + desc + ' ' + cat).toLowerCase().indexOf(q) !== -1;
    });
  }

  function sorted(arr) {
    const l = lang();
    const copy = arr.slice();
    if (state.sort === 'name-asc') {
      copy.sort(function (a, b) {
        return ((a.name && a.name[l]) || '').localeCompare((b.name && b.name[l]) || '', l);
      });
    } else if (state.sort === 'name-desc') {
      copy.sort(function (a, b) {
        return ((b.name && b.name[l]) || '').localeCompare((a.name && a.name[l]) || '', l);
      });
    }
    return copy;
  }

  function renderChips() {
    const wrap = document.getElementById('product-chips');
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
    if (hasFilter) {
      const clearAll = document.createElement('button');
      clearAll.type = 'button';
      clearAll.className = 'filters-clear-all';
      clearAll.textContent = d['productsPage.clearAll'] || 'Clear all';
      clearAll.addEventListener('click', resetFilters);
      wrap.appendChild(clearAll);
    }
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
    const input = document.getElementById('product-search');
    const clearBtn = document.getElementById('product-search-clear');
    if (input && input.value !== state.query) input.value = state.query;
    if (clearBtn) clearBtn.hidden = state.query.length === 0;
  }

  function buildCard(product) {
    const l = lang();
    const d = dict();

    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';

    const article = document.createElement('article');
    article.className = 'product-tile';

    const media = document.createElement('div');
    media.className = 'product-tile__media';
    if (product.image) {
      const img = document.createElement('img');
      img.src = window.aoiAsset(product.image);
      img.alt = (product.name && product.name[l]) || '';
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        img.remove();
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-box';
        icon.setAttribute('aria-hidden', 'true');
        media.appendChild(icon);
      });
      media.appendChild(img);
    } else {
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-box';
      icon.setAttribute('aria-hidden', 'true');
      media.appendChild(icon);
    }
    if (product.isSample) {
      const badge = document.createElement('span');
      badge.className = 'product-tile__badge';
      badge.textContent = d['common.sample'] || 'Sample';
      media.appendChild(badge);
    }

    const body = document.createElement('div');
    body.className = 'product-tile__body';

    const cat = document.createElement('span');
    cat.className = 'product-tile__category';
    cat.textContent = categoryName(product.category);

    const title = document.createElement('h2');
    title.className = 'product-tile__title';
    const link = document.createElement('a');
    link.href = 'product-details.html?id=' + encodeURIComponent(product.id);
    link.textContent = (product.name && product.name[l]) || '';
    title.appendChild(link);

    const text = document.createElement('p');
    text.className = 'product-tile__text';
    text.textContent = (product.shortDescription && product.shortDescription[l]) || '';

    const cta = document.createElement('a');
    cta.className = 'product-tile__cta';
    cta.href = 'product-details.html?id=' + encodeURIComponent(product.id);
    const ctaLabel = document.createElement('span');
    ctaLabel.textContent = d['common.viewDetails'] || 'View Details';
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
    const nav = document.getElementById('product-pagination');
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
        btn.addEventListener('click', function () {
          state.page = p; render();
        });
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

  /* ---- NEW: sample tag now driven by data ---- */
  function hasAnySample(records) {
    return records.some(function (r) { return r && r.isSample === true; });
  }

  function render() {
    const grid = document.getElementById('product-grid');
    const empty = document.getElementById('product-empty');
    const countEl = document.getElementById('product-count');
    const sampleTag = document.getElementById('product-sample-tag');
    if (!grid || !empty) return;

    const all = sorted(filtered());
    const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PER_PAGE;
    const slice = all.slice(start, start + PER_PAGE);

    grid.replaceChildren();
    slice.forEach(function (p) { grid.appendChild(buildCard(p)); });

    empty.hidden = all.length !== 0;
    grid.hidden = all.length === 0;

    if (countEl) countEl.textContent = String(all.length);
    if (sampleTag) sampleTag.hidden = !hasAnySample(slice);
    renderPagination(totalPages);
    renderActiveFilters();
  }

  function bindEvents() {
    const input = document.getElementById('product-search');
    const clearBtn = document.getElementById('product-search-clear');
    const sort = document.getElementById('product-sort');
    const resetEmpty = document.getElementById('product-empty-reset');

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