/**
 * @file .eslintrc.cjs
 * @description إعدادات ESLint لمشروع MANSA | ESLint configuration for MANSA
 *
 * يستخدم صيغة .cjs لأن package.json يحتوي على "type": "module"
 * Uses .cjs format because package.json has "type": "module"
 *
 * درجات الخطورة | Severity levels:
 *   "error" → يمنع الـ commit ويكسر الـ CI    🔴
 *   "warn"  → تحذير، لا يمنع الـ commit        🟡
 *   "off"   → القاعدة معطّلة                   ⚪
 */

'use strict';

module.exports = {
  // ─── البيئة | Runtime Environment ─────────────────────────────────────────
  // يحدد المتغيرات العامة المتاحة في كل ملف
  // Defines which global variables are available
  env: {
    browser: true, // window, document, navigator, fetch, localStorage, etc.
    es2022: true, // top-level await, class fields, Object.hasOwn, etc.
    node: false, // لا Globals للـ Node في كود المتصفح | No Node globals in browser code
  },

  // ─── الامتدادات | Base Configurations ─────────────────────────────────────
  // ⚠️ الترتيب مهم: prettier يجب أن يكون آخراً دائماً
  // ⚠️ Order matters: prettier MUST be last — it disables formatting rules
  extends: [
    'eslint:recommended', // القواعد الأساسية الموصى بها من ESLint
    'plugin:import/recommended', // قواعد imports والـ module system
    'prettier', // تعطيل أي قاعدة تتعارض مع Prettier
  ],

  // ─── الإضافات | Plugins ───────────────────────────────────────────────────
  plugins: [
    'import', // تحليل وترتيب Import statements
  ],

  // ─── خيارات التحليل | Parser Options ─────────────────────────────────────
  parserOptions: {
    ecmaVersion: 'latest', // دعم أحدث صيغ JavaScript | Support latest JS syntax
    sourceType: 'module', // ES Modules — import / export
  },

  // ─── القواعد | Rules ──────────────────────────────────────────────────────
  rules: {
    // ══ منع الأخطاء | Error Prevention ══════════════════════════════════════

    // تحذير عند استخدام console.log — مسموح بـ warn/error/info للـ debugging الضروري
    // Warn on console.log — allow warn/error/info for necessary debugging
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

    // ❌ ممنوع نهائياً - يجب حذفه قبل الـ commit
    // ❌ Forbidden — must be removed before commit
    'no-debugger': 'error',

    // تحذير للمتغيرات غير المستخدمة — الوسائط التي تبدأ بـ _ مستثناة
    // Warn on unused variables — args starting with _ are exempt
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_', // مثال: _event, _index
        ignoreRestSiblings: true,
      },
    ],

    'no-undef': 'error', // ❌ لا متغيرات غير معرّفة | No undefined variables
    'no-var': 'error', // ❌ const/let فقط | const/let only — no var
    'no-duplicate-case': 'error', // ❌ لا case مكررة في switch
    'no-unreachable': 'error', // ❌ لا كود بعد return/throw
    'no-constant-condition': 'error', // ❌ لا شروط ثابتة (while(true) مستثنى)
    'no-empty': ['error', { allowEmptyCatch: false }], // ❌ لا blocks فارغة

    // ══ أفضل الممارسات | Best Practices ══════════════════════════════════════

    // === دائماً لمقارنة القيم — منع == الذي يؤدي لـ type coercion
    // Always use === — prevents bugs from type coercion
    eqeqeq: ['error', 'always', { null: 'ignore' }],

    // أقواس {} إلزامية لكل if/for/while حتى لو سطر واحد — يمنع if بدون أقواس
    curly: ['error', 'all'],

    // تفضيل const للمتغيرات التي لا تتغير
    'prefer-const': ['warn', { destructuring: 'all' }],

    // Template literals بدلاً من String concatenation
    // 'hello ' + name  →  `hello ${name}`
    'prefer-template': 'warn',

    // Object shorthand: { x: x }  →  { x }
    'object-shorthand': ['warn', 'always'],

    // Arrow functions للـ callbacks
    'prefer-arrow-callback': ['warn', { allowNamedFunctions: false }],

    // تجنب else بعد return — يبسّط الكود
    'no-else-return': ['warn', { allowElseIf: false }],

    // switch يجب أن يحتوي على default case
    'default-case': ['warn', { commentPattern: '^skip\\sdefault' }],

    // throw يجب أن يرمي Error objects — ليس strings أو numbers
    'no-throw-literal': 'error',

    // async function يجب أن تحتوي على await — يكتشف async غير الضروري
    'require-await': 'warn',

    // ❌ لا Promise في constructor executor
    'no-promise-executor-return': 'error',

    // ══ ترتيب Imports | Import Order ══════════════════════════════════════════

    // ❌ لا import مكرر لنفس المصدر
    'import/no-duplicates': 'error',

    // ❌ لا module يستورد نفسه
    'import/no-self-import': 'error',

    // ❌ شرائح مسار غير ضرورية: ./foo/bar/../baz
    'import/no-useless-path-segments': ['warn', { noUselessIndex: true }],

    // ترتيب import groups مع سطر فارغ بين كل مجموعة
    // Import groups ordered with blank lines between them
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

    // لا if وحيد داخل else — استخدم else if بدلاً منه
    'no-lonely-if': 'warn',

    // Yoda conditions: if (42 === x)  →  if (x === 42)
    yoda: ['warn', 'never'],

    // ══ أمان | Security ═══════════════════════════════════════════════════════

    'no-eval': 'error', // ❌ eval() — ثغرة أمنية خطيرة
    'no-implied-eval': 'error', // ❌ setTimeout('code') — مثل eval
    'no-new-func': 'error', // ❌ new Function('code') — مثل eval
    'no-script-url': 'error', // ❌ javascript: URLs — XSS risk
  },

  // ─── إعدادات الإضافات | Plugin Settings ──────────────────────────────────
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.json'] },
    },
  },

  // ─── الاستثناءات | Ignore Patterns ───────────────────────────────────────
  // مجلدات وملفات يتجاهلها ESLint تماماً
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    'coverage/',
    '*.min.js',
    '.husky/',
    'public/assets/vendors/',
    'lighthouserc.cjs',
  ],
};
