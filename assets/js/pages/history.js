/* ============================================================
   AOI Frontend — assets/js/pages/history.js
   Renders the historical timeline from AOI_MILESTONES (now
   populated with verified 1975 / 1993 records). Sort by year
   DESC. Safe DOM. Re-renders on aoi:language.
   ============================================================ */
'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var list = document.getElementById('history-timeline');
    if (!list) return;
    render();
    document.addEventListener('aoi:language', render);
    initReveal();
  });

  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function milestones() { return Array.isArray(window.AOI_MILESTONES) ? window.AOI_MILESTONES : []; }

  function localized(v) {
    if (!v) return '';
    if (typeof v === 'object') return v[lang()] || v.ar || '';
    return String(v);
  }

  function sortByYearDesc(arr) {
    var copy = arr.slice();
    copy.sort(function (a, b) {
      var ya = parseInt(a.year, 10);
      var yb = parseInt(b.year, 10);
      if (isNaN(ya) || isNaN(yb)) return 0;
      return yb - ya;
    });
    return copy;
  }

  function render() {
    var list = document.getElementById('history-timeline');
    var empty = document.getElementById('history-empty');
    var sampleTag = document.getElementById('history-sample-tag');
    if (!list || !empty) return;

    var data = sortByYearDesc(milestones());
    list.replaceChildren();

    if (data.length === 0) {
      list.hidden = true;
      empty.hidden = false;
      if (sampleTag) sampleTag.hidden = false;
      return;
    }

    list.hidden = false;
    empty.hidden = true;
    if (sampleTag) sampleTag.hidden = true;

    data.forEach(function (m, idx) {
      var li = document.createElement('li');
      li.className = 'history-timeline__item' + (idx === 0 ? ' is-active' : '');
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      li.setAttribute('aria-pressed', idx === 0 ? 'true' : 'false');

      var year = document.createElement('span');
      year.className = 'history-timeline__year';
      year.textContent = m.year || '—';

      var title = document.createElement('h3');
      title.className = 'history-timeline__title';
      title.textContent = localized(m.title);

      li.appendChild(year);
      li.appendChild(title);

      var bodyText = localized(m.body);
      if (bodyText) {
        var body = document.createElement('p');
        body.className = 'history-timeline__body';
        body.textContent = bodyText;
        li.appendChild(body);
      }

      var srcText = localized(m.source);
      if (srcText) {
        var src = document.createElement('span');
        src.className = 'history-timeline__source';
        var icon = document.createElement('i');
        icon.className = 'fa-solid fa-bookmark';
        icon.setAttribute('aria-hidden', 'true');
        var txt = document.createElement('span');
        txt.textContent = srcText;
        src.appendChild(icon);
        src.appendChild(txt);
        li.appendChild(src);
      }

      li.addEventListener('click', function () { toggleActive(li); });
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleActive(li);
        }
      });

      list.appendChild(li);
    });
  }

  function toggleActive(li) {
    var wasActive = li.classList.contains('is-active');
    li.parentElement.querySelectorAll('.history-timeline__item').forEach(function (item) {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
    if (!wasActive) {
      li.classList.add('is-active');
      li.setAttribute('aria-pressed', 'true');
    }
  }

  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
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