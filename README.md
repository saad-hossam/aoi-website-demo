# AOI Frontend — Phase 1 Foundation

A premium, bilingual (Arabic default / English), RTL/LTR-aware frontend
foundation for the **Arab Organization for Industrialization (AOI)**.

This repository contains **Phase 1 only**: the design system, shared
header/navigation, a homepage design-system demonstration, a shared footer,
and the language/theme infrastructure — all prepared for future Laravel
REST API integration.

> ⚠️ **Content notice.** Phase 1 uses placeholder text and clearly labeled
> temporary visuals. No official AOI logo, statistics, news, or contact
> information is included. Replace placeholders with approved content
> before any public use.

---

## 1. Project overview

The project establishes a single, reusable foundation for these future pages:

Home · About AOI · Chairman · Former Chairmen · Industrial Fields · Products ·
Product Details · Projects · Project Details · Capabilities · News · News Details ·
Videos · Contact Us · Supplier Portal · Registration · Technical School Academy.

The three portals (Supplier, Registration, Academy) will be independent
interfaces within the same project, sharing the design tokens and helpers
defined here.

---

## 2. Technologies

- HTML5 (semantic)
- CSS3 (custom properties, logical properties, mobile-first)
- Bootstrap 5.3 (RTL & LTR variants)
- Vanilla JavaScript (ES6+, IIFE modules, no framework)
- Font Awesome 6
- Google Fonts — Cairo (Arabic) + Inter (English)

---

## 3. Folder structure
# AOI Frontend — Phase 1 Foundation

A premium, bilingual (Arabic default / English), RTL/LTR-aware frontend
foundation for the **Arab Organization for Industrialization (AOI)**.

This repository contains **Phase 1 only**: the design system, shared
header/navigation, a homepage design-system demonstration, a shared footer,
and the language/theme infrastructure — all prepared for future Laravel
REST API integration.

> ⚠️ **Content notice.** Phase 1 uses placeholder text and clearly labeled
> temporary visuals. No official AOI logo, statistics, news, or contact
> information is included. Replace placeholders with approved content
> before any public use.

---

## 1. Project overview

The project establishes a single, reusable foundation for these future pages:

Home · About AOI · Chairman · Former Chairmen · Industrial Fields · Products ·
Product Details · Projects · Project Details · Capabilities · News · News Details ·
Videos · Contact Us · Supplier Portal · Registration · Technical School Academy.

The three portals (Supplier, Registration, Academy) will be independent
interfaces within the same project, sharing the design tokens and helpers
defined here.

---

## 2. Technologies

- HTML5 (semantic)
- CSS3 (custom properties, logical properties, mobile-first)
- Bootstrap 5.3 (RTL & LTR variants)
- Vanilla JavaScript (ES6+, IIFE modules, no framework)
- Font Awesome 6
- Google Fonts — Cairo (Arabic) + Inter (English)

---

## 3. Folder structure
aoi-frontend/
├── index.html
├── README.md
├── assets/
│ ├── css/
│ │ ├── style.css # tokens + core components
│ │ ├── responsive.css # breakpoint refinements
│ │ └── pages.css # future page-scoped styles
│ ├── js/
│ │ ├── main.js # back-to-top + helpers
│ │ ├── navigation.js # nav active state, mobile UX
│ │ ├── settings.js # language, RTL/LTR, theme
│ │ ├── forms.js # placeholder
│ │ ├── products.js # placeholder
│ │ ├── projects.js # placeholder
│ │ └── news.js # placeholder
│ ├── images/ # logo, hero, products, ...
│ └── data/ # products/projects/news sample stores
└── pages/
└── README.md # how future pages are added


---

## 4. Installation

No build step. No npm.

1. Download or clone the folder `aoi-frontend/`.
2. Open it in VS Code.

---

## 5. Running with VS Code Live Server

1. Install the **Live Server** extension (Ritwick Dey) in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. It opens at `http://127.0.0.1:5500/index.html` (port may vary).

> Directly opening `index.html` as a `file://` also works for Phase 1,
> because no `fetch()` calls are made. Future API phases will require the
> Live Server origin.

---

## 6. Customizing design tokens

All tokens live in `assets/css/style.css` inside `:root`:

