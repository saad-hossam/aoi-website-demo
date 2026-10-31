/* ============================================================
   AOI Frontend — assets/js/pages/news-details.js
   Reads ?id=, renders article + share + prev/next + related.
   Handles missing/invalid IDs, missing images, unsupported Web
   Share gracefully. Re-renders on language change. Safe DOM.
   ============================================================ */
'use strict';

(function () {
  let currentId = null;

  document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('nd-root');
    if (!root) return;

    currentId = new URLSearchParams(window.location.search).get('id');
    renderAll();
    document.addEventListener('aoi:language', renderAll);
    initReveal();
  });

  /* ---------------- helpers ---------------- */
  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function news() { return Array.isArray(window.AOI_NEWS) ? window.AOI_NEWS : []; }
  function categories() { return Array.isArray(window.AOI_NEWS_CATEGORIES) ? window.AOI_NEWS_CATEGORIES : []; }

  function findItem(id) {
    if (!id) return null;
    return news().find(function (n) { return n.id === id; }) || null;
  }
  function categoryName(id) {
    const l = lang();
    const cat = categories().find(function (c) { return c.id === id; });
    return cat && cat.name ? (cat.name[l] || cat.name.ar || id) : id;
  }
  function formatDate(iso) {
    if (!iso) return '';
    const t = Date.parse(iso);
    if (isNaN(t)) return '';
    try {
      return new Date(t).toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-GB', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) { return ''; }
  }

  function relatedFor(item) {
    if (!item) return [];
    // Prefer shared category, fall back to shared tags, then chronological slice.
    const pool = news().filter(function (n) { return n.id !== item.id; });
    const sameCat = pool.filter(function (n) { return n.category === item.category; });
    const sameTag = pool.filter(function (n) {
      return !sameCat.includes(n) && Array.isArray(n.tags) &&
        Array.isArray(item.tags) && n.tags.some(function (t) { return item.tags.includes(t); });
    });
    return sameCat.concat(sameTag).slice(0, 3);
  }

  /* ---------------- render ---------------- */
  function renderAll() {
    const root = document.getElementById('nd-root');
    if (!root) return;
    const item = findItem(currentId);
    root.replaceChildren();

    if (!item) {
      root.appendChild(buildMissing());
      updateBreadcrumb(null);
      updateMeta(null);
      return;
    }
    updateBreadcrumb(item);
    updateMeta(item);

    const container = document.createElement('div');
    container.className = 'container';

    if (item.isSample) {
      const note = document.createElement('div');
      note.className = 'sample-tag';
      note.setAttribute('role', 'note');
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-circle-info';
      icon.setAttribute('aria-hidden', 'true');
      const span = document.createElement('span');
      span.textContent = dict()['common.placeholderData'] || 'Placeholder data';
      note.appendChild(icon);
      note.appendChild(span);
      container.appendChild(note);
    }

    container.appendChild(buildArticle(item));

    // Prev / Next
    const nav = buildPrevNext(item);
    if (nav) container.appendChild(nav);

    // Related
    const rel = buildRelatedSection(item);
    if (rel) container.appendChild(rel);

    root.appendChild(container);
  }

  function updateBreadcrumb(item) {
    const el = document.getElementById('breadcrumb-current');
    if (!el) return;
    if (item) {
      el.textContent = (item.title && item.title[lang()]) || '';
      el.removeAttribute('data-i18n');
    } else {
      el.setAttribute('data-i18n', 'newsDetailsPage.title');
      el.textContent = dict()['newsDetailsPage.title'] || 'News Details';
    }
  }

  function updateMeta(item) {
    const ar = 'الهيئة العربية للتصنيع';
    const en = 'Arab Organization for Industrialization';
    const suffix = lang() === 'ar' ? (' | ' + ar) : (' | ' + en);
    if (!item) {
      document.title = (dict()['newsDetailsPage.title'] || 'News Details') + suffix;
      return;
    }
    const title = (item.title && item.title[lang()]) || '';
    document.title = title + suffix;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      const excerpt = (item.excerpt && item.excerpt[lang()]) || '';
      if (excerpt) desc.setAttribute('content', excerpt);
    }
  }

  /* ---------------- article ---------------- */
  function buildArticle(item) {
    const l = lang();
    const d = dict();
    const wrap = document.createElement('article');
    wrap.className = 'article';

    // Header
    const eyebrow = document.createElement('span');
    eyebrow.className = 'article__eyebrow';
    eyebrow.textContent = categoryName(item.category);

    const title = document.createElement('h2');
    title.className = 'article__title';
    title.textContent = (item.title && item.title[l]) || '';

    wrap.appendChild(eyebrow);
    wrap.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'article__meta';
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
    if (meta.children.length) wrap.appendChild(meta);

    // Gallery (cover + extra images)
    const imgs = [].concat(item.image ? [item.image] : []).concat(Array.isArray(item.gallery) ? item.gallery : [])
      .filter(function (x, i, arr) { return x && arr.indexOf(x) === i; });
    if (imgs.length) wrap.appendChild(window.AOIGallery.create(imgs, (item.title && item.title[l]) || '', 'fa-regular fa-newspaper'));

    // Body
    const body = document.createElement('div');
    body.className = 'article__body';
    const blocks = (item.content && item.content[l]) || [];
    blocks.forEach(function (block) {
      body.appendChild(renderBlock(block));
    });
    wrap.appendChild(body);

    // Share row
    wrap.appendChild(buildShareRow(item));

    // Back link
    const backWrap = document.createElement('div');
    backWrap.style.marginTop = 'var(--space-5)';
    const back = document.createElement('a');
    back.className = 'btn btn-aoi btn-aoi--primary';
    back.href = 'news.html';
    back.textContent = d['newsDetailsPage.backToNews'] || 'Back to News';
    backWrap.appendChild(back);
    wrap.appendChild(backWrap);

    return wrap;
  }

  function renderBlock(block) {
    if (typeof block === 'string') {
      const p = document.createElement('p');
      p.textContent = block;
      return p;
    }
    if (block && block.type === 'h2') {
      const h = document.createElement('h3');
      h.textContent = block.text || '';
      return h;
    }
    if (block && block.type === 'h3') {
      const h = document.createElement('h4');
      h.textContent = block.text || '';
      return h;
    }
    if (block && block.type === 'ul' && Array.isArray(block.items)) {
      const ul = document.createElement('ul');
      block.items.forEach(function (txt) {
        const li = document.createElement('li');
        li.textContent = txt;
        ul.appendChild(li);
      });
      return ul;
    }
    if (block && block.type === 'blockquote') {
      const q = document.createElement('blockquote');
      q.textContent = block.text || '';
      return q;
    }
    // Unknown block — render as paragraph with string form
    const p = document.createElement('p');
    p.textContent = String(block && (block.text || ''));
    return p;
  }

  /* ---------------- share row ---------------- */
  function buildShareRow(item) {
    const d = dict();
    const row = document.createElement('div');
    row.className = 'share-row';

    const label = document.createElement('span');
    label.className = 'share-row__label';
    label.textContent = d['newsDetailsPage.share'] || 'Share';
    row.appendChild(label);

    // Copy link
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'share-btn';
    const copyIcon = document.createElement('i');
    copyIcon.className = 'fa-solid fa-link';
    copyIcon.setAttribute('aria-hidden', 'true');
    const copyText = document.createElement('span');
    copyText.textContent = d['newsDetailsPage.copyLink'] || 'Copy Link';
    copyBtn.appendChild(copyIcon);
    copyBtn.appendChild(copyText);

    const toast = document.createElement('span');
    toast.className = 'share-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    const toastIcon = document.createElement('i');
    toastIcon.className = 'fa-solid fa-circle-check';
    toastIcon.setAttribute('aria-hidden', 'true');
    const toastText = document.createElement('span');
    toastText.textContent = d['newsDetailsPage.copied'] || 'Link copied';
    toast.appendChild(toastIcon);
    toast.appendChild(toastText);

    copyBtn.addEventListener('click', function () {
      copyToClipboard(window.location.href).then(function (ok) {
        if (!ok) return;
        toast.classList.add('is-visible');
        setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
      });
    });

    row.appendChild(copyBtn);

    // Native share (only if available)
    if (navigator.share) {
      const shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.className = 'share-btn';
      const shareIcon = document.createElement('i');
      shareIcon.className = 'fa-solid fa-share-nodes';
      shareIcon.setAttribute('aria-hidden', 'true');
      const shareText = document.createElement('span');
      shareText.textContent = d['newsDetailsPage.shareNative'] || 'Share';
      shareBtn.appendChild(shareIcon);
      shareBtn.appendChild(shareText);

      shareBtn.addEventListener('click', function () {
        const l = lang();
        navigator.share({
          title: (item.title && item.title[l]) || document.title,
          url: window.location.href
        }).catch(function () { /* user cancelled or unsupported — no-op */ });
      });
      row.appendChild(shareBtn);
    }

    row.appendChild(toast);
    return row;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ---------------- prev / next ---------------- */
  function buildPrevNext(item) {
    // Use source-order list (post-filtering is not available here; use full list)
    const all = news();
    const idx = all.findIndex(function (n) { return n.id === item.id; });
    if (idx === -1 || all.length < 2) return null;

    const prev = idx > 0 ? all[idx - 1] : null;
    const next = idx < all.length - 1 ? all[idx + 1] : null;
    if (!prev && !next) return null;

    const d = dict();
    const l = lang();

    const nav = document.createElement('nav');
    nav.className = 'article-nav';
    nav.setAttribute('aria-label', 'Article navigation');

    if (prev) {
      const a = document.createElement('a');
      a.className = 'article-nav__link';
      a.href = 'news-details.html?id=' + encodeURIComponent(prev.id);
      const icon = document.createElement('span');
      icon.className = 'article-nav__icon';
      const i = document.createElement('i');
      i.className = 'fa-solid fa-arrow-right';
      i.setAttribute('aria-hidden', 'true');
      icon.appendChild(i);
      const text = document.createElement('span');
      text.className = 'article-nav__text';
      const label = document.createElement('span');
      label.className = 'article-nav__label';
      label.textContent = d['newsDetailsPage.prev'] || 'Previous';
      const t = document.createElement('span');
      t.className = 'article-nav__title';
      t.textContent = (prev.title && prev.title[l]) || '';
      text.appendChild(label);
      text.appendChild(t);
      a.appendChild(icon);
      a.appendChild(text);
      nav.appendChild(a);
    }

    if (next) {
      const a = document.createElement('a');
      a.className = 'article-nav__link article-nav__link--next';
      a.href = 'news-details.html?id=' + encodeURIComponent(next.id);
      const icon = document.createElement('span');
      icon.className = 'article-nav__icon';
      const i = document.createElement('i');
      i.className = 'fa-solid fa-arrow-left';
      i.setAttribute('aria-hidden', 'true');
      icon.appendChild(i);
      const text = document.createElement('span');
      text.className = 'article-nav__text';
      const label = document.createElement('span');
      label.className = 'article-nav__label';
      label.textContent = d['newsDetailsPage.next'] || 'Next';
      const t = document.createElement('span');
      t.className = 'article-nav__title';
      t.textContent = (next.title && next.title[l]) || '';
      text.appendChild(label);
      text.appendChild(t);
      a.appendChild(icon);
      a.appendChild(text);
      nav.appendChild(a);
    }

    return nav;
  }

  /* ---------------- related ---------------- */
  function buildRelatedSection(item) {
    const d = dict();
    const l = lang();
    const related = relatedFor(item);

    const section = document.createElement('section');
    section.className = 'related-news';

    const head = document.createElement('div');
    head.className = 'section-head section-head--split';
    const titleWrap = document.createElement('div');
    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = d['common.related'] || 'Related';
    const h2 = document.createElement('h2');
    h2.className = 'section-title';
    h2.textContent = d['newsDetailsPage.relatedTitle'] || 'Related News';
    titleWrap.appendChild(eyebrow);
    titleWrap.appendChild(h2);
    head.appendChild(titleWrap);
    section.appendChild(head);

    if (related.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state empty-state--page';
      empty.setAttribute('role', 'status');
      const icon = document.createElement('i');
      icon.className = 'fa-regular fa-newspaper empty-state__icon';
      icon.setAttribute('aria-hidden', 'true');
      const title = document.createElement('p');
      title.className = 'empty-state__title';
      title.textContent = d['newsDetailsPage.noRelatedTitle'] || 'No related news yet';
      const text = document.createElement('p');
      text.className = 'empty-state__text';
      text.textContent = d['newsDetailsPage.noRelatedText'] || 'Related articles will appear here when available.';
      empty.appendChild(icon);
      empty.appendChild(title);
      empty.appendChild(text);
      section.appendChild(empty);
      return section;
    }

    const row = document.createElement('div');
    row.className = 'row g-4';
    related.forEach(function (n) { row.appendChild(buildRelatedCard(n)); });
    section.appendChild(row);
    return section;
  }

  function buildRelatedCard(item) {
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

    const cat = document.createElement('span');
    cat.className = 'news-tile__category';
    cat.textContent = categoryName(item.category);

    const title = document.createElement('h3');
    title.className = 'news-tile__title';
    const link = document.createElement('a');
    link.href = 'news-details.html?id=' + encodeURIComponent(item.id);
    link.textContent = (item.title && item.title[l]) || '';
    title.appendChild(link);

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
    body.appendChild(cta);
    article.appendChild(media);
    article.appendChild(body);
    col.appendChild(article);
    return col;
  }

  /* ---------------- missing ---------------- */
  function buildMissing() {
    const wrap = document.createElement('div');
    wrap.className = 'container';
    const card = document.createElement('div');
    card.className = 'article-missing';
    card.setAttribute('role', 'status');

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass article-missing__icon';
    icon.setAttribute('aria-hidden', 'true');
    const title = document.createElement('p');
    title.className = 'article-missing__title';
    title.textContent = dict()['newsDetailsPage.notFoundTitle'] || 'Article not found';
    const text = document.createElement('p');
    text.className = 'article-missing__text';
    text.textContent = dict()['newsDetailsPage.notFoundText'] || 'The article you requested does not exist or is no longer available.';
    const back = document.createElement('a');
    back.className = 'btn btn-aoi btn-aoi--primary';
    back.href = 'news.html';
    back.textContent = dict()['newsDetailsPage.backToNews'] || 'Back to News';

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(back);
    wrap.appendChild(card);
    return wrap;
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