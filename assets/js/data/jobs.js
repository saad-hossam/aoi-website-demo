/* ============================================================
   AOI Frontend — assets/js/data/jobs.js
   Official recruitment metadata populated. AOI's official
   statement is that vacancies are announced ONLY through the
   official newspaper and the official website — no other
   channels are authorized.

   AOI_JOBS remains [] because there are currently no verified
   live vacancy records to embed. The Careers page will show
   the empty state with a working link to the official channel.
   ============================================================ */
'use strict';

window.AOI_JOBS_META = {
  // VERIFIED official recruitment URL from aoi.org.eg.
  // Source: AOI's published recruitment-notice page.
  officialUrl: 'https://www.aoi.org.eg/pages/%F0%9F%8F%A2-recrutement-%C3%A0-l%E2%80%99organisation-arabe-pour-l%E2%80%99industrialisation-oai',

  departments: [
    { id: 'engineering',   name: { ar: 'الهندسة',        en: 'Engineering' } },
    { id: 'manufacturing', name: { ar: 'التصنيع',        en: 'Manufacturing' } },
    { id: 'administration',name: { ar: 'الإدارة',        en: 'Administration' } },
    { id: 'technology',    name: { ar: 'التقنية',        en: 'Technology' } }
  ]
};

// No verified live job records available at build time.
// AOI's policy: vacancies are published only in the official
// newspaper and on the official website.
window.AOI_JOBS = [];