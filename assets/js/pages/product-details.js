/* ============================================================
   AOI Frontend — assets/js/pages/product-details.js
   Reads ?id=, renders product details + gallery + related.
   Handles missing/invalid IDs gracefully. Re-renders on language
   change. Safe DOM construction.
   ============================================================ */
'use strict';

(function () {
  let currentId = null;
  let currentGalleryIndex = 0;

  document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('pd-root');
    if (!root) return; // not on details page

    currentId = new URLSearchParams(window.location.search).get('id');
    renderAll();
    document.addEventListener('aoi:language', function () {
      renderAll();
    });
    initReveal();
  });

  /* ---------------- helpers ---------------- */
  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function products() { return Array.isArray(window.AOI_PRODUCTS) ? window.AOI_PRODUCTS : []; }
  function categories() { return Array.isArray(window.AOI_PRODUCT_CATEGORIES) ? window.AOI_PRODUCT_CATEGORIES : []; }

  function findProduct(id) {
    if (!id) return null;
    return products().find(function (p) { return p.id === id; }) || null;
  }
  function categoryName(id) {
    const l = lang();
    const cat = categories().find(function (c) { return c.id === id; });
    return cat && cat.name ? (cat.name[l] || cat.name.ar || id) : id;
  }

  function relatedFor(product) {
    if (!product) return [];
    return products()
      .filter(function (p) { return p.id !== product.id && p.category === product.category; })
      .slice(0, 3);
  }

  /* ---------------- render ---------------- */
  function renderAll() {
    const root = document.getElementById('pd-root');
    if (!root) return;
    const product = findProduct(currentId);
    root.replaceChildren();

    if (!product) {
      root.appendChild(buildMissing());
      updateBreadcrumb(null);
      return;
    }
    updateBreadcrumb(product);

    const container = document.createElement('div');
    container.className = 'container';

    if (product.isSample) {
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

    // Main grid
    const grid = document.createElement('div');
    grid.className = 'pd-grid';
    grid.appendChild(buildGallery(product));
    grid.appendChild(buildInfo(product));
    container.appendChild(grid);

    // Related
    const relatedSection = buildRelatedSection(product);
    if (relatedSection) container.appendChild(relatedSection);

    root.appendChild(container);
  }

  function updateBreadcrumb(product) {
    const el = document.getElementById('breadcrumb-current');
    if (!el) return;
    if (product) {
      el.textContent = (product.name && product.name[lang()]) || '';
      el.removeAttribute('data-i18n');
    } else {
      el.setAttribute('data-i18n', 'productDetailsPage.title');
      el.textContent = dict()['productDetailsPage.title'] || 'Product Details';
    }
  }

  /* ---------------- gallery ---------------- */
  function buildGallery(product) {
    const images = [].concat(product.image ? [product.image] : []).concat(Array.isArray(product.gallery) ? product.gallery : [])
      .filter(function (x, i, a) { return x && a.indexOf(x) === i; });
    return window.AOIGallery.create(images, (product.name && product.name[lang()]) || '', 'fa-solid fa-box');
  }

  /* ---------------- info column ---------------- */
  function buildInfo(product) {
    const l = lang();
    const d = dict();
    const wrap = document.createElement('div');
    wrap.className = 'pd-info';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'pd-info__eyebrow';
    eyebrow.textContent = categoryName(product.category);

    const title = document.createElement('h2');
    title.className = 'pd-info__title';
    title.textContent = (product.name && product.name[l]) || '';

    const lead = document.createElement('p');
    lead.className = 'pd-info__lead';
    lead.textContent = (product.shortDescription && product.shortDescription[l]) || '';

    wrap.appendChild(eyebrow);
    wrap.appendChild(title);
    wrap.appendChild(lead);

    // Description
    const desc = (product.description && product.description[l]) || '';
    if (desc) {
      const sec = document.createElement('section');
      sec.className = 'pd-section';
      sec.appendChild(sectionTitle('fa-align-start', d['productDetailsPage.description'] || 'Description'));
      const p = document.createElement('p');
      p.className = 'pd-section__text';
      p.textContent = desc;
      sec.appendChild(p);
      wrap.appendChild(sec);
    }

    // Specifications
    if (Array.isArray(product.specifications) && product.specifications.length) {
      const sec = document.createElement('section');
      sec.className = 'pd-section';
      sec.appendChild(sectionTitle('fa-list-check', d['productDetailsPage.specifications'] || 'Specifications'));
      const grid = document.createElement('div');
      grid.className = 'pd-specs';
      product.specifications.forEach(function (spec) {
        const row = document.createElement('div');
        row.className = 'pd-spec';
        const label = document.createElement('div');
        label.className = 'pd-spec__label';
        label.textContent = (spec.label && spec.label[l]) || '';
        const value = document.createElement('div');
        value.className = 'pd-spec__value';
        value.textContent = (spec.value && spec.value[l]) || '';
        row.appendChild(label);
        row.appendChild(value);
        grid.appendChild(row);
      });
      sec.appendChild(grid);
      wrap.appendChild(sec);
    }

    // Features
    if (Array.isArray(product.features) && product.features.length) {
      const sec = document.createElement('section');
      sec.className = 'pd-section';
      sec.appendChild(sectionTitle('fa-star', d['productDetailsPage.features'] || 'Features'));
      const list = document.createElement('ul');
      list.className = 'pd-list';
      product.features.forEach(function (f) {
        const li = document.createElement('li');
        li.textContent = (f && f[l]) || '';
        if (li.textContent) list.appendChild(li);
      });
      if (list.children.length) {
        sec.appendChild(list);
        wrap.appendChild(sec);
      }
    }

    // Applications
    if (Array.isArray(product.applications) && product.applications.length) {
      const sec = document.createElement('section');
      sec.className = 'pd-section';
      sec.appendChild(sectionTitle('fa-cogs', d['productDetailsPage.applications'] || 'Applications'));
      const list = document.createElement('ul');
      list.className = 'pd-list';
      product.applications.forEach(function (a) {
        const li = document.createElement('li');
        li.textContent = (a && a[l]) || '';
        if (li.textContent) list.appendChild(li);
      });
      if (list.children.length) {
        sec.appendChild(list);
        wrap.appendChild(sec);
      }
    }

    // Actions
    const actions = document.createElement('div');
    actions.className = 'pd-actions';

    const back = document.createElement('a');
    back.className = 'btn btn-aoi btn-aoi--primary';
    back.href = 'products.html';
    back.textContent = d['productDetailsPage.backToProducts'] || 'Back to Products';
    actions.appendChild(back);

    const catLink = document.createElement('a');
    catLink.className = 'btn btn-aoi btn-aoi--gold';
    catLink.href = 'products.html';
    catLink.textContent = (d['productDetailsPage.browseCategory'] || 'Browse Category') + ' · ' + categoryName(product.category);
    actions.appendChild(catLink);

    wrap.appendChild(actions);
    return wrap;
  }

  function sectionTitle(iconClass, text) {
    const h = document.createElement('h3');
    h.className = 'pd-section__title';
    const i = document.createElement('i');
    i.className = 'fa-solid ' + iconClass;
    i.setAttribute('aria-hidden', 'true');
    const span = document.createElement('span');
    span.textContent = text;
    h.appendChild(i);
    h.appendChild(span);
    return h;
  }

  /* ---------------- related ---------------- */
  function buildRelatedSection(product) {
    const d = dict();
    const l = lang();
    const related = relatedFor(product);

    const section = document.createElement('section');
    section.className = 'pd-related';

    const head = document.createElement('div');
    head.className = 'section-head section-head--split';
    const titleWrap = document.createElement('div');
    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = d['common.related'] || 'Related';
    const h2 = document.createElement('h2');
    h2.className = 'section-title';
    h2.textContent = d['productDetailsPage.relatedTitle'] || 'Related Products';
    titleWrap.appendChild(eyebrow);
    titleWrap.appendChild(h2);
    head.appendChild(titleWrap);
    section.appendChild(head);

    if (related.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state empty-state--page';
      empty.setAttribute('role', 'status');
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-cubes empty-state__icon';
      icon.setAttribute('aria-hidden', 'true');
      const title = document.createElement('p');
      title.className = 'empty-state__title';
      title.textContent = d['productDetailsPage.noRelatedTitle'] || 'No related products yet';
      const text = document.createElement('p');
      text.className = 'empty-state__text';
      text.textContent = d['productDetailsPage.noRelatedText'] || 'Related products will appear here when available.';
      empty.appendChild(icon);
      empty.appendChild(title);
      empty.appendChild(text);
      section.appendChild(empty);
      return section;
    }

    const row = document.createElement('div');
    row.className = 'row g-4';
    related.forEach(function (p) {
      row.appendChild(buildRelatedCard(p));
    });
    section.appendChild(row);
    return section;
  }

  function buildRelatedCard(product) {
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

    const title = document.createElement('h3');
    title.className = 'product-tile__title';
    const link = document.createElement('a');
    link.href = 'product-details.html?id=' + encodeURIComponent(product.id);
    link.textContent = (product.name && product.name[l]) || '';
    title.appendChild(link);

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
    body.appendChild(cta);
    article.appendChild(media);
    article.appendChild(body);
    col.appendChild(article);
    return col;
  }

  /* ---------------- missing product ---------------- */
  function buildMissing() {
    const wrap = document.createElement('div');
    wrap.className = 'container';
    const card = document.createElement('div');
    card.className = 'pd-missing';
    card.setAttribute('role', 'status');

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass pd-missing__icon';
    icon.setAttribute('aria-hidden', 'true');
    const title = document.createElement('p');
    title.className = 'pd-missing__title';
    title.textContent = dict()['productDetailsPage.notFoundTitle'] || 'Product not found';
    const text = document.createElement('p');
    text.className = 'pd-missing__text';
    text.textContent = dict()['productDetailsPage.notFoundText'] || 'The product you requested does not exist or is no longer available.';
    const back = document.createElement('a');
    back.className = 'btn btn-aoi btn-aoi--primary';
    back.href = 'products.html';
    back.textContent = dict()['productDetailsPage.backToProducts'] || 'Back to Products';

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