```css
:root {
  --aoi-primary: #0D47A1;
  --aoi-primary-dark: #082F6B;
  --aoi-navy: #071D37;
  --aoi-gold: #D4A64F;
  --aoi-light: #F3F6FA;
  --aoi-white: #FFFFFF;
  --aoi-text: #142943;
  --aoi-muted: #64748B;
  /* radii, spacing, shadows, transitions, fonts */
}

# AOI Frontend — Phase 2 (Core Pages)

Extends the Phase 1 foundation with four inner pages plus a complete
homepage. Design tokens, header/footer, language system, and theme
architecture are preserved from Phase 1.

> ⚠️ **Content notice.** All content is placeholder. No official AOI logo,
> statistics, chairman information, historical names, dates, or news is
> included. Replace placeholders with approved content before publication.

---

## 1. Pages completed in Phase 2

| # | Page | Path | Status |
|---|------|------|--------|
| 1 | Home | `index.html` | ✅ Hero slider, quick access, about, fields, products, projects, capabilities, news, CTA |
| 2 | About AOI | `pages/about.html` | ✅ Intro, mission/vision, values, role, milestone placeholders, related links |
| 3 | Chairman | `pages/chairman.html` | ✅ Portrait, name/title/bio placeholders, message quote, related links |
| 4 | Former Chairmen | `pages/former-chairmen.html` | ✅ Data-driven grid with empty state (no fabricated names) |
| 5 | Industrial Fields | `pages/industrial-fields.html` | ✅ Category chips + search + result count + empty state |

---

## 2. New interaction features (Phase 2)

- **Accessible hero slider** — auto-rotate (6.5s), progress bar, pause/play,
  prev/next, dot indicators, arrow-key support, pause on hover/focus, pause
  on tab hidden, disabled when `prefers-reduced-motion`.
- **Marquee ribbon** — quiet industrial band below the hero, pauses on hover.
- **Scroll reveal** — `.reveal` and `.reveal-stagger` fade/translate in via
  IntersectionObserver; skipped when reduced motion is on.
- **Tilt cards** — subtle 3D pointer-driven transform on `.tilt` elements;
  disabled on touch and reduced-motion.
- **Filterable industrial fields** — category chips + debounced search.
- **Animated profile cards** (Former Chairmen) — safe DOM construction,
  language-aware re-render on `aoi:language` event.

---

## 3. File locations (Phase 2 additions)
---

# Phase 3 — Products & Product Details

## Pages completed in Phase 3

| # | Page | Path | Status |
|---|------|------|--------|
| 1 | Products listing | `pages/products.html` | ✅ Chips, debounced search, sort, pagination, active-filter pills, empty state |
| 2 | Product details | `pages/product-details.html?id=<id>` | ✅ Gallery, info, specs, features, applications, related products, missing-product state |

## Product dataset structure

Centralized in `assets/js/data/products.js`:

```js
window.AOI_PRODUCT_CATEGORIES = [
  { id: 'manufacturing', name: { ar: '...', en: '...' } },
  // ...
];

window.AOI_PRODUCTS = [
  {
    id: 'product-001',
    slug: 'industrial-pump-sample',
    isSample: true,
    category: 'manufacturing',
    name: { ar: '...', en: '...' },
    shortDescription: { ar: '...', en: '...' },
    description: { ar: '...', en: '...' },
    image: null,          // path relative to project root, e.g. 'assets/images/products/p1.jpg'
    gallery: [],          // additional image paths
    specifications: [
      { label: { ar: '...', en: '...' }, value: { ar: '...', en: '...' } }
    ],
    features: [ { ar: '...', en: '...' } ],
    applications: [ { ar: '...', en: '...' } ]
  }
];
---

# Phase 4 — Projects & Project Details

## Features added

| # | Page | Path | Status |
|---|------|------|--------|
| 1 | Projects listing | `pages/projects.html` | ✅ Chips, debounced search, sort, pagination, active-filter pills, empty state, sample banner |
| 2 | Project details | `pages/project-details.html?id=<id>` | ✅ Gallery, info + facts row, overview, technical details, scope, applications, related, not-found state |

Both pages reuse the shared header/footer/nav, `AOISettings` language system, `aoi:language` custom event, reveal animation helper, and existing `.products-toolbar`, `.chip-row`, `.pager-btn`, `.filter-pill`, `.products-count`, `.products-empty`, `.sample-tag` styles — so Projects and Products share identical typography, spacing, and interaction language.

## How the projects dataset works

Centralized in `assets/js/data/projects.js`, following the same `window.AOI_*` namespace convention as products:

