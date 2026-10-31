/* ============================================================
   AOI Frontend — former-chairmen.js
   Renders profile cards from AOI_DATA_FORMER_CHAIRMEN.
   Safe DOM construction; no innerHTML with user data.
   Bilingual — re-renders on aoi:language event.
   ============================================================ */
'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    render();
    document.addEventListener('aoi:language', render);
    initReveal();
  });

  function render() {
    const list = document.getElementById('former-list');
    const emptyEl = document.getElementById('former-empty');
    if (!list || !emptyEl) return;

    const data = Array.isArray(window.AOI_DATA_FORMER_CHAIRMEN)
      ? window.AOI_DATA_FORMER_CHAIRMEN : [];
    const lang = (window.AOISettings && window.AOISettings.getLanguage()) || 'ar';

    list.replaceChildren();

    if (data.length === 0) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    data.forEach(function (person) {
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-lg-4';

      const card = document.createElement('article');
      card.className = 'profile-card tilt';

      const media = document.createElement('div');
      media.className = 'profile-card__media';
      if (person.portraitUrl) {
        const img = document.createElement('img');
        img.src = window.aoiAsset(person.portraitUrl);
        img.alt = (person.name && person.name[lang]) || '';
        img.loading = 'lazy';
        img.addEventListener('error', function () {
          img.remove();
          const i = document.createElement('i');
          i.className = 'fa-solid fa-user-tie';
          media.appendChild(i);
        });
        media.appendChild(img);
      } else {
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-user-tie';
        icon.setAttribute('aria-hidden', 'true');
        media.appendChild(icon);
      }

      const body = document.createElement('div');
      body.className = 'profile-card__body';

      const name = document.createElement('h2');
      name.className = 'profile-card__name';
      name.textContent = (person.name && person.name[lang]) || '';

      const role = document.createElement('p');
      role.className = 'profile-card__role';
      role.textContent = (window.AOISettings.getDict()['nav.formerChairmen']) || '';

      const tenure = document.createElement('span');
      tenure.className = 'profile-card__tenure';
      tenure.textContent = (person.tenure && person.tenure[lang]) || '';

      body.appendChild(name);
      body.appendChild(role);
      body.appendChild(tenure);

      card.appendChild(media);
      card.appendChild(body);
      col.appendChild(card);
      list.appendChild(col);
    });
  }

  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll('.reveal, .reveal-stagger');
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
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  }
})();