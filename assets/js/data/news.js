/* ============================================================
   AOI Frontend — assets/js/data/news.js
   VERIFIED NEWS — sourced from aoi.org.eg.

   Only news items explicitly published by AOI are included.
   Publication dates are left `null` where AOI has not made
   them available in the source text — do NOT invent dates.
   ============================================================ */
'use strict';

window.AOI_NEWS_CATEGORIES = [
  { id: 'production',    name: { ar: 'الإنتاج',       en: 'Production' } },
  { id: 'partnership',   name: { ar: 'الشراكات',      en: 'Partnerships' } },
  { id: 'environment',   name: { ar: 'البيئة',        en: 'Environment' } },
  { id: 'defense',       name: { ar: 'الدفاع',        en: 'Defense' } },
  { id: 'automotive',    name: { ar: 'السيارات',      en: 'Automotive' } },
  { id: 'events',        name: { ar: 'الفعاليات والمعارض', en: 'Events & Exhibitions' } }
];

window.AOI_NEWS = [
  {
    id: 'news-iwwi-2026', slug: 'iwwi-2026', isSample: false, featured: true, category: 'environment', tags: [],
    title: { ar: 'مشاركة متميزة للهيئة العربية للتصنيع في المعرض والمؤتمر الدولي لتكنولوجيا المياه IWWI 2026', en: 'AOI’s Distinguished Participation in IWWI 2026 Water Technology Exhibition & Conference' },
    excerpt: { ar: 'أكد رئيس الهيئة أهمية المشاركة في الدورة الخامسة لمعرض ومؤتمر IWWI 2026 لتكنولوجيا المياه والصرف الصحي والتحلية ومعالجة وتدوير المخلفات، وتشارك الهيئة بجناح متميز ومتنوع.', en: 'The Chairman stressed the importance of AOI’s participation in the fifth edition of IWWI 2026 (water, wastewater, desalination, reuse and waste recycling), where AOI presents a distinguished and diverse pavilion.' },
    content: { ar: ['أكد رئيس الهيئة أهمية المشاركة في الدورة الخامسة لمعرض ومؤتمر IWWI 2026 لتكنولوجيا المياه والصرف الصحي والتحلية ومعالجة وتدوير المخلفات، وتشارك الهيئة بجناح متميز ومتنوع.'], en: ['The Chairman stressed the importance of AOI’s participation in the fifth edition of IWWI 2026 (water, wastewater, desalination, reuse and waste recycling), where AOI presents a distinguished and diverse pavilion.'] },
    image: 'https://www.aoi.org.eg/storage/media/8343/WhatsApp-Image-2026-10-27-at-07.05.09.jpeg', gallery: ['https://www.aoi.org.eg/storage/media/8334/WhatsApp-Image-2026-10-26-at-14.10.02.jpeg', 'https://www.aoi.org.eg/storage/media/8333/WhatsApp-Image-2026-10-22-at-14.16.58.jpeg', 'https://www.aoi.org.eg/storage/media/8317/WhatsApp-Image-2026-10-18-at-13.26.23.jpeg', 'https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg'], publishedAt: '2026-10-26'
  },
  {
    id: 'news-minister-visit-oct-2026', slug: 'minister-visit-oct-2026', isSample: false, featured: false, category: 'partnership', tags: [],
    title: { ar: 'رئيس الهيئة ووزير الدولة للإنتاج الحربي يبحثان تحقيق التكامل الصناعي وتعميق التصنيع المحلي', en: 'Chairman and Minister of State for Military Production Discuss Industrial Integration and Local Manufacturing' },
    excerpt: { ar: 'استقبل رئيس الهيئة وزير الدولة للإنتاج الحربي بمقر رئاسة الهيئة بحضور مدير عام الهيئة وعدد من رؤساء المصانع والشركات، لبحث التكامل الصناعي وتوطين التكنولوجيا في الصناعات الدفاعية والمدنية.', en: 'The Chairman received the Minister of State for Military Production at AOI headquarters, with the Director General and heads of AOI factories and companies, to discuss industrial integration and technology localization in defense and civil industries.' },
    content: { ar: ['استقبل رئيس الهيئة وزير الدولة للإنتاج الحربي بمقر رئاسة الهيئة بحضور مدير عام الهيئة وعدد من رؤساء المصانع والشركات، لبحث التكامل الصناعي وتوطين التكنولوجيا في الصناعات الدفاعية والمدنية.'], en: ['The Chairman received the Minister of State for Military Production at AOI headquarters, with the Director General and heads of AOI factories and companies, to discuss industrial integration and technology localization in defense and civil industries.'] },
    image: 'https://www.aoi.org.eg/storage/media/8334/WhatsApp-Image-2026-10-26-at-14.10.02.jpeg', gallery: ['https://www.aoi.org.eg/storage/media/8343/WhatsApp-Image-2026-10-27-at-07.05.09.jpeg', 'https://www.aoi.org.eg/storage/media/8333/WhatsApp-Image-2026-10-22-at-14.16.58.jpeg', 'https://www.aoi.org.eg/storage/media/8317/WhatsApp-Image-2026-10-18-at-13.26.23.jpeg', 'https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg'], publishedAt: '2026-10-25'
  },
  {
    id: 'news-egypt-forum-2026', slug: 'egypt-forum-2026', isSample: false, featured: false, category: 'events', tags: [],
    title: { ar: 'رئيس الهيئة يشارك في فعاليات منتدى مصر 2026 لتعزيز بيئة الاستثمار وزيادة الإنتاج والتصدير', en: 'Chairman Takes Part in Egypt Forum 2026 to Boost Investment, Production and Exports' },
    excerpt: { ar: 'يشارك رئيس الهيئة في منتدى مصر 2026 خلال الفترة من 19 إلى 24 أكتوبر تحت شعار «نظرة لليوم.. رؤية للغد»، في إطار دور الهيئة في تعميق التصنيع المحلي وتوطين التكنولوجيا.', en: 'The Chairman takes part in Egypt Forum 2026 (19–24 October, theme “A Look at Today.. A Vision for Tomorrow”), within AOI’s role in deepening local manufacturing and localizing technology.' },
    content: { ar: ['يشارك رئيس الهيئة في منتدى مصر 2026 خلال الفترة من 19 إلى 24 أكتوبر تحت شعار «نظرة لليوم.. رؤية للغد»، في إطار دور الهيئة في تعميق التصنيع المحلي وتوطين التكنولوجيا.'], en: ['The Chairman takes part in Egypt Forum 2026 (19–24 October, theme “A Look at Today.. A Vision for Tomorrow”), within AOI’s role in deepening local manufacturing and localizing technology.'] },
    image: 'https://www.aoi.org.eg/storage/media/8333/WhatsApp-Image-2026-10-22-at-14.16.58.jpeg', gallery: ['https://www.aoi.org.eg/storage/media/8343/WhatsApp-Image-2026-10-27-at-07.05.09.jpeg', 'https://www.aoi.org.eg/storage/media/8334/WhatsApp-Image-2026-10-26-at-14.10.02.jpeg', 'https://www.aoi.org.eg/storage/media/8317/WhatsApp-Image-2026-10-18-at-13.26.23.jpeg', 'https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg'], publishedAt: '2026-10-22'
  },
  {
    id: 'news-egypt-forum-session', slug: 'egypt-forum-session', isSample: false, featured: false, category: 'events', tags: [],
    title: { ar: 'رؤية جديدة لتكامل القدرات التصنيعية: مشاركة الهيئة في جلسة «نحو استثمار منتج وصناعة تنافسية»', en: 'A New Vision for Integrated Manufacturing: AOI at the “Productive Investment and Competitive Industry” Session' },
    excerpt: { ar: 'تشارك الهيئة في فعاليات منتدى مصر 2026 بالعاصمة الإدارية الجديدة في جلسة «نحو استثمار منتج وصناعة تنافسية وفرص عمل مستدامة».', en: 'AOI joins Egypt Forum 2026 in the New Administrative Capital with a session on productive investment, competitive industry and sustainable jobs.' },
    content: { ar: ['تشارك الهيئة في فعاليات منتدى مصر 2026 بالعاصمة الإدارية الجديدة في جلسة «نحو استثمار منتج وصناعة تنافسية وفرص عمل مستدامة».'], en: ['AOI joins Egypt Forum 2026 in the New Administrative Capital with a session on productive investment, competitive industry and sustainable jobs.'] },
    image: 'https://www.aoi.org.eg/storage/media/8317/WhatsApp-Image-2026-10-18-at-13.26.23.jpeg', gallery: ['https://www.aoi.org.eg/storage/media/8343/WhatsApp-Image-2026-10-27-at-07.05.09.jpeg', 'https://www.aoi.org.eg/storage/media/8334/WhatsApp-Image-2026-10-26-at-14.10.02.jpeg', 'https://www.aoi.org.eg/storage/media/8333/WhatsApp-Image-2026-10-22-at-14.16.58.jpeg', 'https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg'], publishedAt: '2026-10-18'
  },
  {
    id: 'news-waste-recycling',
    slug: 'waste-recycling-announcement',
    isSample: false,
    featured: false,
    category: 'environment',
    tags: ['recycling', 'sustainability'],
    title: {
      ar: 'الهيئة العربية للتصنيع تنفذ مصانع إعادة تدوير النفايات',
      en: 'AOI Implements Waste Recycling Plants'
    },
    excerpt: {
      ar: 'أربعة مصانع لإعادة تدوير النفايات في محافظتي كفر الشيخ والدقهلية.',
      en: 'Four waste recycling plants in Kafr El-Sheikh and Dakahlia governorates.'
    },
    content: {
      ar: [
        'نفّذت الهيئة العربية للتصنيع أربعة مصانع لإعادة تدوير النفايات في محافظتي كفر الشيخ والدقهلية.',
        'يأتي هذا المشروع ضمن جهود الهيئة في مجالات حماية البيئة ودعم التنمية المستدامة.'
      ],
      en: [
        'AOI implemented four waste recycling plants in Kafr El-Sheikh and Dakahlia governorates.',
        'The project comes within AOI’s efforts in environmental protection and support for sustainable development.'
      ]
    },
    image: null,
    gallery: [],
    publishedAt: null
  },
  {
    id: 'news-citroen-c4x',
    slug: 'citroen-c4x-production',
    isSample: false,
    featured: false,
    category: 'automotive',
    tags: ['automotive', 'local-manufacturing'],
    title: {
      ar: 'تصنيع سيتروين C4X محليًا بنسبة 45%',
      en: 'Citroën C4X Locally Manufactured with 45% Local Content'
    },
    excerpt: {
      ar: 'أعلنت الهيئة عن تصنيع سيارة سيتروين C4X محليًا بنسبة 45%.',
      en: 'AOI announced local manufacturing of the Citroën C4X with 45% local content.'
    },
    content: {
      ar: [
        'قامت الهيئة العربية للتصنيع بتصنيع سيارة سيتروين C4X محليًا.',
        'بلغت نسبة التصنيع المحلي 45%، بما يعكس التزام الهيئة بدعم التصنيع المحلي.'
      ],
      en: [
        'AOI locally manufactured the Citroën C4X.',
        'The local content ratio reached 45%, reflecting AOI’s commitment to supporting local manufacturing.'
      ]
    },
    image: null,
    gallery: [],
    publishedAt: null
  }
];