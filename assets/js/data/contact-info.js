/* ============================================================
   AOI Frontend — assets/js/data/contact-info.js
   PUBLIC contact configuration. This is the ONLY place to
   edit AOI contact details — no other file contains hardcoded
   phone, email, or address values.

   IMPORTANT:
   - Do NOT put secrets, API keys, or credentials in this file.
   - Until verified official data is available, `isPlaceholder`
     must remain `true`; the UI then renders the fields as
     clearly-labeled placeholders and refuses to activate
     tel:/mailto: links (avoiding a false positive).
   - When real values are entered, set `isPlaceholder: false`
     and populate `phone`, `email`, `address`, etc.
   - `mapEmbedUrl` must be a VERIFIED embed URL from a map
     provider (e.g. Google Maps / OpenStreetMap). Leave it
     `null` until an official AOI location is confirmed.
     No coordinates are guessed or fabricated anywhere.
   ============================================================ */
'use strict';

window.AOI_CONTACT_INFO = {
  isPlaceholder: false,

  // When verified, set isPlaceholder: false and fill these in:
  phone: '+20222672297',
  fax: ['+20225588017', '+20225182385'],
  email: 'info@aoi.org.eg',
  address: {
    ar: 'الكيلو 17، طريق مصر – السويس، القاهرة، مصر',
    en: 'Km 17, Cairo–Suez Road, Cairo, Egypt'
  },
  officeHours: {
    ar: null,
    en: null
  },
  website: 'https://www.aoi.org.eg',
  social: {
    facebook: 'https://www.facebook.com/AOI.OfficialPage',
    youtube: 'https://www.youtube.com/channel/UCg24-Vs5fWlMS3BeU2Q0wyQ',
    linkedin: 'https://www.linkedin.com/company/arab-organization-for-industrialization/',
    instagram: 'https://www.instagram.com/aoi_page/'
  },
  supplierPortal: 'https://supplier.aoi.org.eg',

  // Map configuration — leave null until an official location is confirmed.
  // When verified, provide either:
  //   mapEmbedUrl — full embed URL (https://…)
  //   mapLink     — direct map link (https://…)
  mapEmbedUrl: null,
  mapLink: null,

  // Inquiry type options — labels are UI strings localized below.
  // Keys stay stable; display labels live in settings.js.
  inquiryTypes: ['general', 'products', 'projects', 'media', 'other'],

  // Real submission endpoint — set this when the Laravel API exists.
  // The submitContact() function in contact.js reads this value and
  // refuses to POST while it is null. Never put credentials here —
  // auth tokens belong in cookies managed by the backend, not in JS.
  submissionEndpoint: null
};