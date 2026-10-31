/* ============================================================
   AOI Frontend — assets/js/pages/projects.js
   Phase 15 patch: conditional sample tag.
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
    if (!document.getElementById('project-grid')) return;

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
  function projects() { return Array.isArray(window.AOI_PROJECTS) ? window.AOI_PROJECTS : []; }
  function categories() { return Array.isArray(window.AOI_PROJECT_CATEGORIES) ? window.AOI_PROJECT_CATEGORIES : []; }

  function categoryName(id) {
    const l = lang();
    const cat = categories().find(function (c) { return c.id === id; });
    return cat && cat.name ? (cat.name[l] || cat.name.ar || id) : id;
  }

  function statusLabel(status) {
    if (!status) return '';
    const d = dict();
    if (status === 'ongoing') return d['projectsPage.statusOngoing'] || 'Ongoing';
    if (status === 'completed') return d['projectsPage.statusCompleted'] || 'Completed';
    return '';
  }
  function formatLocation(loc) {
    if (!loc) return '';
    return typeof loc === 'object' ? (loc[lang()] || loc.ar || '') : String(loc);
  }

  function filtered() {
    const l = lang();
    const q = state.query.trim().toLowerCase();
    return projects().filter(function (p) {
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (!q) return true;
      const title = (p.title && p.title[l]) || '';
      const desc = (p.shortDescription && p.shortDescription[l]) || '';
      const cat = categoryName(p.category);
      const loc = formatLocation(p.location);
      return (title + ' ' + desc + ' ' + cat + ' ' + loc).toLowerCase().indexOf(q) !== -1;
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
    }
    return copy;
  }

  function renderChips() {
    const wrap = document.getElementById('project-chips');
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
    clearAll.textContent = d['projectsPage.clearAll'] || 'Clear all';
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
    const input = document.getElementById('project-search');
    const clearBtn = document.getElementById('project-search-clear');
    if (input && input.value !== state.query) input.value = state.query;
    if (clearBtn) clearBtn.hidden = state.query.length === 0;
  }

  function buildCard(project) {
    const l = lang();
    const d = dict();
    const closed = false; // replaced by isClosed(job) only in Phase 4 version; harmless

    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';

    const article = document.createElement('article');
    article.className = 'project-tile';

    const media = document.createElement('div');
    media.className = 'project-tile__media';
    if (project.image) {
      const img = document.createElement('img');
      img.src = window.aoiAsset(project.image);
      img.alt = (project.title && project.title[l]) || '';
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        img.remove();
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-diagram-project';
        icon.setAttribute('aria-hidden', 'true');
        media.appendChild(icon);
      });
      media.appendChild(img);
    } else {
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-diagram-project';
      icon.setAttribute('aria-hidden', 'true');
      media.appendChild(icon);
    }
    if (project.isSample) {
      const badge = document.createElement('span');
      badge.className = 'project-tile__badge';
      badge.textContent = d['common.sample'] || 'Sample';
      media.appendChild(badge);
    }
    const statusText = statusLabel(project.status);
    if (statusText) {
      const st = document.createElement('span');
      st.className = 'project-tile__status';
      st.textContent = statusText;
      media.appendChild(st);
    }

    const body = document.createElement('div');
    body.className = 'project-tile__body';

    const cat = document.createElement('span');
    cat.className = 'project-tile__category';
    cat.textContent = categoryName(project.category);

    const title = document.createElement('h2');
    title.className = 'project-tile__title';
    const link = document.createElement('a');
    link.href = 'project-details.html?id=' + encodeURIComponent(project.id);
    link.textContent = (project.title && project.title[l]) || '';
    title.appendChild(link);

    const text = document.createElement('p');
    text.className = 'project-tile__text';
    text.textContent = (project.shortDescription && project.shortDescription[l]) || '';

    body.appendChild(cat);
    body.appendChild(title);
    body.appendChild(text);

    const loc = formatLocation(project.location);
    if (loc) {
      const meta = document.createElement('div');
      meta.className = 'project-tile__meta';
      const locEl = document.createElement('span');
      const locIcon = document.createElement('i');
      locIcon.className = 'fa-solid fa-location-dot';
      locIcon.setAttribute('aria-hidden', 'true');
      const locText = document.createElement('span');
      locText.textContent = loc;
      locEl.appendChild(locIcon);
      locEl.appendChild(locText);
      meta.appendChild(locEl);
      body.appendChild(meta);
    }

    const cta = document.createElement('a');
    cta.className = 'project-tile__cta';
    cta.href = 'project-details.html?id=' + encodeURIComponent(project.id);
    const ctaLabel = document.createElement('span');
    ctaLabel.textContent = d['common.viewDetails'] || 'View Details';
    const arrow = document.createElement('i');
    arrow.className = 'fa-solid fa-arrow-left';
    arrow.setAttribute('aria-hidden', 'true');
    cta.appendChild(ctaLabel);
    cta.appendChild(arrow);
    body.appendChild(cta);

    article.appendChild(media);
    article.appendChild(body);
    col.appendChild(article);
    return col;
  }

  function renderPagination(totalPages) {
    const nav = document.getElementById('project-pagination');
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
    const grid = document.getElementById('project-grid');
    const empty = document.getElementById('project-empty');
    const countEl = document.getElementById('project-count');
    const sampleTag = document.getElementById('project-sample-tag');
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
    const input = document.getElementById('project-search');
    const clearBtn = document.getElementById('project-search-clear');
    const sort = document.getElementById('project-sort');
    const resetEmpty = document.getElementById('project-empty-reset');

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