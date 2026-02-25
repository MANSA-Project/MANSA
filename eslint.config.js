/**
 * @file eslint.config.js
 * @description ESLint Flat Config — الإعداد الرسمي الوحيد لـ ESLint في المشروع
 * المرجع: https://eslint.org/docs/latest/use/configure/configuration-files
 *
 * هذا الملف يحل محل .eslintrc.cjs بالكامل.
 * This fully replaces .eslintrc.cjs — do not add that file back.
 *
 * درجات الخطورة | Severity levels:
 *   "error" → يمنع الـ commit ويكسر الـ CI    🔴
 *   "warn"  → تحذير، لا يمنع الـ commit        🟡
 *   "off"   → القاعدة معطّلة                   ⚪
 */

import globals from 'globals';
import pluginImport from 'eslint-plugin-import';
import configPrettier from 'eslint-config-prettier';

// ─────────────────────────────────────────────────────────────────────────────
// القواعد المشتركة بين ملفات المصدر والاختبارات
// Shared rules applied to both source and test files
// ─────────────────────────────────────────────────────────────────────────────
const sharedRules = {
  // ══ منع الأخطاء | Error Prevention ══════════════════════════════════════

  // ❌ ممنوع نهائياً — استخدم Logger من @utils/logger.js بدلاً منه
  // Only warn/error/info are allowed as a narrow escape hatch (e.g. firebase.js before Logger exists)
  'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

  // ❌ ممنوع نهائياً - يجب حذفه قبل الـ commit
  'no-debugger': 'error',

  // ❌ خطأ للمتغيرات غير المستخدمة — الوسائط التي تبدأ بـ _ مستثناة
  'no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'after-used',
      argsIgnorePattern: '^_', // مثال: _event, _index
      ignoreRestSiblings: true,
    },
  ],

  'no-undef': 'error', // ❌ لا متغيرات غير معرّفة
  'no-var': 'error', // ❌ const/let فقط — no var
  'no-duplicate-case': 'error', // ❌ لا case مكررة في switch
  'no-unreachable': 'error', // ❌ لا كود بعد return/throw
  'no-constant-condition': 'error', // ❌ لا شروط ثابتة
  'no-empty': ['error', { allowEmptyCatch: false }], // ❌ لا blocks فارغة

  // ══ أفضل الممارسات | Best Practices ══════════════════════════════════════

  // === دائماً لمقارنة القيم — منع == الذي يؤدي لـ type coercion
  eqeqeq: ['error', 'always', { null: 'ignore' }],

  // أقواس {} إلزامية لكل if/for/while حتى لو سطر واحد
  curly: ['error', 'all'],

  // تفضيل const للمتغيرات التي لا تتغير
  'prefer-const': ['warn', { destructuring: 'all' }],

  // Template literals بدلاً من String concatenation
  'prefer-template': 'warn',

  // Object shorthand: { x: x }  →  { x }
  'object-shorthand': ['warn', 'always'],

  // Arrow functions للـ callbacks
  'prefer-arrow-callback': ['warn', { allowNamedFunctions: false }],

  // تجنب else بعد return
  'no-else-return': ['warn', { allowElseIf: false }],

  // switch يجب أن يحتوي على default case
  'default-case': ['warn', { commentPattern: '^skip\\sdefault' }],

  // throw يجب أن يرمي Error objects — ليس strings أو numbers
  'no-throw-literal': 'error',

  // async function يجب أن تحتوي على await
  'require-await': 'warn',

  // ❌ لا Promise في constructor executor
  'no-promise-executor-return': 'error',

  // ══ ترتيب Imports | Import Order ══════════════════════════════════════════

  // ❌ لا import لمسار غير موجود — يكتشف مسارات مكسورة وقت الـ lint لا وقت التشغيل
  'import/no-unresolved': ['error', { commonjs: false, caseSensitive: true }],

  // ❌ لا import مكرر لنفس المصدر
  'import/no-duplicates': 'error',

  // ❌ لا module يستورد نفسه
  'import/no-self-import': 'error',

  // ❌ شرائح مسار غير ضرورية
  'import/no-useless-path-segments': ['warn', { noUselessIndex: true }],

  // ترتيب import groups مع سطر فارغ بين كل مجموعة
  'import/order': [
    'warn',
    {
      groups: [
        'builtin', // Node built-ins (path, fs, etc.)
        'external', // npm packages (firebase, etc.)
        'internal', // @ aliases من vite.config.js
        ['parent', 'sibling'], // ../foo, ./bar
        'index', // ./index
        'object', // import type
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    },
  ],

  // ══ أسلوب الكود | Code Style ══════════════════════════════════════════════

  // camelCase للمتغيرات والدوال — properties مستثناة (قد تأتي من API)
  camelcase: ['warn', { properties: 'never', ignoreDestructuring: true }],

  // Constructors تبدأ بحرف كبير: new User() وليس new user()
  'new-cap': ['warn', { newIsCap: true, capIsNew: false }],

  // مسافة بعد // في التعليقات
  'spaced-comment': [
    'warn',
    'always',
    {
      line: { markers: ['/'] },
      block: { balanced: true },
    },
  ],

  // لا if وحيد داخل else — استخدم else if
  'no-lonely-if': 'warn',

  // Yoda conditions: if (42 === x)  →  if (x === 42)
  yoda: ['warn', 'never'],

  // ══ أمان | Security ═══════════════════════════════════════════════════════

  'no-eval': 'error', // ❌ eval() — ثغرة أمنية خطيرة
  'no-implied-eval': 'error', // ❌ setTimeout('code') — مثل eval
  'no-new-func': 'error', // ❌ new Function('code') — مثل eval
  'no-script-url': 'error', // ❌ javascript: URLs — XSS risk
};

