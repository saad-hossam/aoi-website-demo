/* ============================================================
   AOI Frontend — assets/js/data/products.js
   VERIFIED PRODUCTS — sourced from aoi.org.eg.

   Only product names explicitly published by AOI are included
   with `isSample: false`. Product families that AOI describes
   categorically (defense, electronics, vehicles) are included
   as real product records using those published names.

   Real products (with photos) were synced from aoi.org.eg/en/products.
   Family records further down have no photo and show a placeholder.

   Item-specific technical specifications, prices, and full
   feature lists are NOT invented — they remain empty where
   they are not published by AOI.
   ============================================================ */
'use strict';

window.AOI_PRODUCT_CATEGORIES = [
  { id: 'water',            name: { ar: 'معالجة المياه',      en: 'Water Treatment' } },
  { id: 'railways',         name: { ar: 'السكك الحديدية',     en: 'Railways' } },
  { id: 'electronics',      name: { ar: 'الإلكترونيات',       en: 'Electronics' } },
  { id: 'heavy-equipment',  name: { ar: 'المعدات الثقيلة',    en: 'Heavy Equipment' } },
  { id: 'defense',          name: { ar: 'الصناعات الدفاعية',  en: 'Defense Industries' } },
  { id: 'vehicles',         name: { ar: 'المركبات',           en: 'Vehicles' } },
  { id: 'manufacturing',    name: { ar: 'منتجات التصنيع',     en: 'Manufacturing Products' } },
  { id: 'energy',           name: { ar: 'حلول الطاقة',        en: 'Energy Solutions' } }
];

