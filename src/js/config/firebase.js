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
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

import { ENV } from './env.js';

// ─── Initialize Firebase ──────────────────────────────────────────────────────
const app = initializeApp(ENV.firebase);

// ─── Firebase Services (Firestore + Auth only) ────────────────────────────────
// Storage is intentionally excluded — Azure Blob Storage handles all file uploads
export const db = getFirestore(app);
export const auth = getAuth(app);

// ─── Vite HMR guard ──────────────────────────────────────────────────────────
// connectFirestoreEmulator / connectAuthEmulator can only be called ONCE per
// Firebase app instance. Vite's Hot Module Replacement re-evaluates this module
// on every file save, which would throw:
//   "Firestore has already been started and its settings can no longer be changed."
// Opting out of HMR for this file prevents that crash in the dev server.
if (import.meta.hot) {
  import.meta.hot.decline();
}

// ─── Firebase Emulator (Development only) ────────────────────────────────────
// يتصل بالـ Emulator المحلي عند التطوير بدلاً من Firebase الحقيقي
// Connects to local emulator during development instead of real Firebase
// This allows the admin panel to write data freely (no auth needed locally)
if (ENV.useEmulator) {
  // تأكد من تشغيل: firebase emulators:start
  // Make sure to run: firebase emulators:start
  const { host, firestorePort, authPort } = ENV.emulator;
  connectFirestoreEmulator(db, host, firestorePort);
  connectAuthEmulator(auth, `http://${host}:${authPort}`, { disableWarnings: true });
  // TODO Phase 6: replace with Logger.info() once logger.js is created
  if (ENV.isDev) {
    console.info(
      `[MANSA] 🔧 Firebase Emulator connected — Firestore:${firestorePort} | Auth:${authPort}`
    );
  }
}

export default app;
