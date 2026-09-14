import { unicodeToMLTT, mlttToUnicode, normalizeUnicode } from '../../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — EDGE-CASES: UNICODE NORMALIZATION MATRIX');
console.log('====================================================');

let passed = 0;
let failed = 0;

const chilluMatrix = [
  // ൻ (N Chillu: U+0D7B) variants
  { name: 'Atomic ൻ', unicode: '\u0D7B', expectedMltt: '³' },
  { name: 'Virama+ZWJ ൻ', unicode: '\u0D28\u0D4D\u200D', expectedMltt: '³' },
  { name: 'Virama+ZWNJ ൻ', unicode: '\u0D28\u0D4D\u200C', expectedMltt: '³' },

  // ർ (RR Chillu: U+0D7C) variants
  { name: 'Atomic ർ', unicode: '\u0D7C', expectedMltt: 'À' },
  { name: 'Virama+ZWJ ർ', unicode: '\u0D30\u0D4D\u200D', expectedMltt: 'À' },
  { name: 'Virama+ZWNJ ർ', unicode: '\u0D30\u0D4D\u200C', expectedMltt: 'À' },

  // ൽ (L Chillu: U+0D7D) variants
  { name: 'Atomic ൽ', unicode: '\u0D7D', expectedMltt: 'Â' },
  { name: 'Virama+ZWJ ൽ', unicode: '\u0D32\u0D4D\u200D', expectedMltt: 'Â' },

  // ൾ (LL Chillu: U+0D7E) variants
  { name: 'Atomic ൾ', unicode: '\u0D7E', expectedMltt: 'Ä' },
  { name: 'Virama+ZWJ ൾ', unicode: '\u0D33\u0D4D\u200D', expectedMltt: 'Ä' },

  // ൺ (NN Chillu: U+0D7A) variants
  { name: 'Atomic ൺ', unicode: '\u0D7A', expectedMltt: '¬' },
  { name: 'Virama+ZWJ ൺ', unicode: '\u0D23\u0D4D\u200D', expectedMltt: '¬' }
];

for (const { name, unicode, expectedMltt } of chilluMatrix) {
  const actualMltt = unicodeToMLTT(unicode);
  const revertedUnicode = mlttToUnicode(actualMltt);
  const isNormMatch = normalizeUnicode(revertedUnicode) === normalizeUnicode(unicode);

  if (actualMltt === expectedMltt && isNormMatch) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL Normalization ${name}] Input: ${unicode} | Got ML-TT: ${actualMltt} | Reverted: ${revertedUnicode}`);
  }
}

// NFD Decomposition Test
const nfdInput = 'കേരളം'.normalize('NFD');
const nfdMltt = unicodeToMLTT(nfdInput);
const nfdReverted = mlttToUnicode(nfdMltt);

if (nfdMltt === 'tIcfw' && nfdReverted === 'കേരളം') {
  passed++;
} else {
  failed++;
  console.error(`[FAIL NFD Normalization] Got ML-TT: ${nfdMltt} | Reverted: ${nfdReverted}`);
}

console.log('----------------------------------------------------');
console.log(`Normalization Matrix Test: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
