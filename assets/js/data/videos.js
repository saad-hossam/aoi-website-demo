/* AOI Frontend — official YouTube videos */
'use strict';

window.AOI_VIDEO_CATEGORIES = [
  { id: 'overview',  name: { ar: 'نظرة عامة', en: 'Overview' } },
  { id: 'interview', name: { ar: 'مقابلات', en: 'Interviews' } },
  { id: 'event',     name: { ar: 'فعاليات', en: 'Events' } },
  { id: 'factory',   name: { ar: 'المصانع', en: 'Factories' } }
];

window.AOI_VIDEOS = [
  {
    id: 'video-001',
    slug: 'aoi-overview-ar',
    isSample: false,
    featured: true,
    category: 'overview',
    title: {
      ar: 'الهيئة العربية للتصنيع — نسخة الفيلم باللغة العربية',
      en: 'Arab Organization for Industrialization - Arabic film'
    },
    description: {
      ar: 'فيلم تعريفي رسمي عن الهيئة العربية للتصنيع وإنجازاتها الصناعية.',
      en: 'Official overview film about AOI and its industrial achievements.'
    },
    thumbnail: 'https://img.youtube.com/vi/Nz6c3zAtDDg/hqdefault.jpg',
    sourceType: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Nz6c3zAtDDg?rel=0',
    videoUrl: null,
    publishedAt: '2023-06-26',
    duration: 998
  },
  {
    id: 'video-002',
    slug: 'helwan-helicopters',
    isSample: false,
    featured: false,
    category: 'factory',
    title: {
      ar: 'مصنع حلوان للصناعات المتطورة — 30 عاما من الريادة في صناعة المروحيات',
      en: 'Helwan Factory - 30 years of helicopter leadership'
    },
    description: {
      ar: 'استعراض لمسيرة مصنع حلوان للصناعات المتطورة في تصنيع وصيانة المروحيات.',
      en: 'Helwan Factory journey in helicopter manufacturing and maintenance.'
    },
    thumbnail: 'https://img.youtube.com/vi/G1xQpAVxAWY/hqdefault.jpg',
    sourceType: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/G1xQpAVxAWY?rel=0',
    videoUrl: null,
    publishedAt: '2024-01-15',
    duration: 644
  },
  {
    id: 'video-003',
    slug: 'drone-countermeasure',
    isSample: false,
    featured: false,
    category: 'event',
    title: {
      ar: 'نظام مضاد الطائرات بدون طيار في معرض العلمين',
      en: 'Egyptian Drone Countermeasure System at Alamein Airshow'
    },
    description: {
      ar: 'عرض نظام مضاد الطائرات بدون طيار المصري في معرض العلمين الدولي للطيران.',
      en: 'AOI drone countermeasure system at Alamein International Airshow.'
    },
    thumbnail: 'https://img.youtube.com/vi/gwhtSBqL9PY/hqdefault.jpg',
    sourceType: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/gwhtSBqL9PY?rel=0',
    videoUrl: null,
    publishedAt: '2026-09-10',
    duration: 147
  },
  {
    id: 'video-004',
    slug: 'chairman-interview-alamein',
    isSample: false,
    featured: false,
    category: 'interview',
    title: {
      ar: 'مقابلة حصرية مع رئيس الهيئة على هامش معرض العلمين',
      en: 'Exclusive interview with the AOI Chairman at Alamein'
    },
    description: {
      ar: 'حوار مع رئيس الهيئة حول التعاون والشراكات والتصنيع المحلي.',
      en: 'Interview with the AOI Chairman on partnerships and local manufacturing.'
    },
    thumbnail: 'https://img.youtube.com/vi/78gfrqDpieM/hqdefault.jpg',
    sourceType: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/78gfrqDpieM?rel=0',
    videoUrl: null,
    publishedAt: '2026-09-10',
    duration: 425
  },
  {
    id: 'video-005',
    slug: 'missiles-ai-drones',
    isSample: false,
    featured: false,
    category: 'overview',
    title: {
      ar: 'صواريخ ومقذوفات مضادة للطائرات بدون طيار بالذكاء الاصطناعي',
      en: 'Missiles and projectiles to counter drones with AI'
    },
    description: {
      ar: 'شرح تفصيلي لقدرات الهيئة في أنظمة مكافحة الطائرات بدون طيار.',
      en: 'AOI capabilities in AI-based drone counter systems.'
    },
    thumbnail: 'https://img.youtube.com/vi/4DE7dnLQafI/hqdefault.jpg',
    sourceType: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/4DE7dnLQafI?rel=0',
    videoUrl: null,
    publishedAt: '2026-09-01',
    duration: 267
  },
  {
    id: 'video-006',
    slug: 'modern-aircraft-participation',
    isSample: false,
    featured: false,
    category: 'event',
    title: {
      ar: 'مشاركة عربية قوية بطائرات حديثة في معرض العلمين',
      en: 'Strong Arab participation with modern aircraft at Alamein'
    },
    description: {
      ar: 'تغطية لمشاركة الهيئة في معرض العلمين الدولي للطيران والفضاء.',
      en: 'AOI participation at the Alamein International Air and Space Show.'
    },
    thumbnail: 'https://img.youtube.com/vi/dlD3chLSeJc/hqdefault.jpg',
    sourceType: 'youtube',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dlD3chLSeJc?rel=0',
    videoUrl: null,
    publishedAt: '2026-09-10',
    duration: 421
  }
];

window.AOI_MEDIA_IMAGES = [];
