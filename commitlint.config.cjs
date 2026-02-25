/**
 * @file commitlint.config.cjs
 * @description إعدادات Commitlint للتحقق من رسائل الـ Git commits
 * Commitlint configuration — validates Git commit messages
 *
 * يستخدم صيغة .cjs لأن package.json يحتوي على "type": "module"
 * Uses .cjs format because package.json has "type": "module"
 *
 * الصيغة المطلوبة | Required format (Conventional Commits):
 *   <type>(<scope>): <description>
 *
 *   feat(auth): add Google sign-in support
 *   fix(quiz): resolve timer freezing on mobile
 *   docs(readme): update setup instructions
 */

/* eslint-env node */
'use strict';

module.exports = {
  // الامتداد من المعيار الرسمي للـ Conventional Commits
  // Extend from the official Conventional Commits standard
  extends: ['@commitlint/config-conventional'],

  rules: {
    // ─── نوع الـ commit | Commit Type ────────────────────────────────────
    // الأنواع المقبولة | Accepted types
    'type-enum': [
      2, // 2 = error (يمنع الـ commit)
      'always',
      [
        'feat', // ميزة جديدة        | New feature
        'fix', // إصلاح خطأ         | Bug fix
        'docs', // توثيق فقط         | Documentation only
        'style', // تنسيق فقط         | Formatting only (no logic change)
        'refactor', // إعادة هيكلة       | Code refactor (no feature/fix)
        'perf', // تحسين أداء        | Performance improvement
        'test', // إضافة اختبارات    | Adding/updating tests
        'chore', // مهام صيانة        | Maintenance tasks
        'ci', // تغييرات CI/CD     | CI/CD changes
        'build', // نظام البناء        | Build system changes
        'revert', // التراجع عن commit  | Revert a previous commit
      ],
    ],

    // حالة النوع: يجب أن يكون lowercase دائماً
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'], // النوع إلزامي

    // ─── النطاق (scope) | Commit Scope ────────────────────────────────────────
    // الـ scope اختياري لكن إذا وُجد يجب أن يكون lowercase
    'scope-case': [1, 'always', 'lower-case'],
    'scope-empty': [0], // الـ scope اختياري
    // تحذير (ليس خطأ) إذا استُخدم نطاق غير مغطى — انظر DEVELOPER_GUIDE.md §5 للنطاقات المعتمدة
    // Warning (not error) if scope is not in the recognised list
    'scope-enum': [
      1, // 1 = warning only — does not block the commit
      'always',
      [
        // ─ Core infrastructure ─────────────────────────────────
        'state',
        'events',
        'router',
        'cache',
        'storage',
        'logger',
        'validators',
        'helpers',
        'i18n',
        // ─ Config ───────────────────────────────────────
        'config',
        'env',
        'firebase',
        'constants',
        'pwa',
        // ─ Features ────────────────────────────────────
        'auth',
        'universities',
        'faculties',
        'departments',
        'subjects',
        'quiz',
        'leaderboard',
        'profile',
        'posts',
        'ai',
        'admin',
        // ─ UI & Styling ────────────────────────────────
        'ui',
        'css',
        'theme',
        'navbar',
        'breadcrumb',
        'layout',
        // ─ Infrastructure & Tooling ──────────────────────
        'deps',
        'ci',
        'azure',
        'security',
        'build',
        // ─ Documentation ──────────────────────────────
        'readme',
        'guide',
        'standards',
        'agent-context',
        'plan',
      ],
    ],

    // ─── وصف الـ commit | Commit Subject ─────────────────────────────────
    'subject-empty': [2, 'never'], // الوصف إلزامي
    'subject-max-length': [2, 'always', 72], // أقصى 72 حرفاً
    'subject-case': [
      2,
      'always',
      [
        // يجب أن يبدأ بـ lowercase أو أي حرف
        'lower-case',
        'sentence-case',
      ],
    ],
    'subject-full-stop': [2, 'never', '.'], // لا نقطة في نهاية الوصف

    // ─── جسم الـ commit | Commit Body ────────────────────────────────────
    'body-leading-blank': [1, 'always'], // سطر فارغ قبل الجسم
    'body-max-line-length': [1, 'always', 100],

    // ─── التذييل | Footer ────────────────────────────────────────────────
    'footer-leading-blank': [1, 'always'], // سطر فارغ قبل التذييل
    'footer-max-line-length': [1, 'always', 100],
  },
};