```js
window.AOI_PROJECT_CATEGORIES = [
  { id: 'infrastructure', name: { ar: '...', en: '...' } },
  // ...
];

window.AOI_PROJECTS = [
  {
    id: 'project-001',
    slug: 'industrial-complex-sample',
    isSample: true,
    category: 'manufacturing',
    title: { ar: '...', en: '...' },
    shortDescription: { ar: '...', en: '...' },
    description: { ar: '...', en: '...' },
    image: null,
    gallery: [],
    location: null,
    startDate: null,
    endDate: null,
    status: 'ongoing' | 'completed' | null,
    scope: [ { ar: '...', en: '...' } ],
    technicalDetails: [ { label: {ar,en}, value: {ar,en} } ],
    applications: [ { ar: '...', en: '...' } ]
  }
];
---

# Phase 5 — Capabilities

## Features added

| # | Page | Path | Status |
|---|------|------|--------|
| 1 | Capabilities | `pages/capabilities.html` | ✅ Editorial single page: overview, capability category cards, in-depth editorial sections, cross-links, CTA |

**No details page, no dataset.** The brief required building individual capability detail pages *only if the existing content supports them*. Since no verified capability records exist in the project, creating a details page would require inventing official capability content — explicitly forbidden. The Capabilities page itself is the authoritative deep page with six structured editorial sections (Manufacturing, Engineering, Industrial Systems, R&D, Maintenance & Support, Technology Solutions), each with a summary and a focus-areas panel.

**No search or filter UI.** Per the brief (§6): "Do not add unnecessary search controls to a short, mostly editorial page."

## Page structure

- **Page hero** — breadcrumb + title + introduction (reuses `.page-hero` from Phase 2).
- **Anchor nav** — quick in-page jump links (Overview / Categories / Details / Related).
- **Overview section** — two-column layout with an image placeholder frame, intro copy, and a highlights list.
- **Category cards grid** — 6 responsive cards (`.image-card` variant from style.css) with icons, tags, titles, descriptions, and in-page "View Details" links to the corresponding editorial detail sections below.
- **Editorial detail sections** — six `<article class="cap-block">` sections. Each has a text column (title + body) and a sidebar panel with focus areas. Alternate rows use `cap-block--reverse` for visual rhythm.
- **Related content** — cross-link panel to verified existing pages: Industrial Fields, Products, Projects, About.
- **CTA banner** — reuses `.cta-banner` from Phase 2, links to `industrial-fields.html`.

## Content organization

All copy lives directly in the HTML, structured as `data-i18n` keys with Arabic and English versions in `settings.js`. There is no `capabilities.js` data file — that would be an unnecessary indirection for a single editorial page. When verified capability content becomes available in the future, converting the sections to a dataset is a mechanical step (documented in Phase 6 planning notes below).

## How to add or update a capability section

1. Open `pages/capabilities.html`.
2. Add a new `<article class="cap-block">` (or `cap-block cap-block--reverse` for alternating rhythm) inside the `#details` section. Follow the existing template: `.cap-block__text` for the narrative, `.cap-block__side` for the focus-areas panel.
3. Add a new card in `#categories` matching the pattern: `<div class="col-12 col-sm-6 col-lg-4">` containing `.image-card.cap-card.tilt` and an `<a class="link-arrow">` pointing to your new section's `id`.
4. Add the new `data-i18n` keys to **both** `translations.ar` and `translations.en` in `assets/js/settings.js`.
5. Add a matching entry to the anchor nav (`#anchors` nav block near the top of `<main>`) so the section is discoverable.

## How to add images

The page uses an icon-only placeholder in the `.cap-overview__media` frame and icon-based media in the category cards. To use real images:

- **Overview image** — replace the `<div class="cap-overview__media" aria-hidden="true"><i …></i></div>` with:
  ```html
  <div class="cap-overview__media">
    <img src="../assets/images/capabilities/overview.jpg" alt="…" loading="lazy" />
  </div>
  ---

# Phase 6 — News & News Details

## Features added

| # | Page | Path | Status |
|---|------|------|--------|
| 1 | News listing | `pages/news.html` | ✅ Featured item, category chips, debounced search, sort (default / newest / oldest / title A–Z / Z–A), pagination, active-filter pills, empty state |
| 2 | News details | `pages/news-details.html?id=<id>` | ✅ Article header, body, prev/next, copy-link + native share (when supported), related news, not-found state |

Both pages reuse the shared listing chrome (`.products-toolbar`, `.chip-row`, `.pager-btn`, `.filter-pill`, `.products-empty`) so News feels identical to Products and Projects, and use the same `.page-hero`, `.breadcrumbs`, `.sample-tag`, `.reveal` helpers as earlier phases.

## News dataset structure

Centralized at `assets/js/data/news.js`:

```js
window.AOI_NEWS_CATEGORIES = [
  { id: 'article',      name: { ar: 'مقال',  en: 'Article' } },
  { id: 'announcement', name: { ar: 'إعلان', en: 'Announcement' } },
  { id: 'event',        name: { ar: 'حدث',   en: 'Event' } }
];

