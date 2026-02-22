/**
 * @file .prettierrc.cjs
 * @description إعدادات Prettier لمشروع MANSA | Prettier configuration for MANSA
 *
 * يستخدم صيغة .cjs لأن package.json يحتوي على "type": "module"
 * Uses .cjs format because package.json has "type": "module"
 *
 * دور Prettier: التنسيق الشكلي فقط — مسافات، أقواس، أسطر، اقتباسات
 * Prettier's job: visual formatting ONLY — not logic, not errors (that's ESLint)
 *
 * التكامل | Integration:
 *   1. Prettier ينسّق عند الحفظ (VSCode formatOnSave)
 *   2. ESLint يفحص المنطق بشكل منفصل (eslint-config-prettier يمنع التعارض)
 *   3. lint-staged يشغّل كليهما قبل كل commit
 */

'use strict';

module.exports = {
  // ─── الفواصل المنقوطة | Semicolons ───────────────────────────────────────
  // true = فاصلة منقوطة في نهاية كل جملة
  // المعيار في معظم أكواد JavaScript الاحترافية
  semi: true,

  // ─── علامات الاقتباس | Quotes ────────────────────────────────────────────
  // single quotes هي المعيار في JavaScript (على عكس JSON وHTML)
  singleQuote: true,

  // ─── اقتباس JSX | JSX Quotes ────────────────────────────────────────────
  // double quotes هي المعيار في HTML/JSX attributes
  jsxSingleQuote: false,

  // ─── المسافة البادئة | Indentation ───────────────────────────────────────
  // 2 spaces = المعيار العالمي في JavaScript و CSS و HTML
  tabWidth: 2,
  useTabs: false, // مسافات وليس tabs — يتوافق مع .editorconfig

  // ─── أقصى عرض للسطر | Print Width ───────────────────────────────────────
  // 100 أفضل من 80 للشاشات الحديثة — يمنع الـ wrapping المبكر غير الضروري
  // 100 is better than 80 for modern screens — prevents unnecessary early wrapping
  printWidth: 100,

  // ─── الفاصلة الزائدة | Trailing Commas ──────────────────────────────────
  // 'es5' = فاصلة في Arrays وObjects — يُبسّط Git diffs ويقلل أسطر التغيير
  // 'es5' = trailing comma in arrays & objects — cleaner git diffs
  trailingComma: 'es5',

  // ─── مسافات داخل الأقواس | Bracket Spacing ──────────────────────────────
  // true: { key: value }  — false: {key: value}
  bracketSpacing: true,

  // ─── موضع قوس الإغلاق في JSX | Bracket Same Line ────────────────────────
  // false = قوس الإغلاق في سطر منفصل (أوضح للقراءة)
  bracketSameLine: false,

  // ─── أقواس Arrow Functions | Arrow Parens ────────────────────────────────
  // 'avoid'  = x => x  (بدون أقواس للوسيط الواحد — Prettier v3)
  // 'always' = (x) => x (مع أقواس دائماً)
  arrowParens: 'avoid',

  // ─── نهاية السطر | End of Line ───────────────────────────────────────────
  // 'lf' = Unix style — متوافق مع .gitattributes (eol=lf)
  // يمنع مشاكل CRLF على Windows
  endOfLine: 'lf',

  // ─── اقتباس Object Properties ────────────────────────────────────────────
  // 'as-needed' = اقتباس فقط عند الضرورة: { 'my-key': 1, normal: 2 }
  quoteProps: 'as-needed',

  // ─── حجم المسافة البادئة في HTML ─────────────────────────────────────────
  htmlWhitespacesensitivity: 'css',

  // ─── إعدادات خاصة بأنواع الملفات | Per-file-type Overrides ──────────────
  overrides: [
    {
      // JSON: يستلزم double quotes — لا تغيير في singleQuote
      files: ['*.json', '*.jsonc'],
      options: {
        singleQuote: false,
        trailingComma: 'none', // JSON لا يدعم trailing commas
      },
    },
    {
      // HTML: عرض سطر أطول — templates غالباً أطول من الكود العادي
      files: ['*.html'],
      options: {
        printWidth: 120,
      },
    },
    {
      // CSS: إعدادات قياسية
      files: ['*.css'],
      options: {
        singleQuote: false, // CSS يستخدم double quotes في القيم
      },
    },
    {
      // Markdown: الحفاظ على التنسيق الأصلي — Prettier يغير الـ prose أحياناً
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'preserve', // لا تغيير في تنسيق الفقرات
        printWidth: 10000, // لا line wrapping في Markdown
      },
    },
    {
      // ملفات الـ Environment — عادةً لها صيغة خاصة
      files: ['.env*'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
