/* AOI — renders real data (fields, projects, news, footer contact) on the home page. Bilingual. */
(function () {
  'use strict';
  function lang() { return (window.AOISettings && AOISettings.getLanguage()) || 'ar'; }
  function t(o) { return (o && (o[lang()] || o.ar || o.en)) || ''; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function icon(c) { var i = el('i', c); i.setAttribute('aria-hidden', 'true'); return i; }
  function asset(u) { return /^(https?:)?\/\//.test(u) ? u : u; }
  function media(cls, src, alt, fb) {
    var m = el('div', cls);
    if (src) {
      var img = el('img'); img.src = asset(src); img.alt = alt || ''; img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.onerror = function () { img.remove(); m.classList.add(cls + '--placeholder'); m.appendChild(icon(fb)); };
      m.appendChild(img);
    } else { m.classList.add(cls + '--placeholder'); m.appendChild(icon(fb)); }
    return m;
  }
  function col(cls, child) { var c = el('div', cls); c.appendChild(child); return c; }
  function row(id) {
    var s = document.querySelector('section[aria-labelledby="' + id + '"]'); if (!s) return null;
    var tag = s.querySelector('.sample-tag'); if (tag) tag.remove();
    return { section: s, row: s.querySelector('.row') };
  }
  function viewAll(section, href) { var a = section.querySelector('.link-arrow'); if (a) a.setAttribute('href', href); }
  function fmt(d) {
    if (!d) return ''; var x = new Date(d); if (isNaN(x)) return '';
    return x.toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function fields() {
    var track = document.getElementById('fields-track');
    var list = window.AOI_DATA_FIELDS || window.AOI_HOME_FIELDS;
    if (!track || !Array.isArray(list) || !list.length) return;
    var section = document.querySelector('section[aria-labelledby="fields-title"]');
    if (section) viewAll(section, 'pages/industrial-fields.html');

    track.replaceChildren();
    list.forEach(function (f) {
      var slide = el('div', 'fields-carousel__slide');
      slide.setAttribute('role', 'listitem');
      var a = el('a', 'image-card tilt field-tile fields-carousel__card');
      a.href = 'pages/industrial-fields.html';
      a.appendChild(media('image-card__media', f.image || null, t(f.title), 'fa-solid ' + (f.icon || 'fa-industry')));
      var b = el('div', 'image-card__body');
      b.appendChild(el('span', 'image-card__tag', lang() === 'ar' ? 'مجال صناعي' : 'Industrial field'));
      b.appendChild(el('h3', 'image-card__title', t(f.title)));
      if (f.description) b.appendChild(el('p', 'image-card__text', t(f.description)));
      a.appendChild(b);
      slide.appendChild(a);
      track.appendChild(slide);
    });

    if (window.AOIFieldsCarousel && typeof window.AOIFieldsCarousel.refresh === 'function') {
      window.AOIFieldsCarousel.refresh();
    }
  }
  function projects() {
    var r = row('projects-title'); if (!r || !r.row || !Array.isArray(window.AOI_PROJECTS)) return;
    viewAll(r.section, 'pages/projects.html');
    var cats = window.AOI_PROJECT_CATEGORIES || [];
    r.row.replaceChildren.apply(r.row, window.AOI_PROJECTS.slice(0, 3).map(function (p) {
      var a = el('a', 'image-card image-card--overlay tilt'); a.href = 'pages/project-details.html?id=' + encodeURIComponent(p.id);
      a.appendChild(media('image-card__media', p.image, t(p.title), 'fa-solid fa-industry'));
      var c = cats.filter(function (x) { return x.id === p.category; })[0];
      var b = el('div', 'image-card__body');
      b.append(el('span', 'image-card__tag', c ? t(c.name) : ''), el('h3', 'image-card__title', t(p.title)), el('p', 'image-card__text', t(p.shortDescription)));
      a.appendChild(b); return col('col-12 col-md-6 col-lg-4', a);
    }));
  }
  function news() {
    var r = row('news-title'); if (!r || !r.row || !Array.isArray(window.AOI_NEWS)) return;
    viewAll(r.section, 'pages/news.html');
    var cats = window.AOI_NEWS_CATEGORIES || [];
    var list = window.AOI_NEWS.slice().sort(function (a, b) { return (b.publishedAt || '').localeCompare(a.publishedAt || ''); }).slice(0, 3);
    r.row.replaceChildren.apply(r.row, list.map(function (n) {
      var a = el('a', 'news-card tilt'); a.href = 'pages/news-details.html?id=' + encodeURIComponent(n.id);
      a.appendChild(media('news-card__media', n.image, t(n.title), 'fa-regular fa-newspaper'));
      var b = el('div', 'news-card__body'), m = el('div', 'news-card__meta');
      var d = el('span'); d.append(icon('fa-regular fa-calendar'), el('span', null, fmt(n.publishedAt))); if (n.publishedAt) m.appendChild(d);
      var c = cats.filter(function (x) { return x.id === n.category; })[0];
      if (c) { var s = el('span'); s.append(icon('fa-solid fa-tag'), el('span', null, t(c.name))); m.appendChild(s); }
      b.append(m, el('h3', 'news-card__title', t(n.title)), el('p', 'news-card__text', t(n.excerpt)));
      a.appendChild(b); return col('col-12 col-md-6 col-lg-4', a);
    }));
  }
  function footer() {
    var i = window.AOI_CONTACT_INFO; if (!i || i.isPlaceholder) return;
    var set = function (k, v) { var e = document.querySelector('[data-i18n="' + k + '"]'); if (e && v) { e.removeAttribute('data-i18n'); e.textContent = v; } };
    set('footer.address', t(i.address)); set('footer.phone', i.phone && i.phone.replace('+20', '0')); set('footer.email', i.email);
  }
  function products() {
    var r = row('products-title'); if (!r || !r.row || !Array.isArray(window.AOI_PRODUCTS)) return;
    var ar = lang() === 'ar';
    document.getElementById('products-eyebrow').textContent = ar ? 'منتجاتنا' : 'Our products';
    document.getElementById('products-title').textContent = ar ? 'منتجات الهيئة' : 'AOI Products';
    document.getElementById('products-all').textContent = ar ? 'عرض كل المنتجات' : 'View all products';
    var cats = window.AOI_PRODUCT_CATEGORIES || [];
    var list = window.AOI_PRODUCTS.filter(function (p) { return p.image; }).slice(0, 8);
    r.row.replaceChildren.apply(r.row, list.map(function (p) {
      var a = el('a', 'image-card tilt'); a.href = 'pages/product-details.html?id=' + encodeURIComponent(p.id);
      var m = media('image-card__media', p.image, t(p.name), 'fa-solid fa-box'); m.classList.add('product-media'); a.appendChild(m);
      var c = cats.filter(function (x) { return x.id === p.category; })[0];
      var b = el('div', 'image-card__body');
      b.append(el('span', 'image-card__tag', c ? t(c.name) : ''), el('h3', 'image-card__title', t(p.name)));
      a.appendChild(b); return col('col-12 col-sm-6 col-lg-3', a);
    }));
  }
  function hero() {
    var slides = window.AOI_HERO_SLIDES || [];
    document.querySelectorAll('.hero-slide').forEach(function (s, i) {
      var d = slides[i]; if (!d) return;
      var bg = s.querySelector('.hero-slide__bg'); if (bg && d.image) bg.style.backgroundImage = 'url("' + d.image + '")';
      s.classList.remove('hero-slide--pattern');
      var cta = s.querySelector('.hero-slide__actions a[href="#"]'); if (cta && d.cta) cta.setAttribute('href', d.cta);
    });
  }
  function all() { fields(); products(); projects(); news(); }
  document.addEventListener('DOMContentLoaded', function () { hero(); all(); footer(); document.addEventListener('aoi:language', all); });
})();
