import type { Metadata } from 'next';
import { Cairo, Tajawal } from 'next/font/google';
import './globals.css';
import { SITE_METADATA, SEO_CONFIG } from '@/lib/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';

// تحميل الخطوط
const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

// Metadata للصفحة الرئيسية
export const metadata: Metadata = {
  title: {
    default: SITE_METADATA.title,
    template: `%s ${SEO_CONFIG.titleSuffix}`,
  },
  description: SITE_METADATA.description,
  keywords: SEO_CONFIG.defaultKeywords,
  authors: [{ name: SITE_METADATA.title }],
  creator: SITE_METADATA.title,
  publisher: SITE_METADATA.title,
  
  metadataBase: new URL(SITE_METADATA.url),
  
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    url: SITE_METADATA.url,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    siteName: SITE_METADATA.title,
    images: [
      {
        url: SITE_METADATA.logo,
        width: 1200,
        height: 630,
        alt: SITE_METADATA.title,
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.logo],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  alternates: {
    canonical: SITE_METADATA.url,
    types: {
      'application/rss+xml': `${SITE_METADATA.url}/rss.xml`,
    },
  },
  
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  
  icons: {
    icon: SITE_METADATA.favicon,
    shortcut: SITE_METADATA.favicon,
    apple: SITE_METADATA.favicon,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${SITE_METADATA.analytics.googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${SITE_METADATA.analytics.googleAnalyticsId}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_METADATA.analytics.googleAdsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Preconnect للأداء */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      
      <body className={`${cairo.className} antialiased bg-gray-50`}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header />
          
          {/* Main Content */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>

        {/* Back to Top Button */}
        <button
          id="back-to-top"
          className="fixed bottom-8 left-8 bg-primary-600 text-white p-3 rounded-full shadow-lg opacity-0 invisible transition-all duration-300 hover:bg-primary-700 z-50"
          aria-label="العودة إلى الأعلى"
        >
          <svg
            className="w-6 h-6 rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {/* Back to Top Script */}
        <Script id="back-to-top-script" strategy="lazyOnload">
          {`
            const backToTop = document.getElementById('back-to-top');
            
            window.addEventListener('scroll', () => {
              if (window.pageYOffset > 300) {
                backToTop.classList.remove('opacity-0', 'invisible');
                backToTop.classList.add('opacity-100', 'visible');
              } else {
                backToTop.classList.add('opacity-0', 'invisible');
                backToTop.classList.remove('opacity-100', 'visible');
              }
            });
            
            backToTop.addEventListener('click', () => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          `}
        </Script>
      </body>
    </html>
  );
}
