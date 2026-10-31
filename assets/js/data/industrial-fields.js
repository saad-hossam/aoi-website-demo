/* ============================================================
   AOI Frontend — assets/data/industrial-fields.js
   VERIFIED INDUSTRIAL FIELDS — sourced from aoi.org.eg.

   Sector names correspond to AOI's own published description
   of the industrial domains it operates in. Descriptions are
   paraphrased from AOI's official statements.
   ============================================================ */
'use strict';

window.AOI_DATA_FIELDS = [
  {
    id: 'electronics',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    icon: 'fa-microchip',
    category: 'technology',
    title: { ar: 'الإلكترونيات', en: 'Electronics' },
    description: {
      ar: 'تشمل الإلكترونيات الاستهلاكية وأنظمة الاتصالات والحواسيب والأجهزة اللوحية.',
      en: 'Includes consumer electronics, communications systems, computers, and tablets.'
    }
  },
  {
    id: 'defense',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    icon: 'fa-shield-halved',
    category: 'defense',
    title: { ar: 'الصناعات الدفاعية', en: 'Defense Industries' },
    description: {
      ar: 'تشمل الذخائر والصواريخ والمعدات الإلكترونية والطائرات والمركبات المدرعة.',
      en: 'Includes ammunition, missiles, electronic equipment, aircraft, and armored vehicles.'
    }
  },
  {
    id: 'aviation',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    icon: 'fa-plane',
    category: 'defense',
    title: { ar: 'الصناعات الجوية', en: 'Aviation Industries' },
    description: {
      ar: 'تشمل تصنيع الطائرات والأنظمة الجوية ذات الصلة.',
      en: 'Includes aircraft manufacturing and related aviation systems.'
    }
  },
  {
    id: 'automotive',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    icon: 'fa-car',
    category: 'manufacturing',
    title: { ar: 'السيارات', en: 'Automotive' },
    description: {
      ar: 'تشمل تصنيع السيارات محليًا مثل سيتروين C4X.',
      en: 'Includes local vehicle manufacturing such as the Citroën C4X.'
    }
  },
  {
    id: 'heavy-equipment',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    icon: 'fa-tractor',
    category: 'manufacturing',
    title: { ar: 'المعدات الثقيلة', en: 'Heavy Equipment' },
    description: {
      ar: 'تشمل المعدات الصناعية والإنشائية التي تنتجها الهيئة.',
      en: 'Includes industrial and construction equipment produced by AOI.'
    }
  },
  {
    id: 'environment',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b4b5?w=800&q=80',
    icon: 'fa-recycle',
    category: 'environment',
    title: { ar: 'إعادة التدوير والبيئة', en: 'Recycling & Environment' },
    description: {
      ar: 'تشمل مشاريع إعادة تدوير النفايات في محافظات مصر.',
      en: 'Includes waste recycling projects across Egyptian governorates.'
    }
  },
  {
    id: 'chemicals',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    icon: 'fa-flask',
    category: 'manufacturing',
    title: { ar: 'الصناعات الكيميائية', en: 'Chemical Industries' },
    description: {
      ar: 'تشمل الصناعات الكيميائية والمواد الصناعية المرتبطة بها.',
      en: 'Includes chemical industries and related industrial materials.'
    }
  },
  {
    id: 'metal',
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80',
    icon: 'fa-hammer',
    category: 'manufacturing',
    title: { ar: 'التشكيل المعدني', en: 'Metal Forming' },
    description: {
      ar: 'تشمل أعمال التشكيل المعدني والتصنيع المعدني.',
      en: 'Includes metal forming and metal manufacturing works.'
    }
  }
];