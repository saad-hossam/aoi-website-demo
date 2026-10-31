/* ============================================================
   AOI Frontend — assets/js/data/org-structure.js
   Organizational hierarchy.

   Only top-level structure verified from aoi.org.eg is kept:
   the organization and its chairman. Sector names remain
   flagged `verified: false` because AOI has not published a
   detailed public org chart — the `isPlaceholder: true` banner
   is honest about this.
   ============================================================ */
'use strict';

window.AOI_ORG_STRUCTURE = {
  isPlaceholder: true,

  nodes: [
    {
      id: 'root',
      parentId: null,
      verified: true,
      title: { ar: 'الهيئة العربية للتصنيع', en: 'Arab Organization for Industrialization' },
      description: null
    },
    {
      id: 'chairman',
      parentId: 'root',
      verified: true,
      title: { ar: 'رئيس الهيئة', en: 'Chairman' },
      description: {
        ar: 'اللواء مهندس مختار عبد اللطيف.',
        en: 'Major General Eng. Mokhtar Abdellatif.'
      }
    },
    {
      id: 'sectors',
      parentId: 'root',
      verified: false,
      title: { ar: 'القطاعات', en: 'Sectors' },
      description: {
        ar: 'هيكل توضيحي فقط — لا يمثل الهيكل الرسمي.',
        en: 'Placeholder structure only — not the official chart.'
      }
    },
    {
      id: 'support',
      parentId: 'root',
      verified: false,
      title: { ar: 'الوحدات المساندة', en: 'Support Units' },
      description: {
        ar: 'هيكل توضيحي فقط — لا يمثل الهيكل الرسمي.',
        en: 'Placeholder structure only — not the official chart.'
      }
    }
  ]
};