// ─────────────────────────────────────────────────────────────────────────────
// إعدادات الـ import plugin المشتركة
// Shared import plugin settings
// ─────────────────────────────────────────────────────────────────────────────
const importSettings = {
  'import/resolver': {
    // Resolves Node built-ins and npm packages
    node: { extensions: ['.js', '.json'] },
    // Resolves Vite @ aliases — must mirror vite.config.js resolve.alias exactly
    alias: {
      map: [
        ['@', './src'],
        ['@js', './src/js'],
        ['@css', './src/css'],
        ['@config', './src/js/config'],
        ['@utils', './src/js/utils'],
        ['@components', './src/js/components'],
        ['@features', './src/js/features'],
      ],
      extensions: ['.js', '.json'],
    },
  },
};

export default [
  // ─── الملفات المتجاهلة | Ignore Patterns ─────────────────────────────────
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      'coverage/**',
      '**/*.min.js',
      '.husky/**',
      'public/assets/vendors/**',
      'lighthouserc.cjs',
    ],
  },

  // ─── ملفات المصدر | Source Files (src/js/**/*.js) ─────────────────────────
  // البيئة: المتصفح + ES2022 — لا Node globals
  {
    files: ['src/js/**/*.js'],
    plugins: {
      import: pluginImport,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // window, document, navigator, fetch, localStorage, etc.
        ...globals.es2022, // top-level await, class fields, Object.hasOwn, etc.
      },
    },
    settings: importSettings,
    rules: sharedRules,
  },

  // ─── ملفات الاختبار | Test Files (tests/**/*.test.js) ─────────────────────
  // يضيف globals.vitest تلقائياً: describe, test, it, expect, vi, beforeEach, etc.
  // globals.vitest matches Vitest's 'globals: true' setting in vite.config.js
  {
    files: ['tests/**/*.test.js'],
    plugins: {
      import: pluginImport,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.vitest, // describe, test, it, expect, vi, beforeAll, afterAll, etc.
      },
    },
    settings: importSettings,
    rules: {
      ...sharedRules,
      // Test files may use 'javascript:' strings as test data (e.g. URL regex validation)
      // This is not executable code — disabling the rule for test scope only
      'no-script-url': 'off',
    },
  },

  // ─── Prettier (يجب أن يكون آخراً دائماً) ─────────────────────────────────
  // يعطّل أي قاعدة ESLint تتعارض مع Prettier — الترتيب إلزامي
  // Disables all ESLint rules that conflict with Prettier — order is mandatory
  configPrettier,
];
