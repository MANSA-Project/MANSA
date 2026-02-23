/**
 * @file constants.js
 * @description ثوابت التطبيق — قيم لا تتغير بين البيئات المختلفة.
 * Application-wide static constants — values that never change between environments.
 *
 * القاعدة: هذا الملف للقيم الثابتة فقط.
 * للقيم التي تختلف بين البيئات (مفاتيح API، روابط) → استخدم config/env.js
 *
 * Usage | الاستخدام:
 *   import { MAX_FILE_SIZE, STORAGE_KEYS } from '@config/constants.js';
 */

// ─────────────────────────────────────────────────────────────────────────────
// هوية التطبيق | App Identity
// ─────────────────────────────────────────────────────────────────────────────

export const APP_NAME = 'MANSA';
export const APP_VERSION = '0.1.0-alpha';

// ─────────────────────────────────────────────────────────────────────────────
// حدود الرفع والإدخال | Upload & Input Limits
// ─────────────────────────────────────────────────────────────────────────────

// ⚠️ جميع ملفات الرفع تذهب إلى Azure Blob Storage — Firebase Storage غير مستخدم
// ⚠️ All file uploads go to Azure Blob Storage — Firebase Storage is NOT used

/** الحجم الأقصى للرفع على Azure Blob Storage (صور، PDFs، مقاطع، كتب)
 *  Maximum file size for Azure Blob Storage uploads (images, PDFs, videos, books) */
export const MAX_FILE_SIZE_AZURE = 200 * 1024 * 1024; // 200 MB

/** الحجم الأقصى العام — نقطة التحقق الوحيدة قبل الرفع
 *  General upload guard — the only file size check needed */
export const MAX_FILE_SIZE = MAX_FILE_SIZE_AZURE; // 200 MB

/** أقصى عدد ملفات في رفع واحد | Maximum files per upload batch */
export const MAX_FILES_PER_UPLOAD = 5;

/** الحد الأقصى لطول نص السؤال | Maximum characters for a question body */
export const MAX_QUESTION_LENGTH = 1000;

/** الحد الأقصى لطول نص الإجابة | Maximum characters for an answer body */
export const MAX_ANSWER_LENGTH = 5000;

/** الحد الأدنى لطول كلمة المرور | Minimum password length */
export const MIN_PASSWORD_LENGTH = 8;

// ─────────────────────────────────────────────────────────────────────────────
// التقسيم إلى صفحات | Pagination
// ─────────────────────────────────────────────────────────────────────────────

/** عدد المنشورات في كل صفحة | Posts loaded per page / per Firestore query */
export const POSTS_PER_PAGE = 10;

/** عدد الأسئلة في كل صفحة ببنك الأسئلة | Questions per page in MCQ bank */
export const QUESTIONS_PER_PAGE = 20;

/** عدد المتصدرين المعروضين | Entries shown on the leaderboard */
export const LEADERBOARD_SIZE = 10;

// ─────────────────────────────────────────────────────────────────────────────
// توقيت واجهة المستخدم | UI Timing
// ─────────────────────────────────────────────────────────────────────────────

/** مدة ظهور الـ Toast notification (مللي ثانية) | Toast display duration (ms) */
export const TOAST_DURATION = 3000;

/** تأخير Debounce لحقول البحث (مللي ثانية) | Debounce delay for search inputs (ms) */
export const DEBOUNCE_DELAY = 300;

/** أقصى وقت انتظار لأي طلب شبكة (مللي ثانية) | Max wait for any network call (ms) */
export const API_TIMEOUT = 30_000;

// ─────────────────────────────────────────────────────────────────────────────
// التحدي والاختبار | Quiz / Challenge
// ─────────────────────────────────────────────────────────────────────────────

/** الوقت المسموح لكل جلسة تحدي (ثانية) | Time limit per challenge session (seconds) */
export const QUIZ_TIME_LIMIT = 300; // 5 دقائق | 5 minutes

/** عدد الأسئلة المختارة عشوائياً لكل تحدي | Questions randomly selected per challenge */
export const QUESTIONS_PER_QUIZ = 10;

// ─────────────────────────────────────────────────────────────────────────────
// مفاتيح التخزين المحلي | localStorage Keys
// مُسبوقة بـ 'mansa_' لتفادي التعارض مع تطبيقات أخرى على نفس الـ origin
// ─────────────────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  USER_PROFILE: 'mansa_user_profile', // بيانات المستخدم المحفوظة من Firestore
  THEME: 'mansa_theme', // اسم النمط البصري المفعّل
  LANGUAGE: 'mansa_language', // اللغة المفعّلة: 'ar' | 'en'
  QUIZ_STATE: 'mansa_quiz_state', // حالة تحدي قيد التنفيذ (للاسترداد عند التحديث)
  DRAFTS: 'mansa_drafts', // مسودات أسئلة/إجابات لم تُحفظ بعد
};

// ─────────────────────────────────────────────────────────────────────────────
// أنواع الملفات المسموحة | Allowed File Types
// ─────────────────────────────────────────────────────────────────────────────

/** أنواع MIME المقبولة لرفع الصور | Accepted MIME types for image uploads */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** أنواع MIME المقبولة لرفع المستندات | Accepted MIME types for document uploads */
export const ALLOWED_DOC_TYPES = ['application/pdf'];

// ─────────────────────────────────────────────────────────────────────────────
// التعبيرات النمطية للتحقق | Validation Regex
// ─────────────────────────────────────────────────────────────────────────────

export const REGEX = {
  /** تنسيق البريد الإلكتروني | Standard email format */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** أرقام الهاتف المصرية — 010، 011، 012، 015 | Egyptian mobile numbers */
  PHONE: /^01[0125]\d{8}$/,

  /** رابط مطلق (http أو https) | Absolute URL */
  URL: /^https?:\/\/.+/,
};

// ─────────────────────────────────────────────────────────────────────────────
// نقاط نهاية الـ APIs الخارجية | External API Endpoints
// المفاتيح في env.js (VITE_GROQ_API_KEY, VITE_GEMINI_API_KEY)
// ─────────────────────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  /** Groq: llama-3.3-70b — مساعد المحادثة الذكي | AI chat assistant */
  GROQ: 'https://api.groq.com/openai/v1/chat/completions',

  /** Google Gemini — تحليل الصور | Image analysis */
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models',
};

// ─────────────────────────────────────────────────────────────────────────────
// رسائل الخطأ | Error Messages
// نصوص عربية تُعرض للمستخدم — للتفاصيل الموسّعة راجع translations/ar.js
// ─────────────────────────────────────────────────────────────────────────────

export const ERROR_MESSAGES = {
  NETWORK: 'خطأ في الاتصال. تحقق من الإنترنت.',
  AUTH_FAILED: 'فشل تسجيل الدخول. تحقق من بياناتك.',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح.',
  FILE_TOO_LARGE: `حجم الملف يجب ألا يتجاوز ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  WEAK_PASSWORD: `كلمة المرور يجب أن تكون ${MIN_PASSWORD_LENGTH} أحرف على الأقل`,
  GENERIC: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
};
