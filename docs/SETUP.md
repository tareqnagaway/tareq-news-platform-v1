# 📖 دليل الإعداد والتثبيت

## 🎯 نظرة عامة

هذا الدليل يشرح خطوة بخطوة كيفية إعداد وتشغيل **منصة طارق الإخبارية** من الصفر.

---

## 📋 المتطلبات الأساسية

### 1. البرامج المطلوبة

- ✅ Node.js 18+ ([تحميل](https://nodejs.org/))
- ✅ npm أو yarn أو pnpm
- ✅ Git ([تحميل](https://git-scm.com/))
- ✅ محرر نصوص (VSCode مُفضّل)

### 2. الحسابات المطلوبة

- ✅ [Firebase](https://console.firebase.google.com/)
- ✅ [Cloudflare](https://dash.cloudflare.com/)
- ✅ [Groq API](https://console.groq.com/)
- ✅ [Google Analytics](https://analytics.google.com/)
- ✅ [Google AdSense](https://www.google.com/adsense/)

---

## 🚀 الخطوة 1: إعداد Firebase

### 1.1 إنشاء مشروع

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اضغط "Add project" (إضافة مشروع)
3. أدخل اسم المشروع: `tareq-news`
4. فعّل Google Analytics (اختياري)
5. اضغط "Create project"

### 1.2 تفعيل Firestore

1. من القائمة الجانبية، اختر "Firestore Database"
2. اضغط "Create database"
3. اختر "Start in production mode"
4. اختر الموقع الأقرب (مثل: `eur3` لأوروبا)
5. اضغط "Enable"

### 1.3 تفعيل Storage

1. من القائمة الجانبية، اختر "Storage"
2. اضغط "Get Started"
3. اضغط "Next" ثم "Done"

### 1.4 الحصول على Credentials

1. اذهب إلى Project Settings (⚙️)
2. اضغط "Add app" → "Web" (</>) 
3. أدخل اسم التطبيق: `Tareq News Website`
4. انسخ Firebase Configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tareq-news.firebaseapp.com",
  projectId: "tareq-news",
  storageBucket: "tareq-news.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

### 1.5 إنشاء Service Account (للـ Worker)

1. Project Settings → Service Accounts
2. اضغط "Generate new private key"
3. احفظ ملف JSON (سنحتاجه لاحقاً)

---

## ⚙️ الخطوة 2: إعداد Groq API

### 2.1 إنشاء حساب

1. اذهب إلى [Groq Console](https://console.groq.com/)
2. سجّل حساب جديد
3. فعّل الحساب عبر البريد الإلكتروني

### 2.2 الحصول على API Key

1. اذهب إلى "API Keys"
2. اضغط "Create API Key"
3. انسخ المفتاح واحفظه (لن تراه مرة أخرى!)

```
gsk_abcdefghijklmnopqrstuvwxyz1234567890
```

---

## 🌐 الخطوة 3: إعداد Cloudflare

### 3.1 إنشاء حساب

1. اذهب إلى [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. سجّل حساب جديد

### 3.2 إعداد Cloudflare Pages

1. من Dashboard، اختر "Pages"
2. سنربط GitHub لاحقاً للنشر التلقائي

### 3.3 إعداد Cloudflare Workers

1. من Dashboard، اختر "Workers & Pages"
2. سنستخدم Wrangler CLI للنشر

---

## 💻 الخطوة 4: تثبيت المشروع

### 4.1 استنساخ المشروع

```bash
# استنساخ من GitHub
git clone https://github.com/yourusername/tareq-news-platform.git
cd tareq-news-platform
```

### 4.2 تثبيت Dependencies

```bash
# تثبيت dependencies للموقع
cd website
npm install

# تثبيت dependencies للـ Worker
cd ../automation-worker
npm install
```

---

## 🔧 الخطوة 5: إعداد المتغيرات البيئية

### 5.1 الموقع (Website)

```bash
cd website
cp .env.local.example .env.local
```

افتح `.env.local` وأضف القيم:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tareq-news.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tareq-news
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tareq-news.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics & Ads
NEXT_PUBLIC_GA_ID=G-93VZRV27VT
NEXT_PUBLIC_ADSENSE_ID=pub-7070515810008388
```

### 5.2 Cloudflare Worker

```bash
cd ../automation-worker

# تسجيل الدخول إلى Cloudflare
npx wrangler login

# إضافة Secrets
npx wrangler secret put GROQ_API_KEY
# الصق: gsk_your_api_key_here

npx wrangler secret put FIREBASE_PROJECT_ID
# الصق: tareq-news

npx wrangler secret put FIREBASE_CLIENT_EMAIL
# الصق: firebase-adminsdk-xxxxx@tareq-news.iam.gserviceaccount.com

npx wrangler secret put FIREBASE_PRIVATE_KEY
# الصق: -----BEGIN PRIVATE KEY-----\n...

npx wrangler secret put FIREBASE_STORAGE_BUCKET
# الصق: tareq-news.appspot.com
```

---

## 🎬 الخطوة 6: التشغيل

### 6.1 تشغيل الموقع

```bash
cd website
npm run dev
```

افتح المتصفح: http://localhost:3000

### 6.2 تشغيل Worker

```bash
cd automation-worker
npm run dev
```

Worker يعمل على: http://localhost:8787

---

## ✅ الخطوة 7: التحقق

### 7.1 التحقق من الموقع

- ✅ الصفحة الرئيسية تعمل
- ✅ الشعار يظهر
- ✅ الألوان صحيحة

### 7.2 التحقق من Firebase

```bash
# من مجلد firebase/
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 7.3 اختبار Worker يدوياً

```bash
# تشغيل Worker مرة واحدة
curl -X POST http://localhost:8787/run \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY"
```

---

## 🚀 الخطوة 8: النشر للإنتاج

انظر [دليل النشر](./DEPLOYMENT.md) للخطوات التفصيلية.

---

## 🐛 حل المشاكل الشائعة

### المشكلة 1: خطأ في Firebase

```
Error: Firebase configuration is invalid
```

**الحل:**
- تأكد من نسخ جميع قيم Firebase بشكل صحيح
- تحقق من عدم وجود مسافات زائدة

### المشكلة 2: Groq API لا يعمل

```
Error: Groq API authentication failed
```

**الحل:**
- تأكد من صحة API Key
- تحقق من رصيد الـ Free Tier

### المشكلة 3: Worker لا ينشر

```
Error: Scheduled event not firing
```

**الحل:**
- تأكد من نشر Worker بنجاح
- تحقق من Cron Trigger في wrangler.toml

---

## 📚 المزيد من الموارد

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Groq API Docs](https://console.groq.com/docs)

---

## 💡 نصائح مهمة

1. **استخدم .env.local للتطوير** - لا ترفع أبداً على Git
2. **احفظ Firebase Service Account** بشكل آمن
3. **راقب استخدام Groq API** - Free Tier محدود
4. **فعّل Firestore Indexes** - لتحسين الأداء

---

## ✅ Checklist الإعداد

- [ ] إنشاء مشروع Firebase
- [ ] تفعيل Firestore و Storage
- [ ] الحصول على Groq API Key
- [ ] إنشاء حساب Cloudflare
- [ ] استنساخ المشروع
- [ ] تثبيت Dependencies
- [ ] إعداد المتغيرات البيئية
- [ ] اختبار الموقع محلياً
- [ ] اختبار Worker محلياً
- [ ] نشر Firebase Rules
- [ ] نشر للإنتاج

---

**🎉 تهانينا! الآن أصبح لديك منصة إخبارية احترافية!**

للخطوة التالية، انظر [دليل النشر](./DEPLOYMENT.md).
