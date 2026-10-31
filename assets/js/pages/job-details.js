/* ============================================================
   AOI Frontend — assets/js/pages/job-details.js
   Reads ?id=, renders job details from AOI_JOBS. Shows share /
   copy-link. Handles invalid IDs and closed vacancies. Renders
   only fields that exist. Re-renders on language change.
   No fabricated job data, no application form (no verified
   application workflow exists in this phase).
   ============================================================ */
'use strict';

(function () {
  let currentId = null;

  document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('jd-root');
    if (!root) return;

    currentId = new URLSearchParams(window.location.search).get('id');
    renderAll();
    document.addEventListener('aoi:language', renderAll);
    initReveal();
  });

  /* ---------------- helpers ---------------- */
  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function jobs() { return Array.isArray(window.AOI_JOBS) ? window.AOI_JOBS : []; }
  function meta() { return window.AOI_JOBS_META || {}; }
  function departments() { return Array.isArray(meta().departments) ? meta().departments : []; }

  function findJob(id) {
    if (!id) return null;
    return jobs().find(function (j) { return j.id === id; }) || null;
  }
  function departmentName(id) {
    const l = lang();
    const dep = departments().find(function (d) { return d.id === id; });
    return dep && dep.name ? (dep.name[l] || dep.name.ar || id) : (id || '');
  }
  function localized(value) {
    if (!value) return '';
    if (typeof value === 'object') return value[lang()] || value.ar || '';
    return String(value);
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
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) { return ''; }
  }
  function isClosed(job) {
    const t = validDate(job.deadline);
    if (t === null) return false;
    return Date.now() > t;
  }
  function employmentTypeLabel(type) {
    if (!type) return '';
    const d = dict();
    return d['careersPage.type_' + type.replace('-', '')] || type;
  }

  /* ---------------- render ---------------- */
  function renderAll() {
    const root = document.getElementById('jd-root');
    if (!root) return;
    const job = findJob(currentId);
    root.replaceChildren();

    if (!job) {
      root.appendChild(buildMissing());
      updateBreadcrumb(null);
      updateMeta(null);
      return;
    }
    updateBreadcrumb(job);
    updateMeta(job);

    const container = document.createElement('div');
    container.className = 'container';
    const inner = document.createElement('div');
    inner.className = 'jd';

    if (isClosed(job)) {
      const banner = document.createElement('div');
      banner.className = 'jd-closed-banner';
      banner.setAttribute('role', 'note');
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-circle-exclamation';
      icon.setAttribute('aria-hidden', 'true');
      const span = document.createElement('span');
      span.textContent = dict()['jobDetailsPage.closedBanner'] ||
        'This vacancy is closed. The information is displayed for reference.';
      banner.appendChild(icon);
      banner.appendChild(span);
      inner.appendChild(banner);
    }

    inner.appendChild(buildHeader(job));
    inner.appendChild(buildSections(job));
    inner.appendChild(buildShare(job));
    inner.appendChild(buildActions(job));

    container.appendChild(inner);
    root.appendChild(container);
  }

  function updateBreadcrumb(job) {
    const el = document.getElementById('breadcrumb-current');
    if (!el) return;
    if (job) {
      el.textContent = (job.title && job.title[lang()]) || '';
      el.removeAttribute('data-i18n');
    } else {
      el.setAttribute('data-i18n', 'jobDetailsPage.title');
      el.textContent = dict()['jobDetailsPage.title'] || 'Job Details';
    }
  }

  function updateMeta(job) {
    const suffix = lang() === 'ar' ? ' | الهيئة العربية للتصنيع' : ' | Arab Organization for Industrialization';
    if (!job) {
      document.title = (dict()['jobDetailsPage.title'] || 'Job Details') + suffix;
      return;
    }
    document.title = ((job.title && job.title[lang()]) || '') + suffix;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      const txt = (job.description && job.description[lang()]) || '';
      if (txt) desc.setAttribute('content', txt);
    }
  }

  /* ---------------- header ---------------- */
  function buildHeader(job) {
    const l = lang();
    const d = dict();
    const wrap = document.createElement('header');
    wrap.className = 'jd-header';

    const top = document.createElement('div');
    top.className = 'jd-header__top';
    const cat = document.createElement('span');
    cat.className = 'jd-header__category';
    cat.textContent = departmentName(job.department);
    top.appendChild(cat);

    if (job.reference) {
      const ref = document.createElement('span');
      ref.className = 'jd-header__ref';
      ref.textContent = job.reference;
      top.appendChild(ref);
    }

    const status = document.createElement('span');
    const closed = isClosed(job);
    status.className = 'job-tile__status ' + (closed ? 'job-tile__status--closed' : 'job-tile__status--open');
    status.textContent = closed
      ? (d['careersPage.statusClosed'] || 'Closed')
      : (d['careersPage.statusOpen'] || 'Open');
    top.appendChild(status);

    const title = document.createElement('h2');
    title.className = 'jd-header__title';
    title.textContent = (job.title && job.title[l]) || '';

    wrap.appendChild(top);
    wrap.appendChild(title);

    // Facts
    const facts = [];
    const loc = localized(job.location);
    if (loc) facts.push({ icon: 'fa-location-dot', label: d['jobDetailsPage.location'] || 'Location', value: loc });
    const type = employmentTypeLabel(job.employmentType);
    if (type) facts.push({ icon: 'fa-briefcase', label: d['jobDetailsPage.type'] || 'Type', value: type });
    const pub = formatDate(job.publishedAt);
    if (pub) facts.push({ icon: 'fa-calendar', label: d['jobDetailsPage.published'] || 'Published', value: pub });
    const dl = formatDate(job.deadline);
    if (dl) facts.push({ icon: 'fa-hourglass-end', label: d['jobDetailsPage.deadline'] || 'Deadline', value: dl });

    if (facts.length) {
      const grid = document.createElement('div');
      grid.className = 'jd-facts';
      facts.forEach(function (f) {
        const row = document.createElement('div');
        row.className = 'jd-fact';
        const iconWrap = document.createElement('span');
        iconWrap.className = 'jd-fact__icon';
        const icon = document.createElement('i');
        icon.className = 'fa-solid ' + f.icon;
        icon.setAttribute('aria-hidden', 'true');
        iconWrap.appendChild(icon);
        const textWrap = document.createElement('div');
        const label = document.createElement('div');
        label.className = 'jd-fact__label';
        label.textContent = f.label;
        const value = document.createElement('div');
        value.className = 'jd-fact__value';
        value.textContent = f.value;
        textWrap.appendChild(label);
        textWrap.appendChild(value);
        row.appendChild(iconWrap);
        row.appendChild(textWrap);
        grid.appendChild(row);
      });
      wrap.appendChild(grid);
    }
    return wrap;
  }

  /* ---------------- sections ---------------- */
  function buildSections(job) {
    const l = lang();
    const d = dict();
    const wrap = document.createElement('div');

    const desc = (job.description && job.description[l]) || '';
    if (desc) {
      wrap.appendChild(section(
        'fa-align-start',
        d['jobDetailsPage.description'] || 'Job Description',
        function (body) {
          const p = document.createElement('p');
          p.className = 'jd-section__text';
          p.textContent = desc;
          body.appendChild(p);
        }
      ));
    }

    if (Array.isArray(job.responsibilities) && job.responsibilities.length) {
      wrap.appendChild(section(
        'fa-list-check',
        d['jobDetailsPage.responsibilities'] || 'Responsibilities',
        function (body) {
          const ul = document.createElement('ul');
          ul.className = 'jd-list';
          job.responsibilities.forEach(function (r) {
            const li = document.createElement('li');
            li.textContent = (r && r[l]) || '';
            if (li.textContent) ul.appendChild(li);
          });
          if (ul.children.length) body.appendChild(ul);
        }
      ));
    }

    if (Array.isArray(job.requirements) && job.requirements.length) {
      wrap.appendChild(section(
        'fa-user-check',
        d['jobDetailsPage.requirements'] || 'Requirements',
        function (body) {
          const ul = document.createElement('ul');
          ul.className = 'jd-list';
          job.requirements.forEach(function (r) {
            const li = document.createElement('li');
            li.textContent = (r && r[l]) || '';
            if (li.textContent) ul.appendChild(li);
          });
          if (ul.children.length) body.appendChild(ul);
        }
      ));
    }
    return wrap;
  }

  function section(iconClass, titleText, bodyFn) {
    const sec = document.createElement('section');
    sec.className = 'jd-section';
    const h = document.createElement('h3');
    h.className = 'jd-section__title';
    const i = document.createElement('i');
    i.className = 'fa-solid ' + iconClass;
    i.setAttribute('aria-hidden', 'true');
    const span = document.createElement('span');
    span.textContent = titleText;
    h.appendChild(i);
    h.appendChild(span);
    sec.appendChild(h);
    const body = document.createElement('div');
    bodyFn(body);
    sec.appendChild(body);
    return sec;
  }

  /* ---------------- share ---------------- */
  function buildShare(job) {
    const d = dict();
    const row = document.createElement('div');
    row.className = 'jd-share';

    const label = document.createElement('span');
    label.className = 'jd-share__label';
    label.textContent = d['jobDetailsPage.share'] || 'Share';
    row.appendChild(label);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'jd-share-btn';
    const copyIcon = document.createElement('i');
    copyIcon.className = 'fa-solid fa-link';
    copyIcon.setAttribute('aria-hidden', 'true');
    const copyText = document.createElement('span');
    copyText.textContent = d['jobDetailsPage.copyLink'] || 'Copy Link';
    copyBtn.appendChild(copyIcon);
    copyBtn.appendChild(copyText);

    const toast = document.createElement('span');
    toast.className = 'jd-share-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    const toastIcon = document.createElement('i');
    toastIcon.className = 'fa-solid fa-circle-check';
    toastIcon.setAttribute('aria-hidden', 'true');
    const toastText = document.createElement('span');
    toastText.textContent = d['jobDetailsPage.copied'] || 'Link copied';
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

    if (navigator.share) {
      const shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.className = 'jd-share-btn';
      const si = document.createElement('i');
      si.className = 'fa-solid fa-share-nodes';
      si.setAttribute('aria-hidden', 'true');
      const st = document.createElement('span');
      st.textContent = d['jobDetailsPage.shareNative'] || 'Share';
      shareBtn.appendChild(si);
      shareBtn.appendChild(st);
      shareBtn.addEventListener('click', function () {
        const l = lang();
        navigator.share({
          title: (job.title && job.title[l]) || document.title,
          url: window.location.href
        }).catch(function () { /* user cancelled — no-op */ });
      });
      row.appendChild(shareBtn);
    }

    row.appendChild(toast);
    return row;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text)
        .then(function () { return true; })
        .catch(function () { return fallbackCopy(text); });
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

  /* ---------------- actions ---------------- */
  function buildActions(job) {
    const d = dict();
    const wrap = document.createElement('div');
    wrap.className = 'jd-actions';

    const back = document.createElement('a');
    back.className = 'btn btn-aoi btn-aoi--primary';
    back.href = 'careers.html';
    back.textContent = d['jobDetailsPage.backToCareers'] || 'Back to Careers';
    wrap.appendChild(back);

    // Only render an official application link if the record provides one.
    if (job.officialUrl && !isClosed(job)) {
      const apply = document.createElement('a');
      apply.className = 'btn btn-aoi btn-aoi--gold';
      apply.href = job.officialUrl;
      apply.target = '_blank';
      apply.rel = 'noopener noreferrer';
      apply.textContent = d['jobDetailsPage.applyOfficial'] || 'Apply via Official Channel';
      wrap.appendChild(apply);
    }

    // Reference the official careers portal when configured, otherwise
    // point back to the careers page.
    const official = meta().officialUrl;
    if (official) {
      const ch = document.createElement('a');
      ch.className = 'btn btn-aoi btn-aoi--gold';
      ch.href = official;
      ch.target = '_blank';
      ch.rel = 'noopener noreferrer';
      ch.textContent = d['jobDetailsPage.officialChannel'] || 'Official Recruitment Channel';
      wrap.appendChild(ch);
    }

    return wrap;
  }

  /* ---------------- missing ---------------- */
  function buildMissing() {
    const wrap = document.createElement('div');
    wrap.className = 'container';
    const card = document.createElement('div');
    card.className = 'jd-missing';
    card.setAttribute('role', 'status');

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass jd-missing__icon';
    icon.setAttribute('aria-hidden', 'true');
    const title = document.createElement('p');
    title.className = 'jd-missing__title';
    title.textContent = dict()['jobDetailsPage.notFoundTitle'] || 'Job not found';
    const text = document.createElement('p');
    text.className = 'jd-missing__text';
    text.textContent = dict()['jobDetailsPage.notFoundText'] ||
      'The job you requested does not exist or is no longer available.';
    const back = document.createElement('a');
    back.className = 'btn btn-aoi btn-aoi--primary';
    back.href = 'careers.html';
    back.textContent = dict()['jobDetailsPage.backToCareers'] || 'Back to Careers';

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