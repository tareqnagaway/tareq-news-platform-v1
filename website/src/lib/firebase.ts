// firebase.ts - إعدادات Firebase

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// إعدادات Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// تهيئة Firebase
let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);

  // تهيئة Analytics فقط في المتصفح
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, db, storage, analytics };

// ========================================
// دوال Firestore للمقالات
// ========================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Query,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';

import { Article } from './types';

const ARTICLES_COLLECTION = 'articles';
const CATEGORIES_COLLECTION = 'categories';
const LOGS_COLLECTION = 'automation_logs';

/**
 * جلب جميع المقالات المنشورة
 */
export async function getPublishedArticles(
  limitCount: number = 12,
  categorySlug?: string,
  lastDoc?: any
): Promise<{ articles: Article[]; lastVisible: any }> {
  try {
    let q: Query<DocumentData> = query(
      collection(db, ARTICLES_COLLECTION),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    if (categorySlug) {
      q = query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        where('categorySlug', '==', categorySlug),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Article[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { articles, lastVisible };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], lastVisible: null };
  }
}

/**
 * جلب مقال واحد بالـ slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

/**
 * جلب المقالات الرائجة
 */
export async function getTrendingArticles(limitCount: number = 5): Promise<Article[]> {
  try {
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where('status', '==', 'published'),
      where('trending', '==', true),
      orderBy('views', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Article[];
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    return [];
  }
}

/**
 * جلب المقالات المميزة
 */
export async function getFeaturedArticles(limitCount: number = 3): Promise<Article[]> {
  try {
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where('status', '==', 'published'),
      where('featured', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Article[];
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
}

/**
 * جلب مقالات ذات صلة
 */
export async function getRelatedArticles(
  categorySlug: string,
  currentArticleId: string,
  limitCount: number = 4
): Promise<Article[]> {
  try {
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where('status', '==', 'published'),
      where('categorySlug', '==', categorySlug),
      orderBy('publishedAt', 'desc'),
      limit(limitCount + 1)
    );

    const snapshot = await getDocs(q);
    const articles = snapshot.docs
      .filter(doc => doc.id !== currentArticleId)
      .slice(0, limitCount)
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Article[];

    return articles;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

/**
 * زيادة عدد المشاهدات
 */
export async function incrementArticleViews(articleId: string): Promise<void> {
  try {
    const articleRef = doc(db, ARTICLES_COLLECTION, articleId);
    const articleDoc = await getDoc(articleRef);
    
    if (articleDoc.exists()) {
      const currentViews = articleDoc.data().views || 0;
      await updateDoc(articleRef, {
        views: currentViews + 1,
      });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

/**
 * البحث في المقالات
 */
export async function searchArticles(searchTerm: string, limitCount: number = 20): Promise<Article[]> {
  try {
    // ملاحظة: Firestore لا يدعم البحث النصي الكامل
    // يجب استخدام خدمة مثل Algolia أو Elasticsearch للبحث الأفضل
    // هذا حل مبدئي بسيط
    
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const allArticles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Article[];

    // البحث في العنوان والملخص
    const searchLower = searchTerm.toLowerCase();
    return allArticles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.summary.toLowerCase().includes(searchLower) ||
      article.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

// ========================================
// دوال Firebase Storage للصور
// ========================================

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

/**
 * رفع صورة
 */
export async function uploadImage(
  file: Blob,
  path: string
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * حذف صورة
 */
export async function deleteImage(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