window.AOI_NEWS = [
  {
    id: 'news-001',
    slug: 'sample-article-01',
    isSample: true,           // true = demo content
    featured: true,           // at most one item should be featured
    category: 'article',      // one of AOI_NEWS_CATEGORIES ids
    tags: ['industry'],       // optional
    title:   { ar: '...', en: '...' },
    excerpt: { ar: '...', en: '...' },
    content: {
      ar: [
        'Paragraph text',
        { type: 'h2', text: 'Subheading' },
        { type: 'ul', items: ['item 1', 'item 2'] },
        { type: 'blockquote', text: 'Quote' }
      ],
      en: [ /* same structure */ ]
    },
    image: null,              // relative to project root, e.g. 'assets/images/news/n1.jpg'
    gallery: [],              // reserved for future use
    publishedAt: null         // ISO date string, or null
  }
];
---

# Phase 7 — Videos & Media Gallery

## Features added

| # | Page | Path | Status |
|---|------|------|--------|
| 1 | Videos | `pages/videos.html` | ✅ Featured video, category chips, debounced search, sort, pagination, accessible modal player, conditional media gallery + lightbox |

**No details page.** The AOI design is gallery-oriented, so the modal-player approach (Option A in the brief) is used. `video-details.html` is not created — that would duplicate functionality without a clear UX benefit.

## Video dataset structure

Centralized at `assets/js/data/videos.js`:

```js
window.AOI_VIDEO_CATEGORIES = [
  { id: 'overview',  name: { ar: 'نظرة عامة', en: 'Overview' } },
  // ...
];

window.AOI_VIDEOS = [
  {
    id: 'video-001',
    slug: 'sample-overview-01',
    isSample: true,
    featured: true,           // at most one item should be featured
    category: 'overview',     // one of AOI_VIDEO_CATEGORIES ids
    title:       { ar: '...', en: '...' },
    description: { ar: '...', en: '...' },
    thumbnail: null,          // 'assets/images/videos/<file>.jpg'
    sourceType: null,         // 'youtube' | 'vimeo' | 'file' | null
    embedUrl: null,           // for youtube/vimeo — full embed URL
    videoUrl: null,           // for 'file' — relative to project root
    publishedAt: null,        // ISO date string, or null
    duration: null            // seconds, or null
  }
];

window.AOI_MEDIA_IMAGES = []; // intentionally empty in Phase 7
---

# Phase 8 — Contact Us & Communication Center

## Features added

| # | Page | Path | Status |
|---|------|------|--------|
| 1 | Contact | `pages/contact.html` | ✅ Info cards (from config), validated form, inline errors, global error banner, honest success status, optional map, side panel with site cross-links |

**No fabricated contact details.** Official phone, email, address, and office hours have not been added to the project. The contact cards display "Not yet published" placeholders rather than tel:/mailto: links to invented data. When real values exist, they activate automatically.

**No map.** No verified AOI location exists yet. The map section is hidden unless `mapEmbedUrl` or `mapLink` is configured in `contact-info.js`. No coordinates are guessed anywhere.

**No delivery claims.** After successful validation, the form shows: *"Your information has been validated. Message delivery is not enabled in this frontend demo."* — Arabic and English. Client-side validation does NOT deliver messages to AOI.

## Files

| Status | Path |
|---|---|
| New | `pages/contact.html` |
| New | `assets/css/pages/contact.css` |
| New | `assets/js/data/contact-info.js` |
| New | `assets/js/pages/contact.js` |
| Modified | `assets/js/settings.js` (dictionary only) |

## Where contact information lives

All public contact data lives in one file: **`assets/js/data/contact-info.js`**.

```js
window.AOI_CONTACT_INFO = {
  isPlaceholder: true,         // ← flip to false when real data is added
  phone: null,                 // e.g. '+20 2 1234 5678'
  email: null,                 // e.g. 'info@example.gov'
  address: { ar: null, en: null },
  officeHours: { ar: null, en: null },
  website: null,               // e.g. 'https://example.gov'
  mapEmbedUrl: null,           // verified map embed URL only
  mapLink: null,               // verified map link only
  inquiryTypes: ['general','products','projects','media','other'],
  submissionEndpoint: null     // ← Laravel API URL when it exists
};
---

