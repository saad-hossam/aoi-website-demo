/* ============================================================
   AOI Frontend — assets/js/data/projects.js
   VERIFIED PROJECTS — sourced from aoi.org.eg.

   Only projects explicitly published by AOI are included.
   Dates, budgets, and technical scopes are NOT invented — they
   remain null where AOI has not published them.
   ============================================================ */
'use strict';

window.AOI_PROJECT_CATEGORIES = [
  { id: 'water',            name: { ar: 'معالجة المياه',        en: 'Water Treatment' } },
  { id: 'waste-recycling', name: { ar: 'إعادة تدوير النفايات', en: 'Waste Recycling' } },
  { id: 'automotive',      name: { ar: 'السيارات',            en: 'Automotive' } },
  { id: 'defense',         name: { ar: 'الصناعات الدفاعية',  en: 'Defense' } },
  { id: 'manufacturing',   name: { ar: 'التصنيع',             en: 'Manufacturing' } }
];

window.AOI_PROJECTS = [
  {
    id: 'project-farshout', slug: 'farshout-water-plant', isSample: false, category: 'water',
    title: { ar: 'محطة تنقية مياه الشرب فارشوط – قنا (35 ألف م³/يوم)', en: 'Farshout Drinking Water Plant – Qena (35,000 m³/day)' },
    shortDescription: { ar: 'محطة تنقية مياه الشرب فارشوط – قنا (35 ألف م³/يوم)', en: 'Farshout Drinking Water Plant – Qena (35,000 m³/day)' },
    description: { ar: 'محطة تنقية مياه الشرب فارشوط – قنا (35 ألف م³/يوم)', en: 'Farshout Drinking Water Plant – Qena (35,000 m³/day)' },
    image: 'https://www.aoi.org.eg/storage/media/5387/farshot.png', gallery: [],
    location: { ar: 'قنا، مصر', en: 'Qena, Egypt' },
    startDate: null, endDate: null, status: null, scope: [], technicalDetails: [], applications: []
  },
  {
    id: 'project-dahab-island', slug: 'dahab-island-water-plant', isSample: false, category: 'water',
    title: { ar: 'توسعات محطة مياه جزيرة الدهب – الجيزة (160 ألف م³/يوم)', en: 'Dahab Island Water Plant Expansion – Giza (160,000 m³/day)' },
    shortDescription: { ar: 'توسعات محطة مياه جزيرة الدهب – الجيزة (160 ألف م³/يوم)', en: 'Dahab Island Water Plant Expansion – Giza (160,000 m³/day)' },
    description: { ar: 'توسعات محطة مياه جزيرة الدهب – الجيزة (160 ألف م³/يوم)', en: 'Dahab Island Water Plant Expansion – Giza (160,000 m³/day)' },
    image: 'https://www.aoi.org.eg/storage/media/5388/dahab.png', gallery: [],
    location: { ar: 'الجيزة، مصر', en: 'Giza, Egypt' },
    startDate: null, endDate: null, status: null, scope: [], technicalDetails: [], applications: []
  },
  {
    id: 'project-elevator-components', slug: 'elevator-components', isSample: false, category: 'manufacturing',
    title: { ar: 'مكونات المصاعد', en: 'Elevator Components' },
    shortDescription: { ar: 'مكونات المصاعد', en: 'Elevator Components' },
    description: { ar: 'مكونات المصاعد', en: 'Elevator Components' },
    image: 'https://www.aoi.org.eg/storage/media/8177/passangers-elevator.webp', gallery: [],
    location: { ar: 'مصر', en: 'Egypt' },
    startDate: null, endDate: null, status: null, scope: [], technicalDetails: [], applications: []
  },
  {
    id: 'project-ambulances', slug: 'ambulances-medical-vehicles', isSample: false, category: 'automotive',
    title: { ar: 'عربات الإسعاف والخدمات الطبية المختلفة', en: 'Ambulances and Medical Service Vehicles' },
    shortDescription: { ar: 'عربات الإسعاف والخدمات الطبية المختلفة', en: 'Ambulances and Medical Service Vehicles' },
    description: { ar: 'عربات الإسعاف والخدمات الطبية المختلفة', en: 'Ambulances and Medical Service Vehicles' },
    image: 'https://www.aoi.org.eg/storage/media/8174/6aaa61630cce0_1789550947.webp', gallery: [],
    location: { ar: 'مصر', en: 'Egypt' },
    startDate: null, endDate: null, status: null, scope: [], technicalDetails: [], applications: []
  },
  {
    id: 'project-waste-recycling',
    slug: 'waste-recycling-plants',
    isSample: false,
    category: 'waste-recycling',
    title: {
      ar: 'مصانع إعادة تدوير النفايات في كفر الشيخ والدقهلية',
      en: 'Waste Recycling Plants in Kafr El-Sheikh and Dakahlia'
    },
    shortDescription: {
      ar: 'أربعة مصانع لإعادة تدوير النفايات في محافظتي كفر الشيخ والدقهلية.',
      en: 'Four waste recycling plants in Kafr El-Sheikh and Dakahlia governorates.'
    },
    description: {
      ar: 'نفّذت الهيئة العربية للتصنيع أربعة مصانع لإعادة تدوير النفايات في محافظتي كفر الشيخ والدقهلية، ضمن جهودها في مجال حماية البيئة والتنمية المستدامة.',
      en: 'AOI implemented four waste recycling plants in Kafr El-Sheikh and Dakahlia governorates as part of its environmental protection and sustainable development efforts.'
    },
    image: null,
    gallery: [],
    location: {
      ar: 'كفر الشيخ والدقهلية، مصر',
      en: 'Kafr El-Sheikh and Dakahlia, Egypt'
    },
    startDate: null,
    endDate: null,
    status: null,
    scope: [],
    technicalDetails: [],
    applications: []
  },
  {
    id: 'project-citroen-c4x',
    slug: 'citroen-c4x-production',
    isSample: false,
    category: 'automotive',
    title: {
      ar: 'تصنيع سيتروين C4X محليًا',
      en: 'Local Manufacturing of Citroën C4X'
    },
    shortDescription: {
      ar: 'تصنيع سيارة سيتروين C4X بنسبة تصنيع محلي 45%.',
      en: 'Manufacturing the Citroën C4X with 45% local content.'
    },
    description: {
      ar: 'قامت الهيئة العربية للتصنيع بتصنيع سيارة سيتروين C4X محليًا بنسبة تصنيع محلي بلغت 45%.',
      en: 'AOI locally manufactured the Citroën C4X with a local content ratio of 45%.'
    },
    image: null,
    gallery: [],
    location: null,
    startDate: null,
    endDate: null,
    status: null,
    scope: [],
    technicalDetails: [
      {
        label: { ar: 'نسبة التصنيع المحلي', en: 'Local Content' },
        value: { ar: '45%', en: '45%' }
      }
    ],
    applications: []
  }
];