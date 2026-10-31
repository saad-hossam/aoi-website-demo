/* ============================================================
   AOI Frontend — assets/js/pages/organizational-structure.js
   Renders an accessible, keyboard-navigable tree from
   AOI_ORG_STRUCTURE.nodes. Provides a plain text alternative
   for all users (visible, not just SR-only) — a stricter
   baseline than the brief requires.
   ============================================================ */
'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const tree = document.getElementById('org-tree');
    if (!tree) return;

    render();
    document.addEventListener('aoi:language', render);
    initReveal();
  });

  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function structure() { return window.AOI_ORG_STRUCTURE || { nodes: [], isPlaceholder: true }; }
  function nodes() { return Array.isArray(structure().nodes) ? structure().nodes : []; }

  function buildTreeMap() {
    const map = new Map();
    const list = nodes();
    list.forEach(function (n) { map.set(n.id, Object.assign({}, n, { children: [] })); });
    list.forEach(function (n) {
      if (n.parentId && map.has(n.parentId)) {
        map.get(n.parentId).children.push(map.get(n.id));
      }
    });
    const roots = [];
    map.forEach(function (n) { if (!n.parentId) roots.push(n); });
    return roots;
  }

  /* ---------------- render tree ---------------- */
  function render() {
    const tree = document.getElementById('org-tree');
    const alt = document.getElementById('org-alt-list');
    if (!tree || !alt) return;
    tree.replaceChildren();
    alt.replaceChildren();

    const roots = buildTreeMap();
    if (roots.length === 0) {
      const li = document.createElement('li');
      li.className = 'org-tree__node';
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.setAttribute('role', 'status');
      empty.textContent = dict()['orgPage.emptyText'] || 'No organizational data available.';
      li.appendChild(empty);
      tree.appendChild(li);
      return;
    }

    roots.forEach(function (root) {
      tree.appendChild(buildNode(root, 0));
    });

    // Plain text alternative mirrors the same structure
    renderAlt(roots, 0);
  }

  function buildNode(node, depth) {
    const l = lang();
    const li = document.createElement('li');
    li.className = 'org-tree__node';

    const hasChildren = node.children && node.children.length > 0;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'org-tree__toggle';
    btn.setAttribute('aria-expanded', depth === 0 ? 'true' : 'false');
    if (!hasChildren) btn.disabled = true;

    const icon = document.createElement('span');
    icon.className = 'org-tree__icon';
    const i = document.createElement('i');
    i.className = depth === 0 ? 'fa-solid fa-building-columns' : 'fa-solid fa-sitemap';
    i.setAttribute('aria-hidden', 'true');
    icon.appendChild(i);

    const label = document.createElement('span');
    label.className = 'org-tree__label';
    const title = document.createElement('span');
    title.className = 'org-tree__title';
    title.textContent = (node.title && (node.title[l] || node.title.ar)) || '';

    if (!node.verified) {
      const badge = document.createElement('span');
      badge.className = 'org-tree__badge';
      badge.textContent = dict()['orgPage.placeholderBadge'] || 'Placeholder';
      title.appendChild(badge);
    }
    label.appendChild(title);

    if (node.description) {
      const desc = document.createElement('span');
      desc.className = 'org-tree__desc';
      desc.textContent = (node.description[l] || node.description.ar) || '';
      label.appendChild(desc);
    }

    btn.appendChild(icon);
    btn.appendChild(label);

    if (hasChildren) {
      const chevron = document.createElement('i');
      chevron.className = 'fa-solid fa-chevron-right org-tree__chevron';
      chevron.setAttribute('aria-hidden', 'true');
      btn.appendChild(chevron);
    }

    li.appendChild(btn);

    if (hasChildren) {
      const childrenUl = document.createElement('ul');
      childrenUl.className = 'org-tree__children';
      childrenUl.setAttribute('role', 'group');
      childrenUl.hidden = depth !== 0;
      node.children.forEach(function (child) {
        childrenUl.appendChild(buildNode(child, depth + 1));
      });
      li.appendChild(childrenUl);

      btn.addEventListener('click', function () {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        childrenUl.hidden = expanded;
      });
    }

    return li;
  }

  /* ---------------- text alternative ---------------- */
  function renderAlt(roots, depth) {
    const alt = document.getElementById('org-alt-list');
    if (!alt) return;
    const l = lang();

    roots.forEach(function (node) {
      const li = document.createElement('li');
      if (depth > 0) li.className = 'indent-' + Math.min(depth, 3);

      const strong = document.createElement('strong');
      strong.textContent = (node.title && (node.title[l] || node.title.ar)) || '';
      li.appendChild(strong);

      if (node.description) {
        const span = document.createElement('span');
        span.textContent = ' — ' + ((node.description[l] || node.description.ar) || '');
        li.appendChild(span);
      }
      if (!node.verified) {
        const tag = document.createElement('em');
        tag.style.marginInlineStart = '8px';
        tag.style.fontStyle = 'italic';
        tag.style.color = 'var(--aoi-muted)';
        tag.textContent = '(' + (dict()['orgPage.placeholderBadge'] || 'Placeholder') + ')';
        li.appendChild(tag);
      }
      alt.appendChild(li);

      if (node.children && node.children.length) {
        renderAlt(node.children, depth + 1);
      }
    });
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