/* AOI Phase 4 — homepage-only progressive enhancements. */
'use strict';
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('#main-content');
    if (!main) return;

    // Add a compact, non-numeric institutional highlights band without replacing content.
    const ribbon = main.querySelector('.ribbon');
    if (ribbon && !main.querySelector('.home-focus-band')) {
      const band = document.createElement('section');
      band.className = 'home-focus-band container';
      band.setAttribute('aria-label', 'AOI strengths');
      band.innerHTML = `
        <div class="home-focus-band__inner">
          <div class="home-focus-item"><span class="home-focus-item__icon" aria-hidden="true"><i class="fa-solid fa-industry"></i></span><div><strong data-ar="التصنيع الوطني" data-en="National Manufacturing">التصنيع الوطني</strong><span data-ar="قدرات إنتاجية تدعم الصناعة المحلية" data-en="Production capabilities supporting local industry">قدرات إنتاجية تدعم الصناعة المحلية</span></div></div>
          <div class="home-focus-item"><span class="home-focus-item__icon" aria-hidden="true"><i class="fa-solid fa-gears"></i></span><div><strong data-ar="حلول هندسية متكاملة" data-en="Integrated Engineering">حلول هندسية متكاملة</strong><span data-ar="من التصميم والتطوير إلى التصنيع" data-en="From design and development to manufacturing">من التصميم والتطوير إلى التصنيع</span></div></div>
          <div class="home-focus-item"><span class="home-focus-item__icon" aria-hidden="true"><i class="fa-solid fa-handshake-angle"></i></span><div><strong data-ar="شراكات وتعاون" data-en="Partnership & Collaboration">شراكات وتعاون</strong><span data-ar="التعاون لبناء فرص صناعية مستدامة" data-en="Collaboration for sustainable industrial opportunities">التعاون لبناء فرص صناعية مستدامة</span></div></div>
        </div>`;
      ribbon.insertAdjacentElement('afterend', band);
      syncBandLanguage();
    }

    // Make in-page section links easier to identify for keyboard users.
    main.querySelectorAll('a[href^="#"]').forEach(function (link) {
      if (link.getAttribute('href') === '#') return;
      link.addEventListener('click', function () {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.setAttribute('tabindex', '-1');
      });
    });

    // Re-sync the added bilingual band whenever the existing language control changes.
    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-lang], [data-language], #lang-toggle, .language-toggle')) {
        window.setTimeout(syncBandLanguage, 80);
      }
    });
    document.addEventListener('languagechange', syncBandLanguage);
    const observer = new MutationObserver(syncBandLanguage);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });

    function syncBandLanguage() {
      const lang = (document.documentElement.lang || '').toLowerCase().startsWith('en') ? 'en' : 'ar';
      document.querySelectorAll('.home-focus-band [data-ar][data-en]').forEach(function (node) {
        node.textContent = node.getAttribute('data-' + lang) || node.textContent;
      });
    }
  });
})();

