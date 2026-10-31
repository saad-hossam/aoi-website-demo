/* ============================================================
   AOI Frontend — assets/js/data/faqs.js
   FAQ dataset updated with verified facts from aoi.org.eg.

   All answers now trace to verified content. Items depending
   on unpublished facts remain marked `requiresVerification`.
   ============================================================ */
'use strict';

window.AOI_FAQ_CATEGORIES = [
  { id: 'general',       name: { ar: 'معلومات عامة',       en: 'General Information' } },
  { id: 'products',      name: { ar: 'المنتجات',           en: 'Products' } },
  { id: 'projects',      name: { ar: 'المشروعات',          en: 'Projects' } },
  { id: 'capabilities',  name: { ar: 'القدرات',            en: 'Capabilities' } },
  { id: 'media',         name: { ar: 'المركز الإعلامي',    en: 'Media Center' } },
  { id: 'contact',       name: { ar: 'التواصل',            en: 'Contact' } },
  { id: 'careers',       name: { ar: 'الوظائف',            en: 'Careers' } }
];

window.AOI_FAQS = [
  {
    id: 'faq-about',
    category: 'general',
    requiresVerification: false,
    question: {
      ar: 'كيف يمكنني التعرف على الهيئة العربية للتصنيع؟',
      en: 'How can I learn about the Arab Organization for Industrialization?'
    },
    answer: {
      ar: 'تأسست الهيئة العربية للتصنيع عام 1975 بمشاركة مصر والسعودية والإمارات وقطر، وأصبحت مصر المالك الوحيد لها عام 1993. رؤيتها أن تكون أحد أكبر وأقوى وأكثر تنوعًا المنصات الصناعية القائمة على التكنولوجيا في مصر والعالم العربي وأفريقيا والعالم.',
      en: 'The Arab Organization for Industrialization was founded in 1975 with the participation of Egypt, Saudi Arabia, the UAE, and Qatar, and became fully Egyptian-owned in 1993. Its vision is to be one of the largest, strongest, and most diversified technology-driven industrial platforms in Egypt, the Arab world, Africa, and beyond.'
    },
    relatedLinks: [
      { href: 'about.html', label: { ar: 'نبذة عن الهيئة', en: 'About AOI' }, icon: 'fa-building-columns' },
      { href: 'history.html', label: { ar: 'التاريخ والمحطات', en: 'History & Milestones' }, icon: 'fa-timeline' }
    ]
  },
  {
    id: 'faq-fields',
    category: 'general',
    requiresVerification: false,
    question: {
      ar: 'ما هي المجالات الصناعية التي تغطيها الهيئة؟',
      en: 'What industrial fields does the organization cover?'
    },
    answer: {
      ar: 'تعمل الهيئة في مجالات متعددة تشمل: الإلكترونيات، الصناعات الدفاعية، الصناعات الجوية، السيارات، المعدات الثقيلة، إعادة التدوير والبيئة، الصناعات الكيميائية، والتشكيل المعدني.',
      en: 'AOI operates across multiple sectors including: electronics, defense industries, aviation, automotive, heavy equipment, recycling & environment, chemical industries, and metal forming.'
    },
    relatedLinks: [
      { href: 'industrial-fields.html', label: { ar: 'المجالات الصناعية', en: 'Industrial Fields' }, icon: 'fa-industry' }
    ]
  },
  {
    id: 'faq-products-browse',
    category: 'products',
    requiresVerification: false,
    question: {
      ar: 'ما المنتجات التي تنتجها الهيئة؟',
      en: 'What products does AOI produce?'
    },
    answer: {
      ar: 'تشمل منتجات الهيئة: الإلكترونيات الاستهلاكية (شاشات تلفزيون، مكيفات، مكانس، مراوح، ميكروويف، كاميرات مراقبة، حواسيب، أجهزة لوحية، هواتف محمولة)، المعدات الثقيلة، المنتجات الدفاعية (ذخائر، صواريخ، طائرات، مركبة فهد المدرعة، نظام HARIS)، ومركبات مثل سيتروين C4X.',
      en: 'AOI products include: consumer electronics (TV screens, air conditioners, vacuum cleaners, fans, microwaves, surveillance cameras, computers, tablets, mobile phones), heavy equipment, defense products (ammunition, missiles, aircraft, Fahd armored vehicle, HARIS system), and vehicles such as the Citroën C4X.'
    },
    relatedLinks: [
      { href: 'products.html', label: { ar: 'المنتجات', en: 'Products' }, icon: 'fa-cubes' }
    ]
  },
  {
    id: 'faq-products-availability',
    category: 'products',
    requiresVerification: true,
    question: {
      ar: 'هل تتوفر معلومات عن أسعار المنتجات أو توفرها؟',
      en: 'Is pricing or availability information for products provided?'
    },
    answer: {
      ar: 'لا يتضمن الموقع الحالي معلومات عن الأسعار أو التوفر. يُرجى التواصل مع الهيئة للاستفسار عن أي منتج بعينه.',
      en: 'The current site does not include pricing or availability information. Please contact the organization for inquiries about a specific product.'
    },
    relatedLinks: [
      { href: 'contact.html', label: { ar: 'اتصل بنا', en: 'Contact Us' }, icon: 'fa-envelope' }
    ]
  },
  {
    id: 'faq-projects-browse',
    category: 'projects',
    requiresVerification: false,
    question: {
      ar: 'ما أبرز المشروعات التي نفذتها الهيئة؟',
      en: 'What are AOI’s notable projects?'
    },
    answer: {
      ar: 'من أبرز مشروعات الهيئة: أربعة مصانع لإعادة تدوير النفايات في كفر الشيخ والدقهلية، وتصنيع سيارة سيتروين C4X محليًا بنسبة 45%.',
      en: 'AOI’s notable projects include: four waste recycling plants in Kafr El-Sheikh and Dakahlia, and local manufacturing of the Citroën C4X with 45% local content.'
    },
    relatedLinks: [
      { href: 'projects.html', label: { ar: 'المشروعات', en: 'Projects' }, icon: 'fa-diagram-project' }
    ]
  },
  {
    id: 'faq-capabilities-overview',
    category: 'capabilities',
    requiresVerification: false,
    question: {
      ar: 'أين يمكنني الاطلاع على قدرات الهيئة؟',
      en: 'Where can I review the organization’s capabilities?'
    },
    answer: {
      ar: 'تعرض صفحة «القدرات» نظرة عامة على محاور القدرات الصناعية والهندسية والتقنية، مع روابط إلى مجالات ذات صلة.',
      en: 'The Capabilities page presents an overview of industrial, engineering, and technical capability focus areas, with links to related sections.'
    },
    relatedLinks: [
      { href: 'capabilities.html', label: { ar: 'القدرات', en: 'Capabilities' }, icon: 'fa-gears' }
    ]
  },
  {
    id: 'faq-media-news',
    category: 'media',
    requiresVerification: false,
    question: {
      ar: 'كيف يمكنني متابعة أخبار الهيئة؟',
      en: 'How can I follow the organization’s news?'
    },
    answer: {
      ar: 'تتيح صفحة «الأخبار» البحث والتصفية حسب الفئة ومتابعة المقالات المتاحة، مع صفحات تفاصيل مستقلة.',
      en: 'The News page offers search, category filtering, and access to available articles, each with a dedicated details page.'
    },
    relatedLinks: [
      { href: 'news.html', label: { ar: 'الأخبار', en: 'News' }, icon: 'fa-newspaper' }
    ]
  },
  {
    id: 'faq-media-videos',
    category: 'media',
    requiresVerification: false,
    question: {
      ar: 'هل يمكن مشاهدة الفيديوهات؟',
      en: 'Are videos available to watch?'
    },
    answer: {
      ar: 'تعرض صفحة «الفيديوهات» مقاطع مرئية عند توفر مصادرها المعتمدة. عند تعذر المصدر، يظهر إشعار واضح بذلك.',
      en: 'The Videos page presents playable media when approved sources are available. When no source is present, a clear notice is displayed.'
    },
    relatedLinks: [
      { href: 'videos.html', label: { ar: 'الفيديوهات', en: 'Videos' }, icon: 'fa-video' }
    ]
  },
  {
    id: 'faq-contact-how',
    category: 'contact',
    requiresVerification: false,
    question: {
      ar: 'كيف يمكنني التواصل مع الهيئة؟',
      en: 'How can I contact the organization?'
    },
    answer: {
      ar: 'صفحة «اتصل بنا» تعرض بيانات التواصل الرسمية (عند نشرها) مع نموذج مراسلة. جميع الحقول تُفحص محليًا داخل المتصفح فقط ولا يتم إرسالها إلى خادم.',
      en: 'The Contact Us page presents official contact information (when published) along with a contact form. All fields are validated locally in the browser only; nothing is transmitted to a server.'
    },
    relatedLinks: [
      { href: 'contact.html', label: { ar: 'اتصل بنا', en: 'Contact Us' }, icon: 'fa-envelope' }
    ]
  },
  {
    id: 'faq-contact-response',
    category: 'contact',
    requiresVerification: true,
    question: {
      ar: 'ما المدة المتوقعة للرد على الاستفسارات؟',
      en: 'What is the expected response time for inquiries?'
    },
    answer: {
      ar: 'لم يتم نشر توقيت رسمي للرد. يُرجى مراجعة القنوات الرسمية للهيئة أو التواصل المباشر للاستفسار.',
      en: 'No official response time has been published. Please refer to the organization’s official channels or contact directly for more information.'
    },
    relatedLinks: [
      { href: 'contact.html', label: { ar: 'اتصل بنا', en: 'Contact Us' }, icon: 'fa-envelope' }
    ]
  },
  {
    id: 'faq-careers-vacancies',
    category: 'careers',
    requiresVerification: false,
    question: {
      ar: 'كيف أستعرض الوظائف المتاحة؟',
      en: 'How do I browse available vacancies?'
    },
    answer: {
      ar: 'تُعلن الهيئة عن الوظائف المتاحة فقط عبر الجريدة الرسمية والموقع الرسمي للهيئة. لا تُعد المواقع الأخرى قنوات معتمدة للتوظيف.',
      en: 'AOI announces available vacancies only through the official newspaper and the official AOI website. No other channels are authorized for recruitment.'
    },
    relatedLinks: [
      { href: 'careers.html', label: { ar: 'الوظائف', en: 'Careers' }, icon: 'fa-briefcase' }
    ]
  },
  {
    id: 'faq-careers-apply',
    category: 'careers',
    requiresVerification: false,
    question: {
      ar: 'كيف أتقدم إلى وظيفة؟',
      en: 'How do I apply for a vacancy?'
    },
    answer: {
      ar: 'يتم التقديم عبر القناة الرسمية المعتمدة فقط (الجريدة الرسمية والموقع الرسمي)، ولا يوفر الموقع الإلكتروني نموذجًا للتقديم الإلكتروني.',
      en: 'Applications are accepted only through the official authorized channels (the official newspaper and the official website). The website does not provide an online application form.'
    },
    relatedLinks: [
      { href: 'careers.html', label: { ar: 'الوظائف', en: 'Careers' }, icon: 'fa-briefcase' }
    ]
  }
];