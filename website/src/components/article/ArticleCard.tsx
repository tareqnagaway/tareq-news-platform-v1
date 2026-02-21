import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import { formatRelativeDate } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const category = CATEGORIES.find(c => c.slug === article.categorySlug);

  return (
    <article className="card card-hover group">
      <Link href={`/article/${article.slug}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Category Badge */}
          {category && (
            <div
              className="absolute top-3 right-3 badge text-white font-bold"
              style={{ backgroundColor: category.color }}
            >
              {category.icon} {category.name}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {article.title}
          </h3>

          {/* Summary */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {article.summary}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatRelativeDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.views.toLocaleString('ar-EG')}
            </span>
            <span>{article.readingTime} دقائق</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
