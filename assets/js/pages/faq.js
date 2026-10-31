  function hasAnySample(records) {
    return records.some(function (f) { return f && f.isSample === true; });
  }

  function renderList() {
    const host = document.getElementById('faq-accordion');
    const empty = document.getElementById('faq-empty');
    const countEl = document.getElementById('faq-count');
    if (!host || !empty) return;

    const all = filtered();
    host.replaceChildren();

    if (countEl) countEl.textContent = String(all.length);
    if (all.length === 0) {
      host.hidden = true;
      empty.hidden = false;
      return;
    }
    host.hidden = false;
    empty.hidden = true;

    all.forEach(function (faq) { host.appendChild(buildItem(faq)); });
  }