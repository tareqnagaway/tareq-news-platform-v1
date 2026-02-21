// types.ts - أنواع TypeScript للمشروع

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string;
  category: Category;
  categorySlug: string;
  
  // الصور
  imageUrl: string;
  imageThumbnail?: string;
  imageAlt?: string;
  
  // الميتاداتا
  keywords: string[];
  readingTime: number; // بالدقائق
  views: number;
  likes: number;
  
  // المصدر
  source: string;
  sourceUrl?: string;
  originalUrl?: string;
  
  // التواريخ
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  
  // الحالة
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  trending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  articleCount?: number;
}

export interface RSSFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  categories?: string[];
  creator?: string;
  enclosure?: {
    url: string;
    type?: string;
    length?: string;
  };
}

export interface RSSSource {
  name: string;
  url: string;
  language: 'ar' | 'en';
  enabled: boolean;
  priority: number;
}

export interface GroqResponse {
  title: string;
  content: string;
  summary: string;
  keywords: string[];
  category: string;
  reading_time: string;
}

export interface ProcessedArticle {
  title: string;
  content: string;
  summary: string;
  keywords: string[];
  category: string;
  categorySlug: string;
  readingTime: number;
  imageUrl: string;
  imageThumbnail: string;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  slug: string;
  publishedAt: Date;
  status: 'published';
  views: 0;
  likes: 0;
  featured: boolean;
  trending: boolean;
}

export interface SocialMediaPost {
  platform: 'facebook' | 'twitter' | 'instagram';
  content: string;
  imageUrl?: string;
  hashtags: string[];
  link?: string;
  scheduledAt?: Date;
  postedAt?: Date;
  status: 'pending' | 'posted' | 'failed';
}

export interface AutomationLog {
  id: string;
  timestamp: Date;
  action: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  duration?: number;
}

export interface SiteMetadata {
  title: string;
  description: string;
  url: string;
  logo: string;
  favicon: string;
  email: string;
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  analytics: {
    googleAnalyticsId: string;
    googleAdsenseId: string;
  };
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface CloudflareEnv {
  GROQ_API_KEY: string;
  GROQ_MODEL: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_STORAGE_BUCKET: string;
}

// أنواع مساعدة
export type ArticleStatus = 'draft' | 'published' | 'archived';
export type SocialPlatform = 'facebook' | 'twitter' | 'instagram';
export type LogStatus = 'success' | 'error' | 'warning';

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