window.AOI_PRODUCTS = [
  {
    id: 'product-chlorine-cylinder-sakr-1', slug: 'chlorine-cylinder-sakr-1', isSample: false, category: 'water',
    name: { ar: 'أسطوانة كلور (صقر-1) سعة 1 طن', en: 'Chlorine Cylinder (SAKR-1) capacity 1 ton' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: معالجة المياه.', en: 'Product published on AOI’s official website in the field of Water Treatment.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', gallery: ['https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg', 'https://www.aoi.org.eg/storage/media/8236/WhatsApp-Image-2026-10-07-at-11.10.27-AM.jpeg', 'https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg', 'https://www.aoi.org.eg/storage/media/6383/fa779f17-6ad0-43ab-a405-3110d4a9f78c-removebg-preview-removebg-preview.png'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=2'
  },
  {
    id: 'product-hdpe-pipes', slug: 'hdpe-pipes', isSample: false, category: 'water',
    name: { ar: 'مواسير البولي إيثيلين عالي الكثافة (HDPE) لشبكات المياه والصرف ومكافحة الحريق', en: 'High Density Polyethylene Pipes (HDPE) for Water, Wastewater and Firefighting Networks' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: معالجة المياه.', en: 'Product published on AOI’s official website in the field of Water Treatment.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg', gallery: ['https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8236/WhatsApp-Image-2026-10-07-at-11.10.27-AM.jpeg', 'https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg', 'https://www.aoi.org.eg/storage/media/6383/fa779f17-6ad0-43ab-a405-3110d4a9f78c-removebg-preview-removebg-preview.png'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=2'
  },
  {
    id: 'product-upvc-pipes', slug: 'upvc-pipes', isSample: false, category: 'water',
    name: { ar: 'مواسير UPVC لشبكات مياه الشرب والصرف الصحي', en: 'UPVC Pipes for Potable Water and Sanitary Networks' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: معالجة المياه.', en: 'Product published on AOI’s official website in the field of Water Treatment.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/8236/WhatsApp-Image-2026-10-07-at-11.10.27-AM.jpeg', gallery: ['https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg', 'https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg', 'https://www.aoi.org.eg/storage/media/6383/fa779f17-6ad0-43ab-a405-3110d4a9f78c-removebg-preview-removebg-preview.png'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=2'
  },
  {
    id: 'product-railway-coaches', slug: 'railway-coaches', isSample: false, category: 'railways',
    name: { ar: 'عربات السكك الحديدية ومترو الأنفاق والترام', en: 'Railway, Subway and Tram Coaches' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: السكك الحديدية.', en: 'Product published on AOI’s official website in the field of Railways.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg', gallery: ['https://www.aoi.org.eg/storage/media/6383/fa779f17-6ad0-43ab-a405-3110d4a9f78c-removebg-preview-removebg-preview.png', 'https://www.aoi.org.eg/storage/media/6279/002.png', 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=3'
  },
  {
    id: 'product-grain-wagon', slug: 'grain-wagon', isSample: false, category: 'railways',
    name: { ar: 'عربة نقل الحبوب', en: 'Grain Wagon' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: السكك الحديدية.', en: 'Product published on AOI’s official website in the field of Railways.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/6383/fa779f17-6ad0-43ab-a405-3110d4a9f78c-removebg-preview-removebg-preview.png', gallery: ['https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg', 'https://www.aoi.org.eg/storage/media/6279/002.png', 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=3'
  },
  {
    id: 'product-tank-wagon', slug: 'tank-wagon', isSample: false, category: 'railways',
    name: { ar: 'عربة صهريج', en: 'Tank Wagon' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: السكك الحديدية.', en: 'Product published on AOI’s official website in the field of Railways.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/6279/002.png', gallery: ['https://www.aoi.org.eg/storage/media/6280/DSC_0908.jpg', 'https://www.aoi.org.eg/storage/media/6383/fa779f17-6ad0-43ab-a405-3110d4a9f78c-removebg-preview-removebg-preview.png', 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=3'
  },
  {
    id: 'product-vehicle-plates', slug: 'vehicle-plates', isSample: false, category: 'vehicles',
    name: { ar: 'اللوحات المعدنية المرورية المؤمنة للسيارات والدراجات النارية', en: 'Plate Number for Vehicles and Motorcycles' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: المركبات.', en: 'Product published on AOI’s official website in the field of Vehicles.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/6021/lo7a.jpg', gallery: ['https://www.aoi.org.eg/storage/media/7509/kandi-6-ride-blue.png', 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg', 'https://www.aoi.org.eg/storage/media/8236/WhatsApp-Image-2026-10-07-at-11.10.27-AM.jpeg'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=4'
  },
  {
    id: 'product-kandi-golf-4-seat', slug: 'kandi-golf-4-seat', isSample: false, category: 'vehicles',
    name: { ar: 'عربة جولف كاندي 4 مقاعد', en: 'Kandi Golf Cart (4 seats)' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: المركبات.', en: 'Product published on AOI’s official website in the field of Vehicles.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/7509/kandi-6-ride-blue.png', gallery: ['https://www.aoi.org.eg/storage/media/6021/lo7a.jpg', 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg', 'https://www.aoi.org.eg/storage/media/8236/WhatsApp-Image-2026-10-07-at-11.10.27-AM.jpeg'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=4'
  },
  {
    id: 'product-lighting-poles', slug: 'lighting-poles', isSample: false, category: 'energy',
    name: { ar: 'تصنيع أعمدة الإنارة', en: 'Manufacturing Lighting Poles' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: حلول الطاقة.', en: 'Product published on AOI’s official website in the field of Energy Solutions.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/858/conversions/1616064777.%D8%B9%D9%85%D9%88%D8%AF-%D8%AC%D9%87%D8%AF-%D9%85%D9%86%D8%AE%D9%81%D8%B8-thumb.jpg', gallery: ['https://www.aoi.org.eg/storage/media/886/conversions/1576769371.2-thumb.jpg', 'https://www.aoi.org.eg/storage/media/890/conversions/1576768186.%D8%A7%D8%B9%D9%85%D8%AF%D8%A9-%D8%A7%D9%86%D8%A7%D8%B1%D8%A9-4-thumb.jpg', 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=8'
  },
  {
    id: 'product-pv-module-production', slug: 'pv-module-production', isSample: false, category: 'energy',
    name: { ar: 'خط إنتاج الألواح الشمسية (PV)', en: 'PV Module Production' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: حلول الطاقة.', en: 'Product published on AOI’s official website in the field of Energy Solutions.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/886/conversions/1576769371.2-thumb.jpg', gallery: ['https://www.aoi.org.eg/storage/media/858/conversions/1616064777.%D8%B9%D9%85%D9%88%D8%AF-%D8%AC%D9%87%D8%AF-%D9%85%D9%86%D8%AE%D9%81%D8%B8-thumb.jpg', 'https://www.aoi.org.eg/storage/media/890/conversions/1576768186.%D8%A7%D8%B9%D9%85%D8%AF%D8%A9-%D8%A7%D9%86%D8%A7%D8%B1%D8%A9-4-thumb.jpg', 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=8'
  },
  {
    id: 'product-solar-lighting-poles', slug: 'solar-lighting-poles', isSample: false, category: 'energy',
    name: { ar: 'أعمدة الإنارة بالطاقة الشمسية', en: 'Solar Lighting Poles' },
    shortDescription: { ar: 'منتج منشور على الموقع الرسمي للهيئة ضمن مجال: حلول الطاقة.', en: 'Product published on AOI’s official website in the field of Energy Solutions.' },
    description: { ar: '', en: '' },
    image: 'https://www.aoi.org.eg/storage/media/890/conversions/1576768186.%D8%A7%D8%B9%D9%85%D8%AF%D8%A9-%D8%A7%D9%86%D8%A7%D8%B1%D8%A9-4-thumb.jpg', gallery: ['https://www.aoi.org.eg/storage/media/858/conversions/1616064777.%D8%B9%D9%85%D9%88%D8%AF-%D8%AC%D9%87%D8%AF-%D9%85%D9%86%D8%AE%D9%81%D8%B8-thumb.jpg', 'https://www.aoi.org.eg/storage/media/886/conversions/1576769371.2-thumb.jpg', 'https://www.aoi.org.eg/storage/media/2963/DSC_0219.jpg', 'https://www.aoi.org.eg/storage/media/8230/WhatsApp-Image-2026-10-07-at-11.49.37-AM-%281%29.jpeg'],
    specifications: [], features: [], applications: [],
    sourceUrl: 'https://www.aoi.org.eg/en/products?category=8'
  },
  /* ---------------- ELECTRONICS ---------------- */
  {
    id: 'product-electronics',
    slug: 'electronics-family',
    isSample: false,
    category: 'electronics',
    name: {
      ar: 'الإلكترونيات الاستهلاكية',
      en: 'Consumer Electronics'
    },
    shortDescription: {
      ar: 'تشمل شاشات التلفزيون، المكيفات، المكانس الكهربائية، المراوح، أجهزة الميكروويف، كاميرات المراقبة، الحواسيب، الأجهزة اللوحية، والهواتف المحمولة.',
      en: 'Includes television screens, air conditioners, vacuum cleaners, fans, microwave ovens, surveillance cameras, computers, tablets, and mobile phones.'
    },
    description: {
      ar: 'تنتج الهيئة العربية للتصنيع مجموعة واسعة من المنتجات الإلكترونية الاستهلاكية من خلال شركاتها المتخصصة. تُعرَض هذه الفئة بشكل تجميعي وفقًا لما ينشره الموقع الرسمي.',
      en: 'AOI manufactures a wide range of consumer electronics through its specialized companies. This category is presented collectively, following the official website’s description.'
    },
    image: null,
    gallery: [],
    specifications: [],
    features: [],
    applications: []
  },

  /* ---------------- HEAVY EQUIPMENT ---------------- */
  {
    id: 'product-heavy-equipment',
    slug: 'heavy-equipment-family',
    isSample: false,
    category: 'heavy-equipment',
    name: {
      ar: 'المعدات الثقيلة والصناعية',
      en: 'Heavy & Industrial Equipment'
    },
    shortDescription: {
      ar: 'تشمل المعدات الصناعية والإنشائية التي تنتجها الهيئة عبر شركاتها المتخصصة.',
      en: 'Includes the industrial and construction equipment produced by AOI through its specialized companies.'
    },
    description: {
      ar: 'تُصنّع الهيئة معدات ثقيلة وصناعية موجهة لقطاعات البناء والبنية التحتية والتصنيع.',
      en: 'AOI manufactures heavy and industrial equipment serving construction, infrastructure, and manufacturing sectors.'
    },
    image: null,
    gallery: [],
    specifications: [],
    features: [],
    applications: []
  },

  /* ---------------- DEFENSE ---------------- */
  {
    id: 'product-fahd-armored-vehicle',
    slug: 'fahd-armored-vehicle',
    isSample: false,
    category: 'defense',
    name: {
      ar: 'مركبة فهد المدرعة',
      en: 'Fahd Armored Vehicle'
    },
    shortDescription: {
      ar: 'مركبة مدرعة من إنتاج الهيئة العربية للتصنيع.',
      en: 'Armored vehicle produced by the Arab Organization for Industrialization.'
    },
    description: {
      ar: 'مركبة فهد المدرعة هي أحد المنتجات الدفاعية التي تنتجها الهيئة العربية للتصنيع.',
      en: 'The Fahd armored vehicle is one of the defense products manufactured by the Arab Organization for Industrialization.'
    },
    image: null,
    gallery: [],
    specifications: [],
    features: [],
    applications: []
  },
  {
    id: 'product-haris-system',
    slug: 'haris-anti-drone-system',
    isSample: false,
    category: 'defense',
    name: {
      ar: 'نظام HARIS لكشف الطائرات بدون طيار',
      en: 'HARIS Anti-Drone Detection System'
    },
    shortDescription: {
      ar: 'نظام دفاعي لكشف الطائرات بدون طيار من إنتاج الهيئة.',
      en: 'Defense system for detecting unmanned aerial vehicles, produced by AOI.'
    },
    description: {
      ar: 'نظام HARIS هو أحد الأنظمة الدفاعية التي تنتجها الهيئة العربية للتصنيع لكشف الطائرات بدون طيار.',
      en: 'The HARIS system is one of the defense systems produced by AOI for detecting unmanned aerial vehicles.'
    },
    image: null,
    gallery: [],
    specifications: [],
    features: [],
    applications: []
  },

  /* ---------------- VEHICLES ---------------- */
  {
    id: 'product-citroen-c4x',
    slug: 'citroen-c4x',
    isSample: false,
    category: 'vehicles',
    name: {
      ar: 'سيتروين C4X',
      en: 'Citroën C4X'
    },
    shortDescription: {
      ar: 'سيارة سيتروين C4X المصنّعة محليًا بنسبة 45%.',
      en: 'Citroën C4X locally manufactured with 45% local content.'
    },
    description: {
      ar: 'تُصنّع الهيئة العربية للتصنيع سيارة سيتروين C4X محليًا بنسبة تصنيع محلي تبلغ 45%.',
      en: 'AOI locally manufactures the Citroën C4X with 45% local content.'
    },
    image: null,
    gallery: [],
    specifications: [
      {
        label: { ar: 'نسبة التصنيع المحلي', en: 'Local Content' },
        value: { ar: '45%', en: '45%' }
      }
    ],
    features: [],
    applications: []
  },

  /* ---------------- MANUFACTURING ---------------- */
  {
    id: 'product-manufacturing',
    slug: 'manufacturing-family',
    isSample: false,
    category: 'manufacturing',
    name: {
      ar: 'منتجات التصنيع الصناعي',
      en: 'Industrial Manufacturing Products'
    },
    shortDescription: {
      ar: 'تشمل المنتجات الصناعية التي تنتجها الهيئة في مجالات التصنيع المتعددة.',
      en: 'Includes the industrial products manufactured by AOI across its manufacturing sectors.'
    },
    description: {
      ar: 'تنتج الهيئة العربية للتصنيع طائفة واسعة من المنتجات الصناعية عبر شركاتها المتخصصة.',
      en: 'AOI produces a wide range of industrial products through its specialized companies.'
    },
    image: null,
    gallery: [],
    specifications: [],
    features: [],
    applications: []
  }
];