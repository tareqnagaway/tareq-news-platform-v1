#!/bin/bash

echo "🚀 إنشاء بقية ملفات المشروع..."

# إنشاء المزيد من المجلدات
mkdir -p website/src/components/{layout,article,ui,ads}
mkdir -p website/src/app/{article/[slug],about,contact,privacy,terms}
mkdir -p website/public/{images,icons}

echo "✅ تم إنشاء المجلدات"

# إنشاء ملف .env.local.example
cat > website/.env.local.example << 'EOF'
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://ar.tareq.live
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code

# Analytics & Ads
NEXT_PUBLIC_GA_ID=G-93VZRV27VT
NEXT_PUBLIC_ADSENSE_ID=pub-7070515810008388
EOF

echo "✅ تم إنشاء .env.local.example"

# إنشاء wrangler.toml
cat > automation-worker/wrangler.toml << 'EOF'
name = "tareq-automation-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"

[env.production]
vars = { ENVIRONMENT = "production" }

# Cron Trigger - كل ساعة
[triggers]
crons = ["0 * * * *"]

# Secrets (تضاف عبر CLI)
# wrangler secret put GROQ_API_KEY
# wrangler secret put FIREBASE_PROJECT_ID
# wrangler secret put FIREBASE_CLIENT_EMAIL
# wrangler secret put FIREBASE_PRIVATE_KEY
# wrangler secret put FIREBASE_STORAGE_BUCKET
EOF

echo "✅ تم إنشاء wrangler.toml"

echo "✨ تم إنشاء جميع الملفات الإضافية!"
