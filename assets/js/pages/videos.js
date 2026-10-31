/* ============================================================
   AOI Frontend — assets/js/pages/videos.js
   Videos listing + featured + search + category + sort +
   pagination + player modal + media gallery + lightbox.
   Re-renders on language change. Safe DOM. Sample tag driven
   by data (currently all videos are isSample: true because no
   verified video sources exist).
   ============================================================ */
'use strict';

(function () {
  const PER_PAGE = 6;

  const state = {
    category: 'all',
    query: '',
    sort: 'default',
    page: 1,
    selectedId: null
  };

  let lastFocusedBeforeModal = null;
  let lastFocusedBeforeLightbox = null;
  let lightboxIndex = 0;

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('video-grid')) return;

    renderFeatured();
    renderChips();
    renderGrid();
    renderGallery();
    bindControls();
    bindModal();
    bindLightbox();

    document.addEventListener('aoi:language', function () {
      renderFeatured();
      renderChips();
      renderGrid();
      renderGallery();
    });
    initReveal();
  });

  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function videos() { return Array.isArray(window.AOI_VIDEOS) ? window.AOI_VIDEOS : []; }
  function categories() { return Array.isArray(window.AOI_VIDEO_CATEGORIES) ? window.AOI_VIDEO_CATEGORIES : []; }
  function images() { return Array.isArray(window.AOI_MEDIA_IMAGES) ? window.AOI_MEDIA_IMAGES : []; }

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
  function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function hasSource(v) {
    if (!v || !v.sourceType) return false;
    if (v.sourceType === 'file') return !!v.videoUrl;
    if (v.sourceType === 'youtube' || v.sourceType === 'vimeo') return !!v.embedUrl;
    return false;
  }

  function resolveMedia(u) {
    if (!u) return '';
    if (/^(https?:)?\/\//i.test(u) || u.startsWith('data:') || u.startsWith('blob:')) return u;
    return '../' + u.replace(/^\.\//, '');
  }


  function hasAnySample(records) {
    return records.some(function (r) { return r && r.isSample === true; });
  }

  /* ---------------- featured ---------------- */
  function renderFeatured(selected) {
    const host = document.getElementById('video-featured');
    if (!host) return;
    host.replaceChildren();

    const list = videos();
    let featured = selected || null;
    if (!featured && state.selectedId) {
      featured = list.find(function (v) { return v.id === state.selectedId; }) || null;
    }
    if (!featured) {
      featured = list.find(function (v) { return v.featured; }) || list[0] || null;
    }
    if (!featured) return;
    state.selectedId = featured.id;

    const l = lang();
    const d = dict();
    const wrap = document.createElement('article');
    wrap.className = 'featured-video video-library__current';

    const media = document.createElement('div');
    media.className = 'featured-video__media';
    const canPlay = hasSource(featured);

    if (canPlay && featured.embedUrl && (featured.sourceType === 'youtube' || featured.sourceType === 'vimeo')) {
      media.classList.add('featured-video__media--embed');
      media.style.position = 'relative';
      media.style.aspectRatio = '16 / 9';
      media.style.background = '#0b1220';
      const iframe = document.createElement('iframe');
      iframe.src = featured.embedUrl;
      iframe.title = (featured.title && featured.title[l]) || 'Video';
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:inherit;';
      media.appendChild(iframe);
    } else {
      if (featured.thumbnail) {
        const img = document.createElement('img');
        img.src = resolveMedia(featured.thumbnail);
        img.alt = (featured.title && featured.title[l]) || '';
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', function () {
          img.remove();
          const i = document.createElement('i');
          i.className = 'fa-solid fa-video';
          i.setAttribute('aria-hidden', 'true');
          media.appendChild(i);
        });
        media.appendChild(img);
      } else {
        const i = document.createElement('i');
        i.className = 'fa-solid fa-video';
        i.setAttribute('aria-hidden', 'true');
        media.appendChild(i);
      }

      const playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.className = 'video-tile__play' + (canPlay ? '' : ' video-tile__play--unavailable');
      playBtn.setAttribute('aria-label',
        canPlay
          ? (d['videosPage.play'] || 'Play') + ': ' + ((featured.title && featured.title[l]) || '')
          : (d['videosPage.unavailable'] || 'Source unavailable'));
      if (canPlay) {
        playBtn.addEventListener('click', function () { openVideoModal(featured); });
      } else {
        playBtn.disabled = true;
      }
      const icon = document.createElement('i');
      icon.className = canPlay ? 'fa-solid fa-play' : 'fa-solid fa-ban';
      icon.setAttribute('aria-hidden', 'true');
      playBtn.appendChild(icon);
      media.appendChild(playBtn);
    }

    const badge = document.createElement('span');
    badge.className = 'featured-video__badge';
    badge.textContent = d['videosPage.featuredBadge'] || 'Now playing';
    media.appendChild(badge);

    const body = document.createElement('div');
    body.className = 'featured-video__body';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'featured-video__eyebrow';
    eyebrow.textContent = categoryName(featured.category);

    const title = document.createElement('h2');
    title.className = 'featured-video__title';
    title.textContent = (featured.title && featured.title[l]) || '';

    const textEl = document.createElement('p');
    textEl.className = 'featured-video__text';
    textEl.textContent = (featured.description && featured.description[l]) || '';

    body.appendChild(eyebrow);
    body.appendChild(title);
    body.appendChild(textEl);

    if (!canPlay) {
      const note = document.createElement('div');
      note.className = 'video-tile__unavailable';
      note.textContent = d['videosPage.unavailableNote'] || 'Video source is not available for this demonstration.';
      body.appendChild(note);
    }

    wrap.appendChild(media);
    wrap.appendChild(body);
    host.appendChild(wrap);
  }

  /* ---------------- filtering & sorting ---------------- */
  function filtered() {
    const l = lang();
    const q = state.query.trim().toLowerCase();
    return videos().filter(function (v) {
      if (state.category !== 'all' && v.category !== state.category) return false;
      if (!q) return true;
      const title = (v.title && v.title[l]) || '';
      const desc = (v.description && v.description[l]) || '';
      const cat = categoryName(v.category);
      return (title + ' ' + desc + ' ' + cat).toLowerCase().indexOf(q) !== -1;
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
    const wrap = document.getElementById('video-chips');
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
        renderGrid();
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
        state.category = 'all'; state.page = 1; renderChips(); renderGrid();
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
    clearAll.textContent = d['videosPage.clearAll'] || 'Clear all';
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
    renderGrid();
  }

  function syncSearchInput() {
    const input = document.getElementById('video-search');
    const clearBtn = document.getElementById('video-search-clear');
    if (input && input.value !== state.query) input.value = state.query;
    if (clearBtn) clearBtn.hidden = state.query.length === 0;
  }

  function buildCard(video) {
    const l = lang();
    const d = dict();
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'video-playlist__item' + (video.id === state.selectedId ? ' is-active' : '');
    row.setAttribute('data-video-id', video.id);
    row.setAttribute('aria-pressed', video.id === state.selectedId ? 'true' : 'false');

    const media = document.createElement('div');
    media.className = 'video-playlist__thumb';
    if (video.thumbnail) {
      const img = document.createElement('img');
      img.src = resolveMedia(video.thumbnail);
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        img.remove();
        const i = document.createElement('i');
        i.className = 'fa-solid fa-video';
        i.setAttribute('aria-hidden', 'true');
        media.appendChild(i);
      });
      media.appendChild(img);
    } else {
      const i = document.createElement('i');
      i.className = 'fa-solid fa-video';
      i.setAttribute('aria-hidden', 'true');
      media.appendChild(i);
    }
    const dur = formatDuration(video.duration);
    if (dur) {
      const durEl = document.createElement('span');
      durEl.className = 'video-playlist__duration';
      durEl.textContent = dur;
      media.appendChild(durEl);
    }

    const body = document.createElement('div');
    body.className = 'video-playlist__body';

    const title = document.createElement('div');
    title.className = 'video-playlist__title';
    title.textContent = (video.title && video.title[l]) || '';

    const meta = document.createElement('div');
    meta.className = 'video-playlist__meta';
    const parts = [categoryName(video.category)];
    const dateText = formatDate(video.publishedAt);
    if (dateText) parts.push(dateText);
    meta.textContent = parts.filter(Boolean).join(' · ');

    body.appendChild(title);
    body.appendChild(meta);

    row.appendChild(media);
    row.appendChild(body);

    row.addEventListener('click', function () {
      state.selectedId = video.id;
      renderFeatured(video);
      document.querySelectorAll('.video-playlist__item').forEach(function (el) {
        const on = el.getAttribute('data-video-id') === video.id;
        el.classList.toggle('is-active', on);
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var stage = document.getElementById('video-featured');
      if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    return row;
  }

  function renderPagination(totalPages) {
    const nav = document.getElementById('video-pagination');
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

  function renderGrid() {
    const grid = document.getElementById('video-grid');
    const empty = document.getElementById('video-empty');
    const countEl = document.getElementById('video-count');
    const sampleTag = document.querySelector('.sample-tag');
    if (!grid || !empty) return;

    const all = sorted(filtered());
    const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PER_PAGE;
    const slice = all.slice(start, start + PER_PAGE);

    grid.replaceChildren();
    slice.forEach(function (v) { grid.appendChild(buildCard(v)); });

    empty.hidden = all.length !== 0;
    grid.hidden = all.length === 0;

    if (countEl) countEl.textContent = String(all.length);
    if (sampleTag) sampleTag.hidden = !hasAnySample(all);
    renderPagination(totalPages);
    renderActiveFilters();
  }

  function bindControls() {
    const input = document.getElementById('video-search');
    const clearBtn = document.getElementById('video-search-clear');
    const sort = document.getElementById('video-sort');
    const resetEmpty = document.getElementById('video-empty-reset');

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

  function openVideoModal(video) {
    if (!hasSource(video)) return;
    const modal = document.getElementById('video-modal');
    const titleEl = document.getElementById('video-modal-title');
    const bodyEl = document.getElementById('video-modal-body');
    if (!modal || !titleEl || !bodyEl) return;

    const l = lang();
    titleEl.textContent = (video.title && video.title[l]) || '';

    bodyEl.replaceChildren();
    if (video.sourceType === 'youtube' || video.sourceType === 'vimeo') {
      const iframe = document.createElement('iframe');
      iframe.src = video.embedUrl;
      iframe.title = (video.title && video.title[l]) || 'Video';
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      bodyEl.appendChild(iframe);
    } else if (video.sourceType === 'file') {
      const vid = document.createElement('video');
      vid.src = resolveMedia(video.videoUrl);
      vid.controls = true;
      vid.preload = 'metadata';
      vid.setAttribute('playsinline', '');
      bodyEl.appendChild(vid);
    }

    lastFocusedBeforeModal = document.activeElement;
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('video-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const bodyEl = document.getElementById('video-modal-body');
    if (!modal) return;
    if (bodyEl) bodyEl.replaceChildren();
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
      lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
  }

  function bindModal() {
    const closeBtn = document.getElementById('video-modal-close');
    const modal = document.getElementById('video-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeVideoModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (modal && modal.classList.contains('is-open')) closeVideoModal();
      const lb = document.getElementById('media-lightbox');
      if (lb && lb.classList.contains('is-open')) closeLightbox();
    });
  }

  function renderGallery() {
    const section = document.getElementById('media-gallery-section');
    const host = document.getElementById('media-gallery');
    if (!section || !host) return;
    const list = images();
    if (list.length === 0) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    host.replaceChildren();
    list.forEach(function (img, idx) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'media-thumb';
      btn.setAttribute('aria-label',
        (dict()['videosPage.viewImage'] || 'View image') + ' ' + (idx + 1));
      btn.addEventListener('click', function () { openLightbox(idx); });
      if (img.src) {
        const i = document.createElement('img');
        i.src = resolveMedia(img.src);
        i.alt = img.alt ? (img.alt[lang()] || '') : '';
        i.loading = 'lazy';
        i.addEventListener('error', function () {
          i.remove();
          const icon = document.createElement('i');
          icon.className = 'fa-regular fa-image';
          icon.setAttribute('aria-hidden', 'true');
          btn.appendChild(icon);
        });
        btn.appendChild(i);
      } else {
        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-image';
        icon.setAttribute('aria-hidden', 'true');
        btn.appendChild(icon);
      }
      host.appendChild(btn);
    });
  }

  function openLightbox(idx) {
    const lb = document.getElementById('media-lightbox');
    if (!lb) return;
    lightboxIndex = idx;
    applyLightboxImage();
    lastFocusedBeforeLightbox = document.activeElement;
    lb.hidden = false;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const close = document.getElementById('media-lightbox-close');
    if (close) close.focus();
  }

  function closeLightbox() {
    const lb = document.getElementById('media-lightbox');
    if (!lb) return;
    lb.classList.remove('is-open');
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedBeforeLightbox && typeof lastFocusedBeforeLightbox.focus === 'function') {
      lastFocusedBeforeLightbox.focus();
    }
    lastFocusedBeforeLightbox = null;
  }

  function stepLightbox(delta) {
    const list = images();
    if (list.length === 0) return;
    lightboxIndex = (lightboxIndex + delta + list.length) % list.length;
    applyLightboxImage();
  }

  function applyLightboxImage() {
    const list = images();
    const img = list[lightboxIndex];
    const imgEl = document.getElementById('media-lightbox-img');
    const capEl = document.getElementById('media-lightbox-caption');
    if (!img || !imgEl) return;
    imgEl.src = img.src ? resolveMedia(img.src) : '';
    imgEl.alt = img.alt ? (img.alt[lang()] || '') : '';
    if (capEl) capEl.textContent = img.caption ? (img.caption[lang()] || '') : '';
  }

  function bindLightbox() {
    const closeBtn = document.getElementById('media-lightbox-close');
    const prevBtn = document.getElementById('media-lightbox-prev');
    const nextBtn = document.getElementById('media-lightbox-next');
    const lb = document.getElementById('media-lightbox');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { stepLightbox(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stepLightbox(1); });
    if (lb) {
      lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
      });
    }
    document.addEventListener('keydown', function (e) {
      const el = document.getElementById('media-lightbox');
      if (!el || !el.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      else if (e.key === 'ArrowRight') stepLightbox(1);
    });
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