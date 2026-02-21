/**
 * Cloudflare Worker للأتمتة - منصة طارق الإخبارية
 * 
 * هذا الـ Worker يعمل تلقائياً كل ساعة ويقوم بـ:
 * 1. جلب الأخبار من مصادر RSS
 * 2. معالجتها باستخدام Groq AI
 * 3. تحسين الصور
 * 4. حفظها في Firebase
 * 5. النشر على وسائل التواصل
 */

import Anthropic from '@anthropic-ai/sdk';

// Types
interface Env {
  GROQ_API_KEY: string;
  GROQ_MODEL: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  FIREBASE_STORAGE_BUCKET: string;
}

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content?: string;
  image?: string;
}

interface GroqProcessedArticle {
  title: string;
  content: string;
  summary: string;
  keywords: string[];
  category: string;
  reading_time: string;
}

// مصادر RSS
const RSS_SOURCES = [
  { name: 'BBC Arabic', url: 'https://feeds.bbci.co.uk/arabic/rss.xml', priority: 1 },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.net/xml/rss/all.xml', priority: 1 },
  { name: 'Sky News Arabic', url: 'https://www.skynewsarabia.com/rss', priority: 2 },
  { name: 'France 24 Arabic', url: 'https://www.france24.com/ar/rss', priority: 2 },
];

/**
 * Worker Entry Point
 */
export default {
  /**
   * Scheduled Event - يتم تشغيله كل ساعة
   */
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log('🚀 Starting automation worker...');
    
    try {
      // جلب الأخبار
      const articles = await fetchRSSArticles();
      console.log(`📰 Fetched ${articles.length} articles from RSS feeds`);
      
      // معالجة أول 8 أخبار
      const processedArticles = [];
      for (const article of articles.slice(0, 8)) {
        try {
          // معالجة بـ Groq AI
          const processed = await processWithGroq(article, env);
          
          // تحسين الصورة
          const imageData = await optimizeImage(article.image || '');
          
          // حفظ في Firebase
          const savedArticle = await saveToFirebase({
            ...processed,
            imageUrl: imageData.url,
            imageThumbnail: imageData.thumbnail,
            source: article.link,
            originalUrl: article.link,
          }, env);
          
          processedArticles.push(savedArticle);
          
          console.log(`✅ Processed: ${processed.title}`);
        } catch (error) {
          console.error(`❌ Error processing article:`, error);
        }
      }
      
      console.log(`✨ Successfully processed ${processedArticles.length} articles`);
      
      // النشر على وسائل التواصل (اختياري)
      // await postToSocialMedia(processedArticles, env);
      
    } catch (error) {
      console.error('❌ Worker error:', error);
      throw error;
    }
  },

  /**
   * HTTP Handler - للتجربة والاختبار
   */
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    
    // صفحة الحالة
    if (url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'active',
          worker: 'Tareq News Automation',
          version: '1.0.0',
          message: 'Worker is running. Articles are processed every hour.',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // تشغيل يدوي
    if (url.pathname === '/run' && request.method === 'POST') {
      // التحقق من Authentication (اختياري)
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || authHeader !== `Bearer ${env.GROQ_API_KEY}`) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      // تشغيل العملية
      ctx.waitUntil(
        (async () => {
          const event = { scheduledTime: Date.now(), cron: '0 * * * *' } as ScheduledEvent;
          await this.scheduled(event, env, ctx);
        })()
      );
      
      return new Response('Worker started', { status: 200 });
    }
    
    return new Response('Not Found', { status: 404 });
  },
};

/**
 * جلب الأخبار من RSS Feeds
 */
async function fetchRSSArticles(): Promise<RSSItem[]> {
  const allArticles: RSSItem[] = [];
  
  for (const source of RSS_SOURCES) {
    try {
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'TareqNewsBot/1.0',
        },
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch ${source.name}: ${response.status}`);
        continue;
      }
      
      const xml = await response.text();
      const articles = parseRSS(xml);
      
      // إضافة الأولوية والمصدر
      articles.forEach(article => {
        (article as any).priority = source.priority;
        (article as any).sourceName = source.name;
      });
      
      allArticles.push(...articles);
    } catch (error) {
      console.error(`Error fetching ${source.name}:`, error);
    }
  }
  
  // ترتيب حسب الأولوية والتاريخ
  allArticles.sort((a, b) => {
    const priorityDiff = ((a as any).priority || 0) - ((b as any).priority || 0);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
  
  // إزالة التكرار
  const uniqueArticles = allArticles.filter((article, index, self) =>
    index === self.findIndex(a => a.title === article.title)
  );
  
  return uniqueArticles;
}

/**
 * تحليل RSS XML
 */
function parseRSS(xml: string): RSSItem[] {
  const articles: RSSItem[] = [];
  
  // استخدام regex بسيط لاستخراج العناصر
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const items = xml.match(itemRegex) || [];
  
  for (const item of items) {
    try {
      const title = extractTag(item, 'title');
      const description = extractTag(item, 'description');
      const link = extractTag(item, 'link');
      const pubDate = extractTag(item, 'pubDate');
      const content = extractTag(item, 'content:encoded') || description;
      
      // استخراج الصورة
      const imageMatch = item.match(/<media:content[^>]+url="([^"]+)"/i) ||
                        item.match(/<enclosure[^>]+url="([^"]+)"[^>]+type="image/i) ||
                        content.match(/<img[^>]+src="([^"]+)"/i);
      const image = imageMatch ? imageMatch[1] : undefined;
      
      if (title && link) {
        articles.push({
          title: cleanHtml(title),
          description: cleanHtml(description),
          link,
          pubDate: pubDate || new Date().toISOString(),
          content: cleanHtml(content),
          image,
        });
      }
    } catch (error) {
      console.error('Error parsing RSS item:', error);
    }
  }
  
  return articles;
}

/**
 * استخراج محتوى tag من XML
 */
function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * تنظيف HTML من النص
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * معالجة المقال باستخدام Groq AI
 */
async function processWithGroq(
  article: RSSItem,
  env: Env
): Promise<GroqProcessedArticle> {
  const client = new Anthropic({
    apiKey: env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  
  const systemPrompt = `أنت محرر أخبار احترافي عربي متخصص بخبرة 20 سنة.

المهام:
1. أعد صياغة الخبر بأسلوب جذاب واحترافي
2. احتفظ بالمعنى الأصلي 100%
3. أضف تحليل بسيط (جملة واحدة)
4. تجنب الكلمات المكررة
5. استخدم اللغة العربية الفصحى
6. الطول المطلوب: 250-350 كلمة
7. أضف قيمة مضافة للقارئ

الخرج المطلوب بصيغة JSON فقط (بدون markdown):
{
  "title": "عنوان جذاب (50-60 حرف)",
  "content": "المحتوى المعاد صياغته",
  "summary": "ملخص قصير (50 كلمة)",
  "keywords": ["كلمة1", "كلمة2", "كلمة3"],
  "category": "category_slug",
  "reading_time": "X min"
}`;

  const userPrompt = `أعد صياغة هذا الخبر:

العنوان: ${article.title}
المحتوى: ${article.content || article.description}
المصدر: ${article.link}`;

  try {
    const message = await client.messages.create({
      model: env.GROQ_MODEL || 'mixtral-8x7b-32768',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });
    
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    // إزالة markdown backticks إذا وجدت
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const result = JSON.parse(cleanedResponse);
    
    return {
      title: result.title,
      content: result.content,
      summary: result.summary,
      keywords: result.keywords || [],
      category: result.category || 'world-news',
      reading_time: result.reading_time || '3 min',
    };
  } catch (error) {
    console.error('Groq API Error:', error);
    
    // Fallback: استخدام المحتوى الأصلي
    return {
      title: article.title,
      content: article.content || article.description,
      summary: article.description.substring(0, 150),
      keywords: [],
      category: 'world-news',
      reading_time: '3 min',
    };
  }
}

/**
 * تحسين الصورة
 */
async function optimizeImage(imageUrl: string): Promise<{
  url: string;
  thumbnail: string;
}> {
  // ملاحظة: في الإنتاج، يجب استخدام خدمة تحسين الصور
  // هنا نستخدم الصورة الأصلية مباشرة
  
  if (!imageUrl) {
    return {
      url: 'https://f.top4top.io/p_3704g9rel2.png',
      thumbnail: 'https://e.top4top.io/p_3704c4i0l1.png',
    };
  }
  
  return {
    url: imageUrl,
    thumbnail: imageUrl,
  };
}

/**
 * حفظ في Firebase
 */
async function saveToFirebase(article: any, env: Env): Promise<any> {
  // ملاحظة: يجب تكوين Firebase Admin SDK
  // هذا مثال مبسط
  
  const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/articles`;
  
  const slug = slugify(article.title);
  const now = new Date().toISOString();
  
  const document = {
    fields: {
      slug: { stringValue: slug },
      title: { stringValue: article.title },
      content: { stringValue: article.content },
      summary: { stringValue: article.summary },
      category: { stringValue: article.category },
      categorySlug: { stringValue: article.category },
      keywords: { arrayValue: { values: article.keywords.map((k: string) => ({ stringValue: k })) } },
      imageUrl: { stringValue: article.imageUrl },
      imageThumbnail: { stringValue: article.imageThumbnail },
      source: { stringValue: article.source },
      originalUrl: { stringValue: article.originalUrl },
      readingTime: { integerValue: parseInt(article.reading_time) || 3 },
      status: { stringValue: 'published' },
      views: { integerValue: 0 },
      likes: { integerValue: 0 },
      featured: { booleanValue: false },
      trending: { booleanValue: false },
      publishedAt: { timestampValue: now },
      createdAt: { timestampValue: now },
      updatedAt: { timestampValue: now },
    },
  };
  
  // حفظ في Firestore
  const response = await fetch(firebaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getFirebaseToken(env)}`,
    },
    body: JSON.stringify(document),
  });
  
  if (!response.ok) {
    throw new Error(`Firebase error: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * الحصول على Firebase Token
 */
async function getFirebaseToken(env: Env): Promise<string> {
  // ملاحظة: يجب تطبيق OAuth 2.0 للحصول على token
  // هذا مثال مبسط
  return 'YOUR_FIREBASE_TOKEN';
}

/**
 * تحويل النص إلى slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}