# Phase 11 — Careers & Job Opportunities

## Summary

| Feature | Status |
|---|---|
| Careers landing page | ✅ `pages/careers.html` |
| Job details page | ✅ `pages/job-details.html?id=<id>` |
| Empty state (no vacancies) | ✅ Professional, honest, points to configurable official channel |
| Search | ✅ (activated when jobs exist) |
| Department filter | ✅ (chips, activated when jobs exist) |
| Sort (dates / title) | ✅ |
| Pagination | ✅ (6 per page) |
| Share + Copy Link (details) | ✅ |
| Application form | **Not included** — no verified application workflow exists |
| Fake vacancies | **None** — `AOI_JOBS` is empty by default |

**The entire interface is built and working, but `AOI_JOBS` is empty in this phase.** No AOI job vacancies, salaries, requirements, deadlines, or recruitment policies have been fabricated. When verified vacancies are published, adding them activates the listing, filtering, pagination, and details view automatically.

## Files

| Status | Path |
|---|---|
| New | `pages/careers.html` |
| New | `pages/job-details.html` |
| New | `assets/css/pages/careers.css` |
| New | `assets/css/pages/job-details.css` |
| New | `assets/js/data/jobs.js` |
| New | `assets/js/pages/careers.js` |
| New | `assets/js/pages/job-details.js` |
| Modified | `assets/js/settings.js` (dictionary only) |

## Where job data is maintained

All careers data lives in **`assets/js/data/jobs.js`**:

```js
window.AOI_JOBS_META = {
  officialUrl: null,               // ← official recruitment URL when approved
  departments: [
    { id: 'engineering',   name: { ar: 'الهندسة', en: 'Engineering' } },
    // ...
  ]
};

window.AOI_JOBS = [];  // ← empty by default; populate with verified vacancies
---

# Phase 12 — About Us & Organizational Structure

## Summary

| Feature | Status |
|---|---|
| About page (upgraded) | ✅ `pages/about.html` — all Phase 2 sections preserved; added anchor nav, editorial splits, history preview, structure preview, cross-links |
| History page | ✅ `pages/history.html` — vertical timeline, empty-state-driven |
| Organizational structure page | ✅ `pages/organizational-structure.html` — accessible tree + full text alternative |
| Verified historical milestones | **None shipped** — `AOI_MILESTONES` is empty by default |
| Verified org chart | **None shipped** — `AOI_ORG_STRUCTURE.nodes` is placeholder only (`isPlaceholder: true`) |
| Navigation integration | Only the `about.html` nav dropdown links to the two new pages; other existing pages keep their current links (see "Wiring" below) |

**No facts were invented.** Mission, vision, values, history milestones, and organizational units are either carried forward from Phase 2 (verified project structure) or clearly labeled as placeholders. Timeline data ships empty. The org chart is explicitly marked placeholder in both data and UI.

## Files

| Status | Path |
|---|---|
| Modified | `pages/about.html` (upgraded in place) |
| New | `pages/history.html` |
| New | `pages/organizational-structure.html` |
| New | `assets/css/pages/about.css` |
| New | `assets/css/pages/history.css` |
| New | `assets/css/pages/organizational-structure.css` |
| New | `assets/js/data/milestones.js` |
| New | `assets/js/data/org-structure.js` |
| New | `assets/js/pages/about.js` |
| New | `assets/js/pages/history.js` |
| New | `assets/js/pages/organizational-structure.js` |
| Modified | `assets/js/settings.js` (dictionary only) |

**Phase 2's `about.css` was not present** — `about.html` used `pages.css` (which still holds `.about-intro-grid`, `.mv-grid`, `.values-grid`, `.timeline`). The Phase 12 `about.css` adds only new Phase 12 compositions; nothing in `pages.css` was modified.

## Where the data lives

### `assets/js/data/milestones.js`

```js
window.AOI_MILESTONES = [];
---

# Phase 13 — FAQ & Help Center

## Summary

