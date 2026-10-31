/* ============================================================
   AOI Frontend — assets/js/pages/contact.js
   Contact page: renders contact cards from AOI_CONTACT_INFO,
   runs client-side validation, shows honest frontend-only
   status on success, and isolates submission for future
   Laravel API integration.

   PHASE 8 SUBMISSION IS NOT CONNECTED TO ANY BACKEND.
   Client-side validation does NOT deliver messages to AOI.

   HOW TO CONNECT A LARAVEL API LATER:
   1. Set `AOI_CONTACT_INFO.submissionEndpoint` in
      assets/js/data/contact-info.js to your API URL, e.g.
      'https://api.example.gov/contact'.
   2. Inside submitContact(payload), replace the "no endpoint"
      branch with a fetch():
         const res = await fetch(AOI_CONTACT_INFO.submissionEndpoint, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json',
                      'Accept': 'application/json' },
           body: JSON.stringify(payload)
         });
         if (!res.ok) throw new Error('Submit failed');
      Handle auth via httpOnly cookies set by the backend.
      Never place API keys or tokens in this file.
   3. On success, show the real confirmation message.
   4. On failure, show contactPage.statusSubmitError.
   ============================================================ */
'use strict';

(function () {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[+()\-\s0-9]{6,30}$/;

  let isSubmitting = false;

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('contact-form')) return;

    renderContactCards();
    renderMap();
    bindForm();
    document.addEventListener('aoi:language', function () {
      renderContactCards();
      renderMap();
      // Do not reset the form on language change (preserves typed values).
      // Only re-render any localized error messages currently shown.
      reflowErrorMessages();
    });
    initReveal();
  });

  /* ---------------- helpers ---------------- */
  function dict() { return (window.AOISettings && window.AOISettings.getDict()) || {}; }
  function lang() { return (window.AOISettings && window.AOISettings.getLanguage()) || 'ar'; }
  function info() { return window.AOI_CONTACT_INFO || {}; }

  function localized(value) {
    if (!value) return '';
    if (typeof value === 'object') return value[lang()] || value.ar || '';
    return String(value);
  }

  function hasVerifiedContact() {
    const i = info();
    return !i.isPlaceholder && (i.phone || i.email || (i.address && (i.address.ar || i.address.en)));
  }

  /* ---------------- contact cards ---------------- */
  function renderContactCards() {
    const host = document.getElementById('contact-info-grid');
    if (!host) return;
    const i = info();
    const d = dict();
    host.replaceChildren();

    const verified = hasVerifiedContact();

    const cards = [
      {
        key: 'phone',
        icon: 'fa-phone',
        label: d['contactPage.labelPhone'] || 'Phone',
        value: verified ? i.phone : null,
        href: verified && i.phone ? 'tel:' + i.phone.replace(/\s+/g, '') : null
      },
      {
        key: 'email',
        icon: 'fa-envelope',
        label: d['contactPage.labelEmail'] || 'Email',
        value: verified ? i.email : null,
        href: verified && i.email ? 'mailto:' + i.email : null
      },
      {
        key: 'address',
        icon: 'fa-location-dot',
        label: d['contactPage.labelAddress'] || 'Address',
        value: verified ? localized(i.address) : null,
        href: null
      },
      {
        key: 'hours',
        icon: 'fa-clock',
        label: d['contactPage.labelHours'] || 'Office Hours',
        value: verified ? localized(i.officeHours) : null,
        href: null
      },
      {
        key: 'website',
        icon: 'fa-globe',
        label: d['contactPage.labelWebsite'] || 'Website',
        value: verified ? i.website : null,
        href: verified && i.website ? i.website : null,
        external: true
      }
    ];

    cards.forEach(function (c) {
      const card = document.createElement('article');
      card.className = 'contact-info-card';
      card.setAttribute('aria-labelledby', 'contact-label-' + c.key);

      const icon = document.createElement('span');
      icon.className = 'contact-info-card__icon';
      const i2 = document.createElement('i');
      i2.className = 'fa-solid ' + c.icon;
      i2.setAttribute('aria-hidden', 'true');
      icon.appendChild(i2);

      const title = document.createElement('h3');
      title.className = 'contact-info-card__title';
      title.id = 'contact-label-' + c.key;
      title.textContent = c.label;

      card.appendChild(icon);
      card.appendChild(title);

      if (c.value) {
        const value = document.createElement('p');
        value.className = 'contact-info-card__value';
        if (c.href) {
          const a = document.createElement('a');
          a.href = c.href;
          a.textContent = c.value;
          if (c.external) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
          }
          value.appendChild(a);
        } else {
          value.textContent = c.value;
        }
        card.appendChild(value);
      } else {
        const ph = document.createElement('p');
        ph.className = 'contact-info-card__placeholder';
        ph.textContent = d['contactPage.placeholderValue'] || 'Not yet published';
        card.appendChild(ph);
      }

      host.appendChild(card);
    });
  }

  /* ---------------- map ---------------- */
  function renderMap() {
    const section = document.getElementById('contact-map-section');
    const frame = document.getElementById('contact-map-frame');
    const link = document.getElementById('contact-map-link');
    if (!section || !frame || !link) return;

    const i = info();
    const d = dict();

    frame.replaceChildren();
    link.hidden = true;
    link.removeAttribute('href');

    if (!i.mapEmbedUrl && !i.mapLink) {
      section.hidden = true;
      return;
    }
    section.hidden = false;

    if (i.mapEmbedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = i.mapEmbedUrl;
      iframe.title = d['contactPage.mapIframeTitle'] || 'Location map';
      iframe.loading = 'lazy';
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      iframe.setAttribute('allowfullscreen', '');
      frame.appendChild(iframe);
    } else {
      const ph = document.createElement('div');
      ph.style.display = 'flex';
      ph.style.alignItems = 'center';
      ph.style.justifyContent = 'center';
      ph.style.height = '100%';
      ph.style.color = 'var(--aoi-muted)';
      ph.style.fontSize = 'var(--fs-sm)';
      ph.textContent = d['contactPage.mapNoEmbed'] || 'Map preview unavailable';
      frame.appendChild(ph);
    }

    if (i.mapLink) {
      link.href = i.mapLink;
      link.hidden = false;
    }
  }

  /* ---------------- form: bind ---------------- */
  function bindForm() {
    const form = document.getElementById('contact-form');
    const resetBtn = document.getElementById('contact-reset');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;
      handleSubmit(form);
    });

    // Clear errors as the user types
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        clearFieldError(input.name);
        hideGlobalError();
      });
      input.addEventListener('change', function () {
        clearFieldError(input.name);
        hideGlobalError();
      });
      input.addEventListener('blur', function () {
        // On blur, validate only this field if it has a value or is required
        validateField(input, { focus: false });
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        // Let the default reset happen, then clear error UI + status
        setTimeout(function () {
          form.querySelectorAll('.contact-field.is-invalid').forEach(function (f) {
            f.classList.remove('is-invalid');
          });
          form.querySelectorAll('.contact-field__error').forEach(function (e) {
            e.hidden = true;
            e.querySelector('span').textContent = '';
          });
          hideGlobalError();
          hideStatus();
        }, 0);
      });
    }
  }

  /* ---------------- form: validation ---------------- */
  function validateField(input, opts) {
    const d = dict();
    const name = input.name;
    const field = input.closest('.contact-field');
    if (!field) return true;
    const value = (input.value || '').trim();

    let msg = '';

    if (input.required && value === '') {
      msg = d['contactPage.errRequired'] || 'This field is required.';
    } else if (name === 'email' && value !== '' && !EMAIL_RE.test(value)) {
      msg = d['contactPage.errEmail'] || 'Please enter a valid email address.';
    } else if (name === 'phone' && value !== '' && !PHONE_RE.test(value)) {
      msg = d['contactPage.errPhone'] || 'Please enter a valid phone number.';
    } else if (name === 'name' && value.length > 120) {
      msg = d['contactPage.errTooLong'] || 'This value is too long.';
    } else if (name === 'subject' && value.length > 160) {
      msg = d['contactPage.errTooLong'] || 'This value is too long.';
    } else if (name === 'message' && value.length > 2000) {
      msg = d['contactPage.errTooLong'] || 'This value is too long.';
    } else if (name === 'message' && value !== '' && value.length < 10) {
      msg = d['contactPage.errMessageShort'] || 'Message is too short.';
    }

    if (msg) {
      applyFieldError(name, msg);
      if (opts && opts.focus) input.focus();
      return false;
    }
    clearFieldError(name);
    return true;
  }

  function applyFieldError(name, message) {
    const input = document.querySelector('[name="' + name + '"]');
    const field = input ? input.closest('.contact-field') : null;
    if (!field) return;
    field.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    const err = field.querySelector('.contact-field__error');
    if (err) {
      err.hidden = false;
      const span = err.querySelector('span');
      if (span) span.textContent = message;
    }
  }

  function clearFieldError(name) {
    const input = document.querySelector('[name="' + name + '"]');
    const field = input ? input.closest('.contact-field') : null;
    if (!field) return;
    field.classList.remove('is-invalid');
    if (input) input.removeAttribute('aria-invalid');
    const err = field.querySelector('.contact-field__error');
    if (err) {
      err.hidden = true;
      const span = err.querySelector('span');
      if (span) span.textContent = '';
    }
  }

  function reflowErrorMessages() {
    // Re-apply localized error text for currently invalid fields
    document.querySelectorAll('.contact-field.is-invalid').forEach(function (f) {
      const input = f.querySelector('input, select, textarea');
      if (input) validateField(input, { focus: false });
    });
  }

  function hideGlobalError() {
    const el = document.getElementById('form-global-error');
    if (el) el.classList.remove('is-visible');
  }
  function showGlobalError() {
    const el = document.getElementById('form-global-error');
    if (el) el.classList.add('is-visible');
  }

  function hideStatus() {
    const el = document.getElementById('form-status');
    if (el) el.classList.remove('is-visible');
  }
  function showStatus(text, isError) {
    const el = document.getElementById('form-status');
    const txt = document.getElementById('form-status-text');
    if (!el || !txt) return;
    el.classList.remove('contact-form__status--info', 'contact-form__status--error');
    el.classList.add(isError ? 'contact-form__status--error' : 'contact-form__status--info');
    el.classList.add('is-visible');
    txt.textContent = text;
  }

  /* ---------------- form: submit ---------------- */
  function handleSubmit(form) {
    const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
    let firstInvalid = null;

    inputs.forEach(function (input) {
      const ok = validateField(input, { focus: false });
      if (!ok && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      showGlobalError();
      hideStatus();
      try { firstInvalid.focus(); } catch (e) { /* noop */ }
      return;
    }
    hideGlobalError();

    const payload = {
      name: (form.elements['name'].value || '').trim(),
      email: (form.elements['email'].value || '').trim(),
      phone: (form.elements['phone'].value || '').trim() || null,
      inquiryType: (form.elements['inquiry'].value || '').trim() || null,
      subject: (form.elements['subject'].value || '').trim(),
      message: (form.elements['message'].value || '').trim(),
      locale: lang()
    };

    setSubmitting(true);
    submitContact(payload)
      .then(function (result) {
        setSubmitting(false);
        if (result && result.ok === false && result.error) {
          showStatus(result.error, true);
          return;
        }
        // Honest frontend-only success message
        showStatus(dict()['contactPage.statusValidated'] ||
          'Your information has been validated. Message delivery is not enabled in this frontend demo.',
          false);
        form.reset();
        // Clear any lingering error markers after reset
        form.querySelectorAll('.contact-field.is-invalid').forEach(function (f) {
          f.classList.remove('is-invalid');
        });
      })
      .catch(function () {
        setSubmitting(false);
        showStatus(dict()['contactPage.statusSubmitError'] ||
          'Submission failed. Please try again later.', true);
      });
  }

  /* ------------------------------------------------------------
     PHASE 8 SUBMISSION — no backend is connected.
     Replace the body of this function when wiring a Laravel API.
     Never place API keys or auth tokens in this file.
     ------------------------------------------------------------ */
  function submitContact(payload) {
    return new Promise(function (resolve) {
      const endpoint = info() && info().submissionEndpoint;
      if (!endpoint) {
        // Honest demo path — no network request, no false claim.
        resolve({ ok: true, demo: true });
        return;
      }
      // When the endpoint is configured, send a JSON POST.
      // The backend is expected to validate again and set any
      // auth cookies server-side.
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      })
        .then(function (res) {
          if (!res.ok) {
            resolve({ ok: false, error: dict()['contactPage.statusSubmitError'] || 'Submission failed.' });
            return;
          }
          resolve({ ok: true });
        })
        .catch(function () {
          resolve({ ok: false, error: dict()['contactPage.statusSubmitError'] || 'Submission failed.' });
        });
    });
  }

  function setSubmitting(state) {
    isSubmitting = state;
    const btn = document.getElementById('contact-submit');
    if (!btn) return;
    btn.disabled = state;
    btn.classList.toggle('is-loading', state);
    const label = btn.querySelector('span');
    const icon = btn.querySelector('i');
    if (state) {
      if (label) label.textContent = dict()['contactPage.submitting'] || 'Sending…';
      if (icon) icon.className = 'fa-solid fa-circle-notch fa-spin';
    } else {
      if (label) label.textContent = dict()['contactPage.submit'] || 'Send';
      if (icon) icon.className = 'fa-solid fa-paper-plane';
    }
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