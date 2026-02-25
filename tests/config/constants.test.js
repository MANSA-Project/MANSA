/**
 * @file constants.test.js
 * @description Tests for REGEX patterns in constants.js
 *
 * Run:  npm run test
 * File: tests/config/constants.test.js
 */

import { REGEX } from '../../src/js/config/constants.js';

// ─────────────────────────────────────────────────────────────────────────────
// REGEX.EMAIL
// ─────────────────────────────────────────────────────────────────────────────

describe('REGEX.EMAIL', () => {
  const valid = [
    'user@example.com',
    'user.name@domain.co',
    'user+tag@sub.domain.org',
    'USER@EXAMPLE.COM',
    '123@456.xy',
  ];

  const invalid = [
    '',
    'notanemail',
    '@nodomain.com',
    'noatsign.com',
    'user@',
    'user @example.com', // space before @
    'user@ example.com', // space after @
    'user@domain', // no TLD dot
  ];

  test.each(valid)('accepts valid email: %s', email => {
    expect(REGEX.EMAIL.test(email)).toBe(true);
  });

  test.each(invalid)('rejects invalid email: %s', email => {
    expect(REGEX.EMAIL.test(email)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// REGEX.URL
// ─────────────────────────────────────────────────────────────────────────────

describe('REGEX.URL', () => {
  const valid = [
    'http://example.com',
    'https://example.com',
    'https://sub.domain.co.uk/path?q=1#hash',
    'http://localhost:3000',
    'https://192.168.1.1/api',
  ];

  const invalid = [
    '',
    'example.com', // no protocol
    'ftp://example.com', // wrong protocol
    '//example.com', // protocol-relative — not absolute
    'javascript:void(0)', // not http/https
    'http://', // protocol only, no host
  ];

  test.each(valid)('accepts valid URL: %s', url => {
    expect(REGEX.URL.test(url)).toBe(true);
  });

  test.each(invalid)('rejects invalid URL: %s', url => {
    expect(REGEX.URL.test(url)).toBe(false);
  });
});
