/* ============================================================
   AOI Frontend — assets/js/data/search-index.js
   Builds window.AOI_SEARCH_INDEX from the SAME datasets already
   used by phases 3–13. No duplicated content. Add a product/
   project/article/video/FAQ anywhere → it appears in search
   automatically.

   IMPORTANT LOAD ORDER: this file must be loaded AFTER:
     data/products.js, data/projects.js, data/news.js,
     data/videos.js, data/faqs.js
   It reads those globals at build time.

   The index is an array of records:
     {
       id, type,              // type ∈ AOI_SEARCH_TYPES
       title: { ar, en },
       excerpt: { ar, en },
       keywords: { ar, en },  // extra searchable text (category, ref, etc.)
       url,                   // relative to /pages/, e.g. 'products.html' or 'product-details.html?id=product-001'
       publishedAt,           // ISO date or null
       image                  // path relative to project root, or null
     }

   The index rebuilds on every page load. When a Laravel API
   is wired, endpoint responses can be assigned to the same
   source globals before this file runs, or this file's
   `buildIndex` function can be called after fetching fresh data.
   ============================================================ */
'use strict';

(function () {
  /* -------------------- type definitions -------------------- */
  // A type is only included when its source dataset has records.
  window.AOI_SEARCH_TYPES = {
    product:  { categoryKey: 'product',  label: { ar: 'منتج',       en: 'Product' },       icon: 'fa-cubes' },
    project:  { categoryKey: 'project',  label: { ar: 'مشروع',      en: 'Project' },       icon: 'fa-diagram-project' },
    news:     { categoryKey: 'news',     label: { ar: 'خبر',        en: 'News' },          icon: 'fa-newspaper' },
    video:    { categoryKey: 'video',    label: { ar: 'فيديو',      en: 'Video' },         icon: 'fa-video' },
    faq:      { categoryKey: 'faq',      label: { ar: 'سؤال شائع',  en: 'FAQ' },           icon: 'fa-circle-question' }
  };

  /* -------------------- category name resolvers -------------------- */
  function resolveCategoryName(list, id, lang) {
    if (!Array.isArray(list)) return '';
    const cat = list.find(function (c) { return c && c.id === id; });
    if (!cat || !cat.name) return '';
    return cat.name[lang] || cat.name.ar || '';
  }

  /* -------------------- block array → plain text -------------------- */
  // News/FAQ content can be an array of blocks (news) or a string (FAQ).
  // Convert any shape to a plain string; used only for keyword matching.
  function contentToText(content, lang) {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (typeof content === 'object' && content[lang]) {
      const blocks = content[lang];
      if (typeof blocks === 'string') return blocks;
      if (Array.isArray(blocks)) {
        return blocks.map(function (b) {
          if (typeof b === 'string') return b;
          if (b && typeof b === 'object') {
            if (b.text) return b.text;
            if (Array.isArray(b.items)) return b.items.join(' ');
          }
          return '';
        }).filter(Boolean).join(' ');
      }
    }
    return '';
  }

  /* -------------------- index builders -------------------- */
  function buildProductsIndex() {
    const list = Array.isArray(window.AOI_PRODUCTS) ? window.AOI_PRODUCTS : [];
    const cats = window.AOI_PRODUCT_CATEGORIES || [];
    return list.map(function (p) {
      const catAr = resolveCategoryName(cats, p.category, 'ar');
      const catEn = resolveCategoryName(cats, p.category, 'en');
      return {
        id: 'product-' + p.id,
        type: 'product',
        title: p.name || { ar: '', en: '' },
        excerpt: p.shortDescription || { ar: '', en: '' },
        keywords: {
          ar: [catAr, p.reference || ''].filter(Boolean).join(' '),
          en: [catEn, p.reference || ''].filter(Boolean).join(' ')
        },
        url: 'product-details.html?id=' + encodeURIComponent(p.id),
        publishedAt: null,
        image: p.image || null
      };
    });
  }

  function buildProjectsIndex() {
    const list = Array.isArray(window.AOI_PROJECTS) ? window.AOI_PROJECTS : [];
    const cats = window.AOI_PROJECT_CATEGORIES || [];
    return list.map(function (p) {
      const catAr = resolveCategoryName(cats, p.category, 'ar');
      const catEn = resolveCategoryName(cats, p.category, 'en');
      return {
        id: 'project-' + p.id,
        type: 'project',
        title: p.title || { ar: '', en: '' },
        excerpt: p.shortDescription || { ar: '', en: '' },
        keywords: {
          ar: [catAr, p.reference || ''].filter(Boolean).join(' '),
          en: [catEn, p.reference || ''].filter(Boolean).join(' ')
        },
        url: 'project-details.html?id=' + encodeURIComponent(p.id),
        publishedAt: p.publishedAt || null,
        image: p.image || null
      };
    });
  }

  function buildNewsIndex() {
    const list = Array.isArray(window.AOI_NEWS) ? window.AOI_NEWS : [];
    const cats = window.AOI_NEWS_CATEGORIES || [];
    return list.map(function (n) {
      const catAr = resolveCategoryName(cats, n.category, 'ar');
      const catEn = resolveCategoryName(cats, n.category, 'en');
      const bodyAr = contentToText(n.content, 'ar');
      const bodyEn = contentToText(n.content, 'en');
      return {
        id: 'news-' + n.id,
        type: 'news',
        title: n.title || { ar: '', en: '' },
        excerpt: n.excerpt || { ar: '', en: '' },
        keywords: {
          ar: [catAr, bodyAr].filter(Boolean).join(' '),
          en: [catEn, bodyEn].filter(Boolean).join(' ')
        },
        url: 'news-details.html?id=' + encodeURIComponent(n.id),
        publishedAt: n.publishedAt || null,
        image: n.image || null
      };
    });
  }

  function buildVideosIndex() {
    const list = Array.isArray(window.AOI_VIDEOS) ? window.AOI_VIDEOS : [];
    const cats = window.AOI_VIDEO_CATEGORIES || [];
    return list.map(function (v) {
      const catAr = resolveCategoryName(cats, v.category, 'ar');
      const catEn = resolveCategoryName(cats, v.category, 'en');
      return {
        id: 'video-' + v.id,
        type: 'video',
        title: v.title || { ar: '', en: '' },
        excerpt: v.description || { ar: '', en: '' },
        keywords: {
          ar: catAr,
          en: catEn
        },
        url: 'videos.html',
        publishedAt: v.publishedAt || null,
        image: v.thumbnail || null
      };
    });
  }

  function buildFaqsIndex() {
    const list = Array.isArray(window.AOI_FAQS) ? window.AOI_FAQS : [];
    const cats = window.AOI_FAQ_CATEGORIES || [];
    return list.map(function (f) {
      const catAr = resolveCategoryName(cats, f.category, 'ar');
      const catEn = resolveCategoryName(cats, f.category, 'en');
      const ansAr = (f.answer && f.answer.ar) || '';
      const ansEn = (f.answer && f.answer.en) || '';
      return {
        id: 'faq-' + f.id,
        type: 'faq',
        title: f.question || { ar: '', en: '' },
        excerpt: f.answer || { ar: '', en: '' },
        keywords: {
          ar: [catAr, ansAr].filter(Boolean).join(' '),
          en: [catEn, ansEn].filter(Boolean).join(' ')
        },
        // FAQs are grouped on a single page; open the FAQ page filtered
        url: 'faq.html#' + encodeURIComponent(f.id),
        publishedAt: null,
        image: null
      };
    });
  }

  /* -------------------- orchestrator -------------------- */
  function buildIndex() {
    const result = [];
    // Order affects default ordering when relevance ties — put
    // more "primary" content first.
    result.push.apply(result, buildProductsIndex());
    result.push.apply(result, buildProjectsIndex());
    result.push.apply(result, buildNewsIndex());
    result.push.apply(result, buildVideosIndex());
    result.push.apply(result, buildFaqsIndex());
    return result;
  }

  window.AOI_SEARCH_INDEX = buildIndex();

  // Public API for future use — can be called after fetching
  // fresh data from a Laravel API to rebuild the index.
  window.AOI_SEARCH = {
    rebuild: function () {
      window.AOI_SEARCH_INDEX = buildIndex();
      document.dispatchEvent(new CustomEvent('aoi:search-index-rebuilt'));
    }
  };
})();