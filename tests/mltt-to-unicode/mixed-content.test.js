import { mlttToUnicode } from '../../src/index.js';

console.log('--- TEST: ML-TT -> Unicode Mixed Content ---');
let passed = 0;
let failed = 0;

// Strict mode test (all ML-TT bytes decoded)
const strictTests = [
  { ascii: 'Hello tIcfw', expected: 'ഒലഹഹീ കേരളം' },
  { ascii: 'tIcfw 2026', expected: 'കേരളം 2026' }
];

for (const { ascii, expected } of strictTests) {
  const result = mlttToUnicode(ascii, { mode: 'strict', preserveEnglish: false });
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL Strict] ${ascii} -> Got: ${result} | Expected: ${expected}`);
  }
}

// Mixed / Preserve English mode test
const mixedTests = [
  { ascii: 'Email: test@example.com', expected: 'Email: test@example.com' },
  { ascii: 'tIcfw - Delhi', expected: 'കേരളം - Delhi' }
];

for (const { ascii, expected } of mixedTests) {
  const result = mlttToUnicode(ascii, { preserveEnglish: true });
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL Mixed] ${ascii} -> Got: ${result} | Expected: ${expected}`);
  }
}

console.log(`ML-TT Mixed Content Test: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
