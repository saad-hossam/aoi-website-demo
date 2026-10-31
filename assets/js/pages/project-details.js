/* ============================================================
   AOI Frontend — assets/js/pages/project-details.js
   Reads ?id=, renders project details + gallery + related.
   Handles missing/invalid IDs gracefully. Re-renders on
   language change. Safe DOM construction.
   ============================================================ */
'use strict';

(function () {
  let currentId = null;

  document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('pj-root');
    if (!root) return;

    currentId = new URLSearchParams(window.location.search).get('id');
    renderAll();
    document.addEventListener('aoi:language', renderAll);
    initReveal();
  });

  /* ---------------- helpers ---------------- */
  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function projects() { return Array.isArray(window.AOI_PROJECTS) ? window.AOI_PROJECTS : []; }
  function categories() { return Array.isArray(window.AOI_PROJECT_CATEGORIES) ? window.AOI_PROJECT_CATEGORIES : []; }

  function findProject(id) {
    if (!id) return null;
    return projects().find(function (p) { return p.id === id; }) || null;
  }
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
  function formatDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-GB', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) { return ''; }
  }

  function relatedFor(project) {
    if (!project) return [];
    return projects()
      .filter(function (p) { return p.id !== project.id && p.category === project.category; })
      .slice(0, 3);
  }

  /* ---------------- render ---------------- */
  function renderAll() {
    const root = document.getElementById('pj-root');
    if (!root) return;
    const project = findProject(currentId);
    root.replaceChildren();

    if (!project) {
      root.appendChild(buildMissing());
      updateBreadcrumb(null);
      updateMeta(null);
      return;
    }
    updateBreadcrumb(project);
    updateMeta(project);

    const container = document.createElement('div');
    container.className = 'container';

    if (project.isSample) {
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

    const grid = document.createElement('div');
    grid.className = 'pj-grid';
    grid.appendChild(buildGallery(project));
    grid.appendChild(buildInfo(project));
    container.appendChild(grid);

    // Additional full-width sections
    container.appendChild(buildScopeSection(project));
    container.appendChild(buildApplicationsSection(project));

    const related = buildRelatedSection(project);
    if (related) container.appendChild(related);

    root.appendChild(container);
  }

  function updateBreadcrumb(project) {
    const el = document.getElementById('breadcrumb-current');
    if (!el) return;
    if (project) {
      el.textContent = (project.title && project.title[lang()]) || '';
      el.removeAttribute('data-i18n');
    } else {
      el.setAttribute('data-i18n', 'projectDetailsPage.title');
      el.textContent = dict()['projectDetailsPage.title'] || 'Project Details';
    }
  }

  function updateMeta(project) {
    // Update document title and meta description per project
    const ar = 'الهيئة العربية للتصنيع';
    const en = 'Arab Organization for Industrialization';
    const suffix = lang() === 'ar' ? (' | ' + ar) : (' | ' + en);
    if (!project) {
      document.title = (dict()['projectDetailsPage.title'] || 'Project Details') + suffix;
      return;
    }
    const title = (project.title && project.title[lang()]) || '';
    document.title = title + suffix;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      const text = (project.shortDescription && project.shortDescription[lang()]) || '';
      if (text) desc.setAttribute('content', text);
    }
  }

  /* ---------------- gallery ---------------- */
  function buildGallery(project) {
    const images = [].concat(project.image ? [project.image] : []).concat(Array.isArray(project.gallery) ? project.gallery : [])
      .filter(function (x, i, a) { return x && a.indexOf(x) === i; });
    return window.AOIGallery.create(images, (project.title && project.title[lang()]) || '', 'fa-solid fa-industry');
  }

  /* ---------------- info column ---------------- */
  function buildInfo(project) {
    const l = lang();
    const d = dict();
    const wrap = document.createElement('div');
    wrap.className = 'pj-info';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'pj-info__eyebrow';
    eyebrow.textContent = categoryName(project.category);

    const title = document.createElement('h2');
    title.className = 'pj-info__title';
    title.textContent = (project.title && project.title[l]) || '';

    const lead = document.createElement('p');
    lead.className = 'pj-info__lead';
    lead.textContent = (project.shortDescription && project.shortDescription[l]) || '';

    wrap.appendChild(eyebrow);
    wrap.appendChild(title);
    wrap.appendChild(lead);

    // Facts row (location / status / start date / end date) — only render present fields
    const facts = [];
    const loc = formatLocation(project.location);
    if (loc) facts.push({ icon: 'fa-location-dot', label: d['projectDetailsPage.location'] || 'Location', value: loc });
    const st = statusLabel(project.status);
    if (st) facts.push({ icon: 'fa-circle-info', label: d['projectDetailsPage.status'] || 'Status', value: st });
    const sd = formatDate(project.startDate);
    if (sd) facts.push({ icon: 'fa-calendar', label: d['projectDetailsPage.startDate'] || 'Start Date', value: sd });
    const ed = formatDate(project.endDate);
    if (ed) facts.push({ icon: 'fa-calendar-check', label: d['projectDetailsPage.endDate'] || 'End Date', value: ed });

    if (facts.length) {
      const grid = document.createElement('div');
      grid.className = 'pj-facts';
      facts.forEach(function (f) {
        const row = document.createElement('div');
        row.className = 'pj-fact';
        const iconWrap = document.createElement('span');
        iconWrap.className = 'pj-fact__icon';
        const icon = document.createElement('i');
        icon.className = 'fa-solid ' + f.icon;
        icon.setAttribute('aria-hidden', 'true');
        iconWrap.appendChild(icon);
        const textWrap = document.createElement('div');
        const label = document.createElement('div');
        label.className = 'pj-fact__label';
        label.textContent = f.label;
        const value = document.createElement('div');
        value.className = 'pj-fact__value';
        value.textContent = f.value;
        textWrap.appendChild(label);
        textWrap.appendChild(value);
        row.appendChild(iconWrap);
        row.appendChild(textWrap);
        grid.appendChild(row);
      });
      wrap.appendChild(grid);
    }

    // Description
    const desc = (project.description && project.description[l]) || '';
    if (desc) {
      const sec = document.createElement('section');
      sec.className = 'pj-section';
      sec.appendChild(sectionTitle('fa-align-start', d['projectDetailsPage.overview'] || 'Overview'));
      const p = document.createElement('p');
      p.className = 'pj-section__text';
      p.textContent = desc;
      sec.appendChild(p);
      wrap.appendChild(sec);
    }

    // Technical details
    if (Array.isArray(project.technicalDetails) && project.technicalDetails.length) {
      const sec = document.createElement('section');
      sec.className = 'pj-section';
      sec.appendChild(sectionTitle('fa-list-check', d['projectDetailsPage.technicalDetails'] || 'Technical Details'));
      const grid = document.createElement('div');
      grid.className = 'pj-specs';
      project.technicalDetails.forEach(function (spec) {
        const row = document.createElement('div');
        row.className = 'pj-spec';
        const label = document.createElement('div');
        label.className = 'pj-spec__label';
        label.textContent = (spec.label && spec.label[l]) || '';
        const value = document.createElement('div');
        value.className = 'pj-spec__value';
        value.textContent = (spec.value && spec.value[l]) || '';
        row.appendChild(label);
        row.appendChild(value);
        grid.appendChild(row);
      });
      sec.appendChild(grid);
      wrap.appendChild(sec);
    }

    // Actions
    const actions = document.createElement('div');
    actions.className = 'pj-actions';

    const back = document.createElement('a');
    back.className = 'btn btn-aoi btn-aoi--primary';
    back.href = 'projects.html';
    back.textContent = d['projectDetailsPage.backToProjects'] || 'Back to Projects';
    actions.appendChild(back);

    const catLink = document.createElement('a');
    catLink.className = 'btn btn-aoi btn-aoi--gold';
    catLink.href = 'projects.html';
    catLink.textContent = (d['projectDetailsPage.browseCategory'] || 'Browse Category') + ' · ' + categoryName(project.category);
    actions.appendChild(catLink);

    wrap.appendChild(actions);
    return wrap;
  }

  function sectionTitle(iconClass, text) {
    const h = document.createElement('h3');
    h.className = 'pj-section__title';
    const i = document.createElement('i');
    i.className = 'fa-solid ' + iconClass;
    i.setAttribute('aria-hidden', 'true');
    const span = document.createElement('span');
    span.textContent = text;
    h.appendChild(i);
    h.appendChild(span);
    return h;
  }

  /* ---------------- scope of work ---------------- */
  function buildScopeSection(project) {
    const l = lang();
    const d = dict();
    const wrap = document.createElement('div');
    wrap.className = 'container';
    if (!Array.isArray(project.scope) || project.scope.length === 0) return wrap;

    const sec = document.createElement('section');
    sec.className = 'pj-section';
    sec.appendChild(sectionTitle('fa-diagram-project', d['projectDetailsPage.scope'] || 'Scope of Work'));
    const list = document.createElement('ul');
    list.className = 'pj-list';
    project.scope.forEach(function (s) {
      const li = document.createElement('li');
      li.textContent = (s && s[l]) || '';
      if (li.textContent) list.appendChild(li);
    });
    if (list.children.length) {
      sec.appendChild(list);
      wrap.appendChild(sec);
    }
    return wrap;
  }

  /* ---------------- applications ---------------- */
  function buildApplicationsSection(project) {
    const l = lang();
    const d = dict();
    const wrap = document.createElement('div');
    wrap.className = 'container';
    if (!Array.isArray(project.applications) || project.applications.length === 0) return wrap;

    const sec = document.createElement('section');
    sec.className = 'pj-section';
    sec.appendChild(sectionTitle('fa-cogs', d['projectDetailsPage.applications'] || 'Applications'));
    const list = document.createElement('ul');
    list.className = 'pj-list';
    project.applications.forEach(function (a) {
      const li = document.createElement('li');
      li.textContent = (a && a[l]) || '';
      if (li.textContent) list.appendChild(li);
    });
    if (list.children.length) {
      sec.appendChild(list);
      wrap.appendChild(sec);
    }
    return wrap;
  }

  /* ---------------- related ---------------- */
  function buildRelatedSection(project) {
    const d = dict();
    const related = relatedFor(project);

    const section = document.createElement('section');
    section.className = 'pj-related';

    const head = document.createElement('div');
    head.className = 'section-head section-head--split';
    const titleWrap = document.createElement('div');
    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = d['common.related'] || 'Related';
    const h2 = document.createElement('h2');
    h2.className = 'section-title';
    h2.textContent = d['projectDetailsPage.relatedTitle'] || 'Related Projects';
    titleWrap.appendChild(eyebrow);
    titleWrap.appendChild(h2);
    head.appendChild(titleWrap);
    section.appendChild(head);

    if (related.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state empty-state--page';
      empty.setAttribute('role', 'status');
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-diagram-project empty-state__icon';
      icon.setAttribute('aria-hidden', 'true');
      const title = document.createElement('p');
      title.className = 'empty-state__title';
      title.textContent = d['projectDetailsPage.noRelatedTitle'] || 'No related projects yet';
      const text = document.createElement('p');
      text.className = 'empty-state__text';
      text.textContent = d['projectDetailsPage.noRelatedText'] || 'Related projects will appear here when available.';
      empty.appendChild(icon);
      empty.appendChild(title);
      empty.appendChild(text);
      section.appendChild(empty);
      return section;
    }

    const row = document.createElement('div');
    row.className = 'row g-4';
    related.forEach(function (p) { row.appendChild(buildRelatedCard(p)); });
    section.appendChild(row);
    return section;
  }

  function buildRelatedCard(project) {
    const l = lang();
    const d = dict();
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

    const body = document.createElement('div');
    body.className = 'project-tile__body';

    const cat = document.createElement('span');
    cat.className = 'project-tile__category';
    cat.textContent = categoryName(project.category);

    const title = document.createElement('h3');
    title.className = 'project-tile__title';
    const link = document.createElement('a');
    link.href = 'project-details.html?id=' + encodeURIComponent(project.id);
    link.textContent = (project.title && project.title[l]) || '';
    title.appendChild(link);

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

    body.appendChild(cat);
    body.appendChild(title);
    body.appendChild(cta);
    article.appendChild(media);
    article.appendChild(body);
    col.appendChild(article);
    return col;
  }

  /* ---------------- missing project ---------------- */
  function buildMissing() {
    const wrap = document.createElement('div');
    wrap.className = 'container';
    const card = document.createElement('div');
    card.className = 'pj-missing';
    card.setAttribute('role', 'status');

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass pj-missing__icon';
    icon.setAttribute('aria-hidden', 'true');
    const title = document.createElement('p');
    title.className = 'pj-missing__title';
    title.textContent = dict()['projectDetailsPage.notFoundTitle'] || 'Project not found';
    const text = document.createElement('p');
    text.className = 'pj-missing__text';
    text.textContent = dict()['projectDetailsPage.notFoundText'] || 'The project you requested does not exist or is no longer available.';
    const back = document.createElement('a');
    back.className = 'btn btn-aoi btn-aoi--primary';
    back.href = 'projects.html';
    back.textContent = dict()['projectDetailsPage.backToProjects'] || 'Back to Projects';

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