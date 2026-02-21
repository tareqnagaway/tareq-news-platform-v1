# 📰 منصة طارق الإخبارية

<div align="center">

![Tareq News Logo](https://f.top4top.io/p_3704g9rel2.png)

**منصة إخبارية عربية احترافية مع أتمتة كاملة**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

[الموقع](https://ar.tareq.live) • [الوثائق](./docs) • [التقارير](#)

</div>

---

## 🎯 نظرة عامة

**منصة طارق الإخبارية** هي منصة إخبارية عربية حديثة مبنية بأحدث التقنيات، تتميز بنظام أتمتة كامل ينشر **8 أخبار كل ساعة** تلقائياً من مصادر موثوقة.

### ✨ الميزات الرئيسية

- 🤖 **أتمتة كاملة** - نشر أخبار تلقائي كل ساعة
- ⚡ **أداء فائق** - تحميل أقل من 2 ثانية
- 🎨 **تصميم احترافي** - واجهة عربية RTL متجاوبة بالكامل
- 🔍 **محسّن لمحركات البحث** - SEO متقدم + Google News
- 💰 **جاهز للربح** - متكامل مع Google AdSense
- 🌍 **عالمي** - CDN عبر Cloudflare
- 📊 **تحليلات** - Google Analytics 4 متكامل
- 🎯 **ذكاء اصطناعي** - معالجة محتوى بواسطة Groq AI

---

## 🏗️ البنية التقنية

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 14)                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Pages    │  │ Components │  │  Tailwind  │       │
│  │  Routing   │  │   React    │  │    CSS     │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│           Cloudflare Pages (Hosting + CDN)              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│            Firebase (Database + Storage)                 │
│  ┌────────────┐              ┌────────────┐            │
│  │ Firestore  │              │  Storage   │            │
│  │  Articles  │              │   Images   │            │
│  └────────────┘              └────────────┘            │
└─────────────────────────────────────────────────────────┘
                           ↑
┌─────────────────────────────────────────────────────────┐
│        Automation Worker (Cloudflare Workers)           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │ RSS Fetch  │→ │  Groq AI   │→ │  Firebase  │       │
│  │  (Hourly)  │  │ Processing │  │   Save     │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 🛠️ التقنيات المستخدمة

#### Frontend
- **Next.js 14** - React Framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library

#### Backend & Services
- **Firebase Firestore** - NoSQL Database
- **Firebase Storage** - Image storage
- **Cloudflare Workers** - Serverless automation
- **Groq AI API** - AI content processing

#### Analytics & Ads
- **Google Analytics 4** - Web analytics
- **Google AdSense** - Monetization

#### Deployment
- **Cloudflare Pages** - Frontend hosting
- **Cloudflare CDN** - Global content delivery

---

## 🚀 البدء السريع

### المتطلبات الأساسية

- Node.js 18+ 
- npm أو yarn أو pnpm
- حساب Firebase
- حساب Cloudflare
- حساب Groq API

### 1️⃣ التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/tareq-news-platform.git
cd tareq-news-platform

# تثبيت dependencies للموقع
cd website
npm install

# تثبيت dependencies للـ worker
cd ../automation-worker
npm install
```

### 2️⃣ الإعداد

#### إعداد Firebase

1. أنشئ مشروع جديد في [Firebase Console](https://console.firebase.google.com/)
2. فعّل Firestore Database
3. فعّل Firebase Storage
4. انسخ credentials

#### إعداد المتغيرات البيئية

```bash
# في مجلد website/
cp .env.local.example .env.local
```

املأ ملف `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Site
NEXT_PUBLIC_SITE_URL=https://ar.tareq.live

# Analytics
NEXT_PUBLIC_GA_ID=G-93VZRV27VT
NEXT_PUBLIC_ADSENSE_ID=pub-7070515810008388
```

#### إعداد Cloudflare Worker

```bash
cd automation-worker

# تسجيل الدخول إلى Cloudflare
npx wrangler login

# إضافة Secrets
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put FIREBASE_PROJECT_ID
npx wrangler secret put FIREBASE_CLIENT_EMAIL
npx wrangler secret put FIREBASE_PRIVATE_KEY
```

### 3️⃣ التشغيل

#### تشغيل الموقع (Development)

```bash
cd website
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

#### تشغيل Worker (Development)

```bash
cd automation-worker
npm run dev
```

### 4️⃣ النشر

#### نشر الموقع

```bash
cd website

# بناء المشروع
npm run build

# النشر إلى Cloudflare Pages
# يمكن الربط مع GitHub للنشر التلقائي
```

#### نشر Worker

```bash
cd automation-worker

# النشر إلى Cloudflare Workers
npm run deploy
```

---

## 📊 الأداء

### معدلات النشر

- ⏱️ **8 أخبار/ساعة** = 192 خبر/يوم
- 📈 **5,760 خبر/شهر**
- 🎯 **69,120 خبر/سنة**

### سرعة المعالجة

| المرحلة | الوقت |
|---------|--------|
| جلب RSS | ~100ms |
| معالجة Groq AI | 1-2s |
| تحسين الصورة | ~500ms |
| حفظ Firebase | ~300ms |
| **الإجمالي** | **~3-4s** |

### التكاليف الشهرية

| الخدمة | التكلفة |
|--------|---------|
| Cloudflare Pages | مجاناً |
| Cloudflare Workers | مجاناً (ضمن الحد المجاني) |
| Firebase | ~$2-5 |
| Groq API | ~$0.36 |
| **الإجمالي** | **~$3-6/شهر** |

---

## 📁 هيكل المشروع

```
tareq-news-platform/
├── website/                    # موقع Next.js
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/              # Utilities & config
│   │   └── styles/           # CSS files
│   ├── public/               # Static assets
│   └── package.json
│
├── automation-worker/         # Cloudflare Worker
│   ├── src/
│   │   ├── index.ts          # Main worker
│   │   ├── services/         # Services (RSS, Groq, etc)
│   │   └── types/            # TypeScript types
│   ├── wrangler.toml         # Cloudflare config
│   └── package.json
│
├── firebase/                  # Firebase config
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── storage.rules
│
├── docs/                      # Documentation
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── AUTOMATION.md
│
└── README.md                  # هذا الملف
```

---

## 🤖 كيف تعمل الأتمتة؟

### النظام التلقائي (كل ساعة)

1. **جلب الأخبار** 📰
   - جلب من BBC، الجزيرة، Sky News، France 24
   - ترتيب حسب الأولوية والتاريخ
   - إزالة التكرار

2. **معالجة AI** 🧠
   - إرسال إلى Groq API (Mixtral-8x7b)
   - إعادة صياغة احترافية
   - استخراج الكلمات المفتاحية
   - تصنيف تلقائي

3. **تحسين الصور** 🖼️
   - تحميل الصورة
   - تحسين الحجم (800x500px)
   - تحويل إلى WebP
   - إنشاء thumbnail

4. **الحفظ** 💾
   - حفظ في Firebase Firestore
   - رفع الصور إلى Firebase Storage
   - إنشاء slug و metadata

5. **التوزيع** 📤
   - تحديث الموقع تلقائياً
   - تحديث XML Sitemap
   - تحديث Google News

---

## 🔧 التخصيص

### تعديل الفئات

عدّل `website/src/lib/constants.ts`:

```typescript
export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'فئة جديدة',
    slug: 'new-category',
    icon: '🆕',
    color: '#hexcolor',
  },
  // ...
];
```

### تعديل مصادر RSS

عدّل `automation-worker/src/index.ts`:

```typescript
const RSS_SOURCES = [
  { name: 'مصدر جديد', url: 'https://...', priority: 1 },
  // ...
];
```

### تعديل التصميم

- الألوان: `website/tailwind.config.ts`
- الخطوط: `website/src/app/layout.tsx`
- الأنماط: `website/src/app/globals.css`

---

## 📝 الوثائق الكاملة

- [📖 دليل التثبيت](./docs/SETUP.md)
- [🚀 دليل النشر](./docs/DEPLOYMENT.md)
- [⚙️ شرح الأتمتة](./docs/AUTOMATION.md)
- [🔌 API Documentation](./docs/API.md)

---

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص بموجب MIT License - انظر [LICENSE](LICENSE) للتفاصيل.

---

## 👨‍💻 المطور

تم تطويره بواسطة **منصة طارق الإخبارية**

- 🌐 الموقع: [ar.tareq.live](https://ar.tareq.live)
- 📧 البريد: info@tareq.live
- 📱 Instagram: [@tareq.live](https://instagram.com/tareq.live)
- 👥 Facebook: [www.tareq.live](https://facebook.com/www.tareq.live)

---

## 🙏 شكر وتقدير

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Firebase](https://firebase.google.com/) - Backend Platform
- [Cloudflare](https://www.cloudflare.com/) - CDN & Workers
- [Groq](https://groq.com/) - AI Processing

---

<div align="center">

**صُنع بـ ❤️ في الأردن 🇯🇴**

⭐ إذا أعجبك المشروع، لا تنسى إعطائه نجمة على GitHub!

</div>
