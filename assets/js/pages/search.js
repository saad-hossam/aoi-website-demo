/* ============================================================
   AOI Frontend — assets/js/pages/search.js
   Global search: reads ?q=, filters by type, sorts, renders
   safe result cards, autocomplete with keyboard nav.
   Arabic-aware normalization. No innerHTML with user input.
   Re-renders on language change.
   ============================================================ */
'use strict';

(function () {
  const MAX_SUGGESTIONS = 8;

  const state = {
    query: '',
    type: 'all',
    sort: 'relevance'
  };

  // Autocomplete state
  let suggestItems = [];
  let activeSuggestIndex = -1;

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('search-input')) return;

    // 1) Read ?q= and initialize state
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q') || '';
    if (qParam) {
      state.query = qParam;
      const input = document.getElementById('search-input');
      if (input) input.value = qParam;
    }

    renderChips();
    render();
    bindEvents();
    document.addEventListener('aoi:language', function () {
      renderChips();
      render();
    });
    initReveal();
  });

  /* ---------------- helpers ---------------- */
  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function index() { return Array.isArray(window.AOI_SEARCH_INDEX) ? window.AOI_SEARCH_INDEX : []; }
  function types() { return window.AOI_SEARCH_TYPES || {}; }

  function localized(value) {
    if (!value) return '';
    if (typeof value === 'object') return value[lang()] || value.ar || '';
    return String(value);
  }

  /* ---------------- Arabic-aware normalization ---------------- */
  function normalize(text) {
    if (!text) return '';
    let t = String(text);
    try { t = t.normalize('NFKD'); } catch (e) { /* noop */ }
    t = t.replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, '');
    t = t.replace(/[إأآٱ]/g, 'ا');
    t = t.replace(/ة/g, 'ه');
    t = t.replace(/[ىئ]/g, 'ي');
    t = t.replace(/ک/g, 'ك');
    t = t.replace(/\s+/g, ' ').trim().toLowerCase();
    return t;
  }

  /* ---------------- filtering / sorting ---------------- */
  function filterByQuery(records, q) {
    const nq = normalize(q);
    if (!nq) return records;
    return records.filter(function (r) {
      const hay = normalize(
        localized(r.title) + ' ' +
        localized(r.excerpt) + ' ' +
        localized(r.keywords)
      );
      return hay.indexOf(nq) !== -1;
    });
  }

  function filterByType(records, type) {
    if (type === 'all') return records;
    return records.filter(function (r) { return r.type === type; });
  }

  function relevanceScore(record, q) {
    const nq = normalize(q);
    if (!nq) return 0;
    const t = normalize(localized(record.title));
    const e = normalize(localized(record.excerpt));
    let score = 0;
    if (t === nq) score += 100;
    else if (t.indexOf(nq) === 0) score += 60;
    else if (t.indexOf(nq) !== -1) score += 40;
    if (e.indexOf(nq) === 0) score += 20;
    else if (e.indexOf(nq) !== -1) score += 10;
    return score;
  }

  function sorted(records, q) {
    const copy = records.slice();
    if (state.sort === 'title-asc') {
      const l = lang();
      copy.sort(function (a, b) {
        return localized(a.title).localeCompare(localized(b.title), l);
      });
    } else if (state.sort === 'date-newest') {
      copy.sort(function (a, b) {
        const da = a.publishedAt ? Date.parse(a.publishedAt) : NaN;
        const db = b.publishedAt ? Date.parse(b.publishedAt) : NaN;
        const va = isNaN(da) ? -Infinity : da;
        const vb = isNaN(db) ? -Infinity : db;
        return vb - va;
      });
    } else {
      // relevance (default)
      const scoreMap = new Map();
      copy.forEach(function (r) { scoreMap.set(r.id, relevanceScore(r, q)); });
      copy.sort(function (a, b) {
        const diff = (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0);
        if (diff !== 0) return diff;
        // stable tie: source order
        return index().indexOf(a) - index().indexOf(b);
      });
    }
    return copy;
  }

  /* ---------------- get matching records ---------------- */
  function currentResults() {
    let records = index();
    records = filterByType(records, state.type);
    records = filterByQuery(records, state.query);
    return sorted(records, state.query);
  }

  /* ---------------- category chips ---------------- */
  function renderChips() {
    const wrap = document.getElementById('search-chips');
    if (!wrap) return;
    const d = dict();
    const all = index();

    // Count per type — only include types that have at least one record
    const counts = {};
    all.forEach(function (r) { counts[r.type] = (counts[r.type] || 0) + 1; });

    wrap.replaceChildren();

    const items = [{ id: 'all', label: d['searchPage.allTypes'] || 'All' }];
    const t = types();
    Object.keys(t).forEach(function (type) {
      if (counts[type]) items.push({ id: type, label: localized(t[type].label) + ' (' + counts[type] + ')' });
    });

    // If only one type exists (unlikely but possible), still show All + that type
    items.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (item.id === state.type ? ' is-active' : '');
      btn.textContent = item.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', item.id === state.type ? 'true' : 'false');
      btn.addEventListener('click', function () {
        state.type = item.id;
        renderChips();
        render();
      });
      wrap.appendChild(btn);
    });
  }

  /* ---------------- result card ---------------- */
  function buildCard(record) {
    const l = lang();
    const d = dict();
    const t = types()[record.type] || { label: { ar: '', en: '' }, icon: 'fa-file' };

    const card = document.createElement('article');
    card.className = 'result-card';

    // Thumbnail / icon
    const thumb = document.createElement('div');
    thumb.className = 'result-card__thumb';
    if (record.image) {
      const img = document.createElement('img');
      img.src = window.aoiAsset(record.image);
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        img.remove();
        const ic = document.createElement('i');
        ic.className = 'fa-solid ' + (t.icon || 'fa-file');
        ic.setAttribute('aria-hidden', 'true');
        thumb.appendChild(ic);
      });
      thumb.appendChild(img);
    } else {
      const ic = document.createElement('i');
      ic.className = 'fa-solid ' + (t.icon || 'fa-file');
      ic.setAttribute('aria-hidden', 'true');
      thumb.appendChild(ic);
    }

    // Body
    const body = document.createElement('div');
    body.className = 'result-card__body';

    const top = document.createElement('div');
    top.className = 'result-card__top';
    const typeBadge = document.createElement('span');
    typeBadge.className = 'result-card__type result-card__type--' + record.type;
    const ti = document.createElement('i');
    ti.className = 'fa-solid ' + (t.icon || 'fa-file');
    ti.setAttribute('aria-hidden', 'true');
    const tl = document.createElement('span');
    tl.textContent = localized(t.label);
    typeBadge.appendChild(ti);
    typeBadge.appendChild(tl);
    top.appendChild(typeBadge);

    if (record.publishedAt) {
      try {
        const dt = new Date(record.publishedAt);
        if (!isNaN(dt.getTime())) {
          const dateEl = document.createElement('span');
          dateEl.className = 'result-card__date';
          dateEl.textContent = dt.toLocaleDateString(l === 'ar' ? 'ar-EG' : 'en-GB', {
            year: 'numeric', month: 'short', day: 'numeric'
          });
          top.appendChild(dateEl);
        }
      } catch (e) { /* noop */ }
    }

    const title = document.createElement('h3');
    title.className = 'result-card__title';
    const titleLink = document.createElement('a');
    titleLink.href = record.url || '#';
    titleLink.textContent = localized(record.title);
    title.appendChild(titleLink);

    const excerpt = document.createElement('p');
    excerpt.className = 'result-card__text';
    const excerptText = localized(record.excerpt);
    excerpt.textContent = excerptText.length > 220 ? excerptText.slice(0, 220) + '…' : excerptText;

    const cta = document.createElement('a');
    cta.className = 'result-card__cta';
    cta.href = record.url || '#';
    const ctaLabel = document.createElement('span');
    ctaLabel.textContent = d['searchPage.openResult'] || 'Open';
    const arrow = document.createElement('i');
    arrow.className = 'fa-solid fa-arrow-left';
    arrow.setAttribute('aria-hidden', 'true');
    cta.appendChild(ctaLabel);
    cta.appendChild(arrow);

    body.appendChild(top);
    body.appendChild(title);
    if (excerptText) body.appendChild(excerpt);
    body.appendChild(cta);

    card.appendChild(thumb);
    card.appendChild(body);
    return card;
  }

  /* ---------------- render ---------------- */
  function render() {
    const results = document.getElementById('search-results');
    const intro = document.getElementById('search-intro');
    const empty = document.getElementById('search-empty');
    const countEl = document.getElementById('search-count');
    const sortWrap = document.getElementById('search-sort-wrap');
    const clearBtn = document.getElementById('search-clear');
    const queryDisplay = document.getElementById('search-query-display');
    if (!results || !intro || !empty) return;

    const hasQuery = state.query.trim() !== '';
    if (clearBtn) clearBtn.hidden = !hasQuery;

    if (queryDisplay) {
      queryDisplay.textContent = hasQuery ? ' — "' + state.query.trim() + '"' : '';
    }

    // Intro state — no query
    if (!hasQuery) {
      results.hidden = true;
      results.replaceChildren();
      empty.hidden = true;
      intro.hidden = false;
      if (sortWrap) sortWrap.hidden = true;
      if (countEl) countEl.textContent = '0';
      return;
    }

    intro.hidden = true;
    const list = currentResults();
    if (countEl) countEl.textContent = String(list.length);
    if (sortWrap) sortWrap.hidden = list.length === 0;

    if (list.length === 0) {
      results.hidden = true;
      results.replaceChildren();
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    results.hidden = false;
    results.replaceChildren();
    list.forEach(function (r) { results.appendChild(buildCard(r)); });
  }

  /* ---------------- autocomplete ---------------- */
  function buildSuggestions(q) {
    if (!q || q.trim().length < 2) return [];
    const nq = normalize(q);
    if (!nq) return [];
    const records = index();
    const scored = [];
    records.forEach(function (r) {
      const title = normalize(localized(r.title));
      if (!title) return;
      let score = -1;
      if (title === nq) score = 100;
      else if (title.indexOf(nq) === 0) score = 60;
      else if (title.indexOf(nq) !== -1) score = 40;
      if (score > 0) scored.push({ record: r, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, MAX_SUGGESTIONS).map(function (s) { return s.record; });
  }

  function renderSuggestions() {
    const host = document.getElementById('search-suggest');
    const input = document.getElementById('search-input');
    if (!host || !input) return;

    const q = input.value;
    suggestItems = buildSuggestions(q);
    activeSuggestIndex = -1;

    host.replaceChildren();

    if (suggestItems.length === 0) {
      host.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      return;
    }

    const l = lang();
    const t = types();

    suggestItems.forEach(function (r, idx) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'search-suggest__item';
      item.id = 'search-suggest-' + idx;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');

      const tt = t[r.type] || {};
      const ic = document.createElement('span');
      ic.className = 'search-suggest__icon';
      const i = document.createElement('i');
      i.className = 'fa-solid ' + (tt.icon || 'fa-file');
      i.setAttribute('aria-hidden', 'true');
      ic.appendChild(i);

      const text = document.createElement('span');
      text.className = 'search-suggest__text';
      const title = document.createElement('span');
      title.className = 'search-suggest__title';
      title.textContent = localized(r.title);
      const typeEl = document.createElement('span');
      typeEl.className = 'search-suggest__type';
      typeEl.textContent = localized(tt.label);
      text.appendChild(title);
      text.appendChild(typeEl);

      item.appendChild(ic);
      item.appendChild(text);

      // mousedown instead of click so it fires before the input loses focus
      item.addEventListener('mousedown', function (e) {
        e.preventDefault();
        navigateToRecord(r);
      });

      host.appendChild(item);
    });

    const foot = document.createElement('div');
    foot.className = 'search-suggest__foot';
    foot.textContent = dict()['searchPage.suggestHint'] || 'Press Enter to search';
    host.appendChild(foot);

    host.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function setActiveSuggestion(idx) {
    const host = document.getElementById('search-suggest');
    const input = document.getElementById('search-input');
    if (!host || !input) return;
    const items = host.querySelectorAll('.search-suggest__item');
    items.forEach(function (el, i) {
      el.classList.toggle('is-active', i === idx);
      el.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    if (idx >= 0 && items[idx]) {
      activeSuggestIndex = idx;
      input.setAttribute('aria-activedescendant', items[idx].id);
    } else {
      activeSuggestIndex = -1;
      input.removeAttribute('aria-activedescendant');
    }
  }

  function hideSuggestions() {
    const host = document.getElementById('search-suggest');
    const input = document.getElementById('search-input');
    if (host) host.hidden = true;
    if (input) {
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }
    activeSuggestIndex = -1;
  }

  function navigateToRecord(record) {
    if (!record || !record.url) return;
    window.location.href = record.url;
  }

  function submitSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    state.query = input.value.trim();
    hideSuggestions();

    // Update URL — replaceState to avoid history spam
    try {
      const url = new URL(window.location.href);
      if (state.query) url.searchParams.set('q', state.query);
      else url.searchParams.delete('q');
      window.history.replaceState({}, '', url.toString());
    } catch (e) { /* noop */ }

    render();
  }

  /* ---------------- events ---------------- */
  function bindEvents() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');
    const submitBtn = document.getElementById('search-submit');
    const sortSel = document.getElementById('search-sort');
    const emptyReset = document.getElementById('search-empty-reset');

    if (input) {
      let timer = null;
      input.addEventListener('input', function () {
        clearTimeout(timer);
        const v = input.value;
        if (clearBtn) clearBtn.hidden = v.length === 0;
        timer = setTimeout(function () {
          state.query = v.trim();
          render();
        }, 200);
        renderSuggestions();
      });
      input.addEventListener('focus', function () {
        if (input.value.trim().length >= 2) renderSuggestions();
      });
      input.addEventListener('blur', function () {
        // Delay so mousedown on a suggestion fires first
        setTimeout(hideSuggestions, 120);
      });
      input.addEventListener('keydown', function (e) {
        const host = document.getElementById('search-suggest');
        const open = host && !host.hidden;
        if (e.key === 'Escape') {
          hideSuggestions();
          return;
        }
        if (e.key === 'ArrowDown' && open) {
          e.preventDefault();
          const next = Math.min(activeSuggestIndex + 1, suggestItems.length - 1);
          setActiveSuggestion(next);
          return;
        }
        if (e.key === 'ArrowUp' && open) {
          e.preventDefault();
          const prev = Math.max(activeSuggestIndex - 1, -1);
          setActiveSuggestion(prev);
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (open && activeSuggestIndex >= 0 && suggestItems[activeSuggestIndex]) {
            navigateToRecord(suggestItems[activeSuggestIndex]);
          } else {
            submitSearch();
          }
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        const input = document.getElementById('search-input');
        if (input) input.value = '';
        state.query = '';
        clearBtn.hidden = true;
        hideSuggestions();
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('q');
          window.history.replaceState({}, '', url.toString());
        } catch (e) { /* noop */ }
        render();
        if (input) input.focus();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', submitSearch);
    }

    if (sortSel) {
      sortSel.addEventListener('change', function () {
        state.sort = sortSel.value || 'relevance';
        render();
      });
    }

    if (emptyReset) {
      emptyReset.addEventListener('click', function () {
        const input = document.getElementById('search-input');
        if (input) input.value = '';
        state.query = '';
        state.type = 'all';
        state.sort = 'relevance';
        if (sortSel) sortSel.value = 'relevance';
        hideSuggestions();
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('q');
          window.history.replaceState({}, '', url.toString());
        } catch (e) { /* noop */ }
        renderChips();
        render();
        if (input) input.focus();
      });
    }
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