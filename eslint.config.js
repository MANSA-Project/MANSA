/**
 * ESLint Flat Config
 * https://eslint.org/docs/latest/use/configure/configuration-files
 */

export default [
  {
    // Apply to all JS source files
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    // Test files — inject Vitest globals so ESLint doesn't flag describe/test/expect
    files: ['tests/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
  },
];
