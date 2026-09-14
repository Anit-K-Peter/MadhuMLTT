import { unicodeToMLTT, mlttToUnicode } from '../../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — EDGE-CASES: MALFORMED INPUT');
console.log('====================================================');

let passed = 0;
let failed = 0;

const malformedCases = [
  { input: null, expected: '' },
  { input: undefined, expected: '' },
  { input: '', expected: '' },
  { input: '\x00\x01\x02', expected: '\x00\x01\x02' },
  { input: '   \n\t  ', expected: '   \n\t  ' },
  { input: 'þþþ', expected: '---' }, // Ambiguous extended ASCIIFE compatibility mode
  { input: '\uD800\uDFFF', expected: '\uD800\uDFFF' } // Surrogate pair
];

for (const { input, expected } of malformedCases) {
  try {
    const resForward = unicodeToMLTT(input);
    const resReverse = mlttToUnicode(input);

    if (typeof resForward === 'string' && typeof resReverse === 'string') {
      passed++;
    } else {
      failed++;
      console.error(`[FAIL Malformed] Returned non-string output for input: ${input}`);
    }
  } catch (err) {
    failed++;
    console.error(`[CRASH EDGE CASE] Engine crashed on input: ${input} | Error: ${err.message}`);
  }
}

console.log('----------------------------------------------------');
console.log(`Malformed Input Test: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
