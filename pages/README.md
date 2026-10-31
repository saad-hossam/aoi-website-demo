# pages/

Future page files live here. Phase 1 intentionally ships none.

When adding a page (e.g. `about.html`):
1. Copy the header block and footer block from `../index.html`.
2. Keep the same `<link>` order and script order so the design system,
   language switcher, and navigation behavior remain identical.
3. Update the `<a class="nav-link">` marked `active` for that page
   — or rely on `navigation.js`, which sets `active` automatically
   by comparing the current filename.
4. Relative asset paths from a page in this folder: use `../assets/...`.

Planned page files (Phase 2+):
- about.html
- chairman.html
- former-chairmen.html
- industrial-fields.html
- products.html
- product-details.html
- projects.html
- project-details.html
- capabilities.html
- news.html
- news-details.html
- videos.html
- contact.html
- supplier-portal.html
- registration.html
- academy.html