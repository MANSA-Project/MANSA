/**
 * @file env.js
 * @description Environment configuration loaded from .env.* files via Vite.
 * إعدادات البيئة — تُحمَّل من ملفات .env.* عبر Vite
 *
 * RULE: Never access import.meta.env directly outside this file.
 * القاعدة: لا تستخدم import.meta.env مباشرة خارج هذا الملف
 *
 * Usage | الاستخدام:
 *   import { ENV } from '@config/env.js';
 *   const { apiKey } = ENV.firebase;
 */

export const ENV = {
  // ─── وضع التشغيل | Runtime Mode ──────────────────────────────────────────
  /** الوضع الحالي: development | production */
  MODE: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,

  // ─── Firebase ────────────────────────────────────────────────────────────
  // احصل على هذه القيم من: Firebase Console → Project Settings → Your Apps
  // Get from: Firebase Console → Project Settings → Your Apps
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },

  // ─── Azure Blob Storage ──────────────────────────────────────────────────
  // Get from: Azure Portal → Storage Account → Shared Access Signature
  azure: {
    storageAccount: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT,
    containerName: import.meta.env.VITE_AZURE_CONTAINER || 'mansa-public',
    sasToken: import.meta.env.VITE_AZURE_SAS_TOKEN,
    cdnUrl: import.meta.env.VITE_AZURE_CDN_URL,
  },

  // ─── مفاتيح الذكاء الاصطناعي | AI API Keys ───────────────────────────────
  // ⚠️  SECURITY WARNING — DO NOT PUT REAL KEYS HERE YET
  // Any VITE_ variable is inlined into the JS bundle at build time.
  // Anyone can read it from DevTools → Sources.
  //
  // V1.0 fix: AI calls will go through a Firebase Cloud Function (server-side proxy).
  // The browser will call the Cloud Function, which holds the real key securely.
  // Until that proxy exists, these must remain empty in production builds.
  //
  // Safe to use in .env.development for local testing only.
  ai: {
    /** Groq — يُستخدم للـ AI chat (llama-3.3-70b) — V1.0+ */
    groqApiKey: import.meta.env.VITE_GROQ_API_KEY,
    /** Google Gemini — يُستخدم لتحليل الصور — V1.0+ */
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
  },

  // ─── روابط التطبيق | App URLs ────────────────────────────────────────────
  appUrl: import.meta.env.VITE_APP_URL,
  apiUrl: import.meta.env.VITE_API_URL,
  cdnUrl: import.meta.env.VITE_CDN_URL,

  // ─── Firebase Emulator | للتطوير المحلي فقط ──────────────────────────────
  // true → يتصل بـ Firebase Emulator بدلاً من Firebase الحقيقي
  // true → connects to local Firebase Emulator instead of real Firebase
  useEmulator: import.meta.env.VITE_USE_EMULATOR === 'true',
  emulator: {
    host: import.meta.env.VITE_EMULATOR_HOST || '127.0.0.1',
    firestorePort: parseInt(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT, 10) || 8080,
    authPort: parseInt(import.meta.env.VITE_AUTH_EMULATOR_PORT, 10) || 9099,
  },

  // ─── مفاتيح تفعيل الميزات | Feature Flags ────────────────────────────────
  // يمكن تعطيل أي ميزة من ملف .env بدون تعديل الكود
  features: {
    aiChat: import.meta.env.VITE_ENABLE_AI_CHAT === 'true',
    leaderboard: import.meta.env.VITE_ENABLE_LEADERBOARD === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
  },

  // ─── إعدادات التطوير | Dev Settings ─────────────────────────────────────
  port: parseInt(import.meta.env.VITE_PORT, 10) || 3000, // منفذ سيرفر التطوير
  debug: import.meta.env.VITE_DEBUG === 'true', // تفعيل التسجيل التفصيلي
  mockApi: import.meta.env.VITE_MOCK_API === 'true', // استخدام بيانات وهمية بدون Firebase
};

// ─────────────────────────────────────────────────────────────────────────────
// التحقق من متغيرات الإنتاج | Production Validation
// نفشل مبكراً إذا كانت متغيرات أساسية مفقودة في الإنتاج
// Fail fast if critical environment variables are missing in production
// ─────────────────────────────────────────────────────────────────────────────
if (ENV.isProd) {
  const REQUIRED = [
    ['VITE_FIREBASE_API_KEY', ENV.firebase.apiKey],
    ['VITE_FIREBASE_AUTH_DOMAIN', ENV.firebase.authDomain],
    ['VITE_FIREBASE_PROJECT_ID', ENV.firebase.projectId],
    ['VITE_FIREBASE_STORAGE_BUCKET', ENV.firebase.storageBucket],
    ['VITE_FIREBASE_MESSAGING_SENDER_ID', ENV.firebase.messagingSenderId],
    ['VITE_FIREBASE_APP_ID', ENV.firebase.appId],
  ];

  const missing = REQUIRED.filter(([, value]) => !value).map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `[MANSA] متغيرات بيئة مفقودة في الإنتاج | Missing required env variables:\n${missing
        .map(k => `  ✗ ${k}`)
        .join('\n')}\n\n` +
        `تأكد من إعداد ملف .env.production بشكل صحيح.\n` +
        `Ensure your .env.production file is correctly configured.`
    );
  }
}
