import { Suspense } from 'react';
import { 
  getPublishedArticles, 
  getFeaturedArticles, 
  getTrendingArticles 
} from '@/lib/firebase';
import ArticleGrid from '@/components/article/ArticleGrid';
import FeaturedArticle from '@/components/article/FeaturedArticle';
import TrendingSection from '@/components/article/TrendingSection';
import CategoryNav from '@/components/layout/CategoryNav';
import AdSlot from '@/components/ads/AdSlot';
import { PAGINATION } from '@/lib/constants';

export const revalidate = 300; // إعادة التحقق كل 5 دقائق

export default async function HomePage() {
  // جلب البيانات بالتوازي
  const [
    { articles: latestArticles },
    featuredArticles,
    trendingArticles,
  ] = await Promise.all([
    getPublishedArticles(PAGINATION.articlesPerPage),
    getFeaturedArticles(PAGINATION.featuredArticles),
    getTrendingArticles(PAGINATION.trendingArticles),
  ]);

  return (
    <div className="min-h-screen">
      {/* شريط الفئات */}
      <CategoryNav />

      {/* Hero Section - المقالات المميزة */}
      {featuredArticles.length > 0 && (
        <section className="bg-gradient-to-b from-primary-50 to-white py-12">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-4xl">⭐</span>
              <span>الأخبار المميزة</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* المقال المميز الرئيسي */}
              <FeaturedArticle article={featuredArticles[0]} priority />
              
              {/* المقالات المميزة الثانوية */}
              <div className="space-y-6">
                {featuredArticles.slice(1, 3).map((article) => (
                  <FeaturedArticle 
                    key={article.id} 
                    article={article} 
                    compact 
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* إعلان أفقي */}
      <div className="container-custom my-8">
        <AdSlot slot="horizontal-top" />
      </div>

      {/* المحتوى الرئيسي */}
      <section className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الرئيسي - آخر الأخبار */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">📰</span>
                <span>آخر الأخبار</span>
              </h2>
            </div>

            <Suspense fallback={<ArticleGridSkeleton />}>
              <ArticleGrid articles={latestArticles} />
            </Suspense>

            {/* إعلان داخل المحتوى */}
            <div className="my-8">
              <AdSlot slot="in-feed" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* الأخبار الرائجة */}
            {trendingArticles.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span>الأكثر قراءة</span>
                </h3>
                <TrendingSection articles={trendingArticles} />
              </div>
            )}

            {/* إعلان جانبي */}
            <div className="sticky top-24">
              <AdSlot slot="sidebar" />
            </div>

            {/* تابعنا */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <span>تابعنا</span>
              </h3>
              <div className="space-y-3">
                <a 
                  href="https://facebook.com/www.tareq.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-medium text-gray-700">Facebook</span>
                </a>

                <a 
                  href="https://instagram.com/tareq.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="font-medium text-gray-700">Instagram</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* إعلان سفلي */}
      <div className="container-custom my-8">
        <AdSlot slot="horizontal-bottom" />
      </div>
    </div>
  );
}

// Loading Skeleton للـ ArticleGrid
function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton h-48 w-full" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-6 w-full" />
            <div className="skeleton h-4 w-3/4" />
            <div className="flex items-center gap-4">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