/* Home news — YouTube-style stage + sidebar */
(function () {
  function lang() {
    return (window.AOISettings && window.AOISettings.getLanguage)
      ? window.AOISettings.getLanguage()
      : ((document.documentElement.lang || 'ar').toLowerCase().startsWith('en') ? 'en' : 'ar');
  }

  function newsList() {
    const list = Array.isArray(window.AOI_NEWS) ? window.AOI_NEWS.slice() : [];
    return list.filter(function (n) { return n && n.id; });
  }

  function categoryName(id) {
    const cats = window.AOI_NEWS_CATEGORIES || [];
    const c = cats.find(function (x) { return x.id === id; });
    if (!c || !c.name) return id || '';
    return c.name[lang()] || c.name.ar || id;
  }

  function formatDate(iso) {
    if (!iso) return '';
    const t = Date.parse(iso);
    if (isNaN(t)) return '';
    try {
      return new Date(t).toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-GB', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) { return ''; }
  }

  function detailsHref(item) {
    if (!item || !item.slug) return 'pages/news.html';
    return 'pages/news-details.html?slug=' + encodeURIComponent(item.slug);
  }

  function mediaEl(src, big) {
    const wrap = document.createElement('div');
    wrap.className = big ? 'news-yt__main-media' : 'news-yt__item-thumb';
    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        img.remove();
        const i = document.createElement('i');
        i.className = 'fa-regular fa-newspaper placeholder-icon';
        i.setAttribute('aria-hidden', 'true');
        wrap.appendChild(i);
      });
      wrap.appendChild(img);
    } else {
      const i = document.createElement('i');
      i.className = 'fa-regular fa-newspaper placeholder-icon';
      i.setAttribute('aria-hidden', 'true');
      wrap.appendChild(i);
    }
    return wrap;
  }

  function renderMain(item) {
    const host = document.getElementById('home-news-main');
    if (!host || !item) return;
    host.replaceChildren();
    const l = lang();

    host.appendChild(mediaEl(item.image, true));

    const body = document.createElement('div');
    body.className = 'news-yt__main-body';

    const meta = document.createElement('div');
    meta.className = 'news-yt__main-meta';
    const dateStr = formatDate(item.publishedAt);
    if (dateStr) {
      const s = document.createElement('span');
      s.innerHTML = '<i class="fa-regular fa-calendar" aria-hidden="true"></i>';
      s.appendChild(document.createTextNode(dateStr));
      meta.appendChild(s);
    }
    if (item.category) {
      const s = document.createElement('span');
      s.innerHTML = '<i class="fa-solid fa-tag" aria-hidden="true"></i>';
      s.appendChild(document.createTextNode(categoryName(item.category)));
      meta.appendChild(s);
    }
    body.appendChild(meta);

    const h = document.createElement('h3');
    h.className = 'news-yt__main-title';
    h.textContent = (item.title && (item.title[l] || item.title.ar)) || '';
    body.appendChild(h);

    const p = document.createElement('p');
    p.className = 'news-yt__main-text';
    p.textContent = (item.excerpt && (item.excerpt[l] || item.excerpt.ar)) || '';
    body.appendChild(p);

    const a = document.createElement('a');
    a.className = 'news-yt__main-link';
    a.href = detailsHref(item);
    a.innerHTML = (l === 'ar' ? 'اقرأ المزيد' : 'Read more') + ' <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>';
    body.appendChild(a);

    host.appendChild(body);
  }

  function renderSidebar(items, activeId) {
    const host = document.getElementById('home-news-sidebar');
    if (!host) return;
    host.replaceChildren();
    const l = lang();

    items.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'news-yt__item' + (item.id === activeId ? ' is-active' : '');
      btn.setAttribute('data-news-id', item.id);
      btn.setAttribute('aria-pressed', item.id === activeId ? 'true' : 'false');

      btn.appendChild(mediaEl(item.image, false));

      const body = document.createElement('div');
      body.className = 'news-yt__item-body';
      const t = document.createElement('div');
      t.className = 'news-yt__item-title';
      t.textContent = (item.title && (item.title[l] || item.title.ar)) || '';
      body.appendChild(t);
      const m = document.createElement('div');
      m.className = 'news-yt__item-meta';
      const parts = [];
      const d = formatDate(item.publishedAt);
      if (d) parts.push(d);
      if (item.category) parts.push(categoryName(item.category));
      m.textContent = parts.join(' · ');
      body.appendChild(m);
      btn.appendChild(body);

      btn.addEventListener('click', function () {
        selectNews(item.id);
      });
      host.appendChild(btn);
    });
  }

  var activeId = null;

  function selectNews(id) {
    const items = newsList();
    if (!items.length) return;
    const item = items.find(function (n) { return n.id === id; }) || items[0];
    activeId = item.id;
    renderMain(item);
    renderSidebar(items, activeId);
  }

  function initHomeNews() {
    const root = document.getElementById('home-news-yt');
    if (!root) return;
    const items = newsList();
    if (!items.length) {
      root.hidden = true;
      return;
    }
    const featured = items.find(function (n) { return n.featured; }) || items[0];
    selectNews(featured.id);

    document.addEventListener('aoi:language', function () {
      if (activeId) selectNews(activeId);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeNews);
  } else {
    initHomeNews();
  }
})();