| Feature | Status |
|---|---|
| FAQ page | ✅ `pages/faq.html` |
| Search | ✅ Arabic-aware normalization, matches question + answer + category |
| Category cards | ✅ With per-category counts |
| Category chips | ✅ Parallel filter UI |
| Accordion | ✅ `aria-expanded` / `aria-controls`, keyboard accessible |
| Expand All / Collapse All / Reset All | ✅ |
| Result count | ✅ Live `aria-live="polite"` |
| Empty state | ✅ With reset button |
| Verified / unverified answers | ✅ `requiresVerification: true` shows honest note |
| Live chat / tickets / messaging | **Not implemented** — explicitly out of scope |

**No invented answers.** Every answer is grounded in an existing page (Products, Projects, Capabilities, News, Videos, Contact, Careers, About, History, Org Structure, Industrial Fields) — OR is explicitly marked `requiresVerification: true` and the UI shows a visible "requires official confirmation" note. No response times, fees, procedures, or eligibility rules are fabricated.

## Files

| Status | Path |
|---|---|
| New | `pages/faq.html` |
| New | `assets/css/pages/faq.css` |
| New | `assets/js/data/faqs.js` |
| New | `assets/js/pages/faq.js` |
| Modified | `assets/js/settings.js` (dictionary only) |

## Where FAQ data lives

All questions and answers live in `assets/js/data/faqs.js`:

```js
window.AOI_FAQ_CATEGORIES = [
  { id: 'general', name: { ar: '...', en: '...' } },
  // ...
];

window.AOI_FAQS = [
  {
    id: 'faq-about',
    category: 'general',
    requiresVerification: false,
    question: { ar: '...', en: '...' },
    answer:   { ar: '...', en: '...' },
    relatedLinks: [
      { href: 'about.html', label: { ar: '...', en: '...' }, icon: 'fa-building-columns' }
    ]
  }
];
---

# Phase 14 — Global Search Experience

## Summary

| Feature | Status |
|---|---|
| Global search page | ✅ `pages/search.html` |
| Index from existing datasets | ✅ Builds from products, projects, news, videos, FAQs |
| Search by title / excerpt / keywords | ✅ |
| Arabic normalization (diacritics, alef/teh/yeh variants) | ✅ |
| Autocomplete with keyboard nav | ✅ Arrow up/down, Escape, Enter |
| Category filters (only populated types) | ✅ |
| Sorting (relevance / newest / title) | ✅ |
| URL `?q=` sync via `replaceState` | ✅ |
| Clear / reset | ✅ |
| Header search on other pages | **Not auto-wired** — see "Wiring" below |

## Files

| Status | Path |
|---|---|
| New | `pages/search.html` |
| New | `assets/css/pages/search.css` |
| New | `assets/js/data/search-index.js` |
| New | `assets/js/pages/search.js` |
| Modified | `assets/js/settings.js` (dictionary only) |

## Indexed sections

The index is built at page load from these existing `window.AOI_*` datasets:

| Type | Source | Result URL |
|---|---|---|
| Product | `AOI_PRODUCTS` | `product-details.html?id=…` |
| Project | `AOI_PROJECTS` | `project-details.html?id=…` |
| News | `AOI_NEWS` | `news-details.html?id=…` |
| Video | `AOI_VIDEOS` | `videos.html` |
| FAQ | `AOI_FAQS` | `faq.html#<id>` |

**Not indexed** (empty by design, so no fabricated results appear):

- `AOI_JOBS` — Phase 11 ships empty until verified vacancies exist.
- `AOI_MILESTONES` — Phase 12 ships empty.
- `AOI_ORG_STRUCTURE` — structural only, not treated as searchable content.
- `AOI_CONTACT_INFO` — configuration, not content.

When verified content is added to any of those datasets, extending search is a one-line addition in `search-index.js` (see `buildProductsIndex` for the pattern).

## Where the search index lives

`assets/js/data/search-index.js` builds `window.AOI_SEARCH_INDEX` from the source datasets. No data is duplicated — the index holds normalized references (title, excerpt, keywords, url, image) derived from the source arrays.

**Load order matters.** `search.html` loads the source datasets **before** `search-index.js`:

```html
<script src="../assets/js/data/products.js"></script>
<script src="../assets/js/data/projects.js"></script>
<script src="../assets/js/data/news.js"></script>
<script src="../assets/js/data/videos.js"></script>
<script src="../assets/js/data/faqs.js"></script>
<script src="../assets/js/data/search-index.js"></script>