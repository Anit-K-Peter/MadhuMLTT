import { unicodeToMLTT, mlttToUnicode } from '../../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — EDGE-CASES: UNKNOWN & NON-MALAYALAM CHARACTERS');
console.log('====================================================');

let passed = 0;
let failed = 0;

const testCases = [
  { text: 'Hello World 123!', mlttExpected: 'Hello World 123!' },
  { text: 'https://example.com/test?q=1', mlttExpected: 'https://example.com/test?q=1' },
  { text: 'Email: support@madhu.ml.in', mlttExpected: 'Email: support@madhu.ml.in' },
  { text: 'Price: \$99.99 (50% off)', mlttExpected: 'Price: \$99.99 (50% off)' },
  { text: 'हिंदी / English / മലയാളം', mlttExpected: 'हिंदी / English / aebmfw' }
];

for (const { text, mlttExpected } of testCases) {
  const mlttResult = unicodeToMLTT(text);
  if (mlttResult === mlttExpected) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL Unknown] Input: ${text} | Got: ${mlttResult} | Expected: ${mlttExpected}`);
  }
}

console.log('----------------------------------------------------');
console.log(`Unknown Chars Test: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
