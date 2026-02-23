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
// REGEX.PHONE  (Egyptian mobile: 010, 011, 012, 015 + 8 digits)
// ─────────────────────────────────────────────────────────────────────────────

describe('REGEX.PHONE', () => {
  const valid = [
    '01012345678', // Vodafone prefix 010
    '01112345678', // Orange prefix  011
    '01212345678', // Etisalat prefix 012
    '01512345678', // WE prefix      015
  ];

  const invalid = [
    '',
    '0101234567', // 10 digits — too short
    '010123456789', // 12 digits — too long
    '01312345678', // 013 — not a valid Egyptian prefix
    '01412345678', // 014 — not a valid Egyptian prefix
    '01612345678', // 016 — not valid
    '00112345678', // starts with 00 — not valid
    '01,12345678', // comma — the bug this fix prevented
    '020123456789', // starts with 02 — landline format
    '+201012345678', // international format — not supported here
    '010 123 4567', // spaces — not valid
  ];

  test.each(valid)('accepts valid Egyptian number: %s', phone => {
    expect(REGEX.PHONE.test(phone)).toBe(true);
  });

  test.each(invalid)('rejects invalid number: %s', phone => {
    expect(REGEX.PHONE.test(phone)).toBe(false);
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
