/**
 * @file firebase.js
 * @description MANSA Firebase initialization — exports db and auth only.
 * تهيئة Firebase وتصدير الخدمات المطلوبة
 *
 * ⚠️ Firebase Storage is NOT used in this project.
 * All file storage (images, PDFs, videos) goes to Azure Blob Storage.
 * See: src/js/services/azure-storage-service.js (Phase 5)
 *
 * Usage | الاستخدام:
 *   import { db, auth } from '@config/firebase.js';
 *
 * Emulator: يتصل بـ Firebase Emulator تلقائياً إذا VITE_USE_EMULATOR=true
 * Emulator: auto-connects to local emulator when VITE_USE_EMULATOR=true
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';

import { ENV } from './env.js';

// ─── Initialize Firebase ──────────────────────────────────────────────────────
const app = initializeApp(ENV.firebase);

// ─── Firebase Services (Firestore + Auth only) ────────────────────────────────
// Storage is intentionally excluded — Azure Blob Storage handles all file uploads
export const db = getFirestore(app);
export const auth = getAuth(app);

// ─── Firebase Emulator (Development only) ────────────────────────────────────
// يتصل بالـ Emulator المحلي عند التطوير بدلاً من Firebase الحقيقي
// Connects to local emulator during development instead of real Firebase
// This allows the admin panel to write data freely (no auth needed locally)
if (ENV.useEmulator) {
  // تأكد من تشغيل: firebase emulators:start
  // Make sure to run: firebase emulators:start
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });

  console.info('[MANSA] 🔧 Firebase Emulator connected — Firestore:8080 | Auth:9099');
}

// Enable offline persistence for faster subsequent loads (Production only)
// تفعيل التخزين المؤقت المحلي لسرعة التحميل في المرات القادمة (في الإنتاج فقط)
if (!ENV.useEmulator) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firebase persistence not supported');
    }
  });
}

export default app;
