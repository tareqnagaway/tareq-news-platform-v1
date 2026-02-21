// constants.ts - الثوابت العامة للموقع

import { SiteMetadata, Category, RSSSource } from './types';

// معلومات الموقع
export const SITE_METADATA: SiteMetadata = {
  title: 'منصة طارق الإخبارية',
  description: 'منصة إخبارية عربية شاملة تقدم أحدث الأخبار والتحليلات من مختلف أنحاء العالم',
  url: 'https://ar.tareq.live',
  logo: 'https://f.top4top.io/p_3704g9rel2.png',
  favicon: 'https://e.top4top.io/p_3704c4i0l1.png',
  email: 'info@tareq.live',
  social: {
    instagram: '@tareq.live',
    facebook: 'https://facebook.com/www.tareq.live',
  },
  analytics: {
    googleAnalyticsId: 'G-93VZRV27VT',
    googleAdsenseId: 'pub-7070515810008388',
  },
};

// الفئات
export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'أخبار عالمية',
    slug: 'world-news',
    description: 'آخر الأخبار والتطورات من مختلف أنحاء العالم',
    icon: '🌍',
    color: '#0ea5e9',
    order: 1,
  },
  {
    id: '2',
    name: 'سياسة',
    slug: 'politics',
    description: 'الأخبار السياسية والتحليلات',
    icon: '🏛️',
    color: '#8b5cf6',
    order: 2,
  },
  {
    id: '3',
    name: 'اقتصاد',
    slug: 'economy',
    description: 'أخبار الاقتصاد والأعمال',
    icon: '💼',
    color: '#10b981',
    order: 3,
  },
  {
    id: '4',
    name: 'تكنولوجيا',
    slug: 'technology',
    description: 'آخر أخبار التقنية والابتكار',
    icon: '💻',
    color: '#3b82f6',
    order: 4,
  },
  {
    id: '5',
    name: 'رياضة',
    slug: 'sports',
    description: 'أخبار الرياضة والبطولات',
    icon: '⚽',
    color: '#ef4444',
    order: 5,
  },
  {
    id: '6',
    name: 'صحة',
    slug: 'health',
    description: 'أخبار الصحة والطب',
    icon: '🏥',
    color: '#06b6d4',
    order: 6,
  },
  {
    id: '7',
    name: 'ثقافة وفن',
    slug: 'culture',
    description: 'أخبار الثقافة والفنون',
    icon: '🎨',
    color: '#f59e0b',
    order: 7,
  },
  {
    id: '8',
    name: 'علوم',
    slug: 'science',
    description: 'أخبار العلوم والاكتشافات',
    icon: '🔬',
    color: '#8b5cf6',
    order: 8,
  },
];

// مصادر RSS
export const RSS_SOURCES: RSSSource[] = [
  {
    name: 'BBC Arabic',
    url: 'https://feeds.bbci.co.uk/arabic/rss.xml',
    language: 'ar',
    enabled: true,
    priority: 1,
  },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.net/xml/rss/all.xml',
    language: 'ar',
    enabled: true,
    priority: 1,
  },
  {
    name: 'Sky News Arabic',
    url: 'https://www.skynewsarabia.com/rss',
    language: 'ar',
    enabled: true,
    priority: 2,
  },
  {
    name: 'France 24 Arabic',
    url: 'https://www.france24.com/ar/rss',
    language: 'ar',
    enabled: true,
    priority: 2,
  },
  {
    name: 'Sky News (English)',
    url: 'https://feeds.skynews.com/feeds/rss/world.xml',
    language: 'en',
    enabled: true,
    priority: 3,
  },
];

// إعدادات الأتمتة
export const AUTOMATION_CONFIG = {
  articlesPerHour: 8,
  processingTimeout: 120000, // 2 دقيقة
  maxRetries: 3,
  retryDelay: 5000, // 5 ثواني
  imageMaxWidth: 800,
  imageMaxHeight: 500,
  thumbnailWidth: 200,
  thumbnailHeight: 120,
  imageQuality: 85,
  imageFormat: 'webp' as const,
};

// إعدادات Groq
export const GROQ_CONFIG = {
  model: 'mixtral-8x7b-32768',
  temperature: 0.7,
  maxTokens: 1024,
  systemPrompt: `أنت محرر أخبار احترافي عربي متخصص بخبرة 20 سنة.

المهام:
1. أعد صياغة الخبر بأسلوب جذاب واحترافي
2. احتفظ بالمعنى الأصلي 100%
3. أضف تحليل بسيط (جملة واحدة)
4. تجنب الكلمات المكررة
5. استخدم اللغة العربية الفصحى
6. الطول المطلوب: 250-350 كلمة
7. أضف قيمة مضافة للقارئ

الخرج المطلوب بصيغة JSON فقط:
{
  "title": "عنوان جذاب (50-60 حرف)",
  "content": "المحتوى المعاد صياغته",
  "summary": "ملخص قصير (50 كلمة)",
  "keywords": ["كلمة1", "كلمة2", "كلمة3"],
  "category": "category_slug",
  "reading_time": "X min"
}`,
};

// إعدادات SEO
export const SEO_CONFIG = {
  titleSuffix: ' | منصة طارق الإخبارية',
  defaultDescription: 'منصة إخبارية عربية شاملة تقدم أحدث الأخبار والتحليلات من مختلف أنحاء العالم',
  defaultKeywords: ['أخبار', 'أخبار عربية', 'أخبار عالمية', 'طارق', 'منصة إخبارية'],
  ogImageDefault: 'https://f.top4top.io/p_3704g9rel2.png',
};

// إعدادات الصفحات
export const PAGINATION = {
  articlesPerPage: 12,
  relatedArticles: 4,
  trendingArticles: 5,
  featuredArticles: 3,
};

// الروابط الاجتماعية
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/www.tareq.live',
  instagram: 'https://instagram.com/tareq.live',
  twitter: 'https://twitter.com/tareqlive',
};

// إعدادات الإعلانات
export const ADS_CONFIG = {
  enabled: true,
  adsenseId: 'pub-7070515810008388',
  autoAdsEnabled: true,
  adSlots: {
    header: 'ca-pub-7070515810008388-header',
    sidebar: 'ca-pub-7070515810008388-sidebar',
    inArticle: 'ca-pub-7070515810008388-article',
    footer: 'ca-pub-7070515810008388-footer',
  },
};

// رسائل النظام
export const MESSAGES = {
  errors: {
    articleNotFound: 'لم يتم العثور على المقال',
    categoryNotFound: 'لم يتم العثور على الفئة',
    loadingError: 'حدث خطأ أثناء التحميل',
    networkError: 'خطأ في الاتصال بالإنترنت',
  },
  success: {
    articleLoaded: 'تم تحميل المقال بنجاح',
    copied: 'تم النسخ بنجاح',
  },
  loading: {
    articles: 'جاري تحميل المقالات...',
    article: 'جاري تحميل المقال...',
  },
};

// صيغ التاريخ
export const DATE_FORMATS = {
  full: 'dd MMMM yyyy - HH:mm',
  date: 'dd MMMM yyyy',
  time: 'HH:mm',
  relative: 'relative', // منذ ساعة، منذ يوم، إلخ
};

// الحد الأقصى لطول النصوص
export const TEXT_LIMITS = {
  titleMin: 20,
  titleMax: 120,
  summaryMin: 50,
  summaryMax: 200,
  contentMin: 250,
  contentMax: 5000,
  metaTitleMax: 60,
  metaDescriptionMax: 160,
};
