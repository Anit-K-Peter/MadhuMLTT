import { unicodeToMLTT, mlttToUnicode, normalizeUnicode } from '../../src/index.js';
import unicodeFixtures from '../fixtures/unicode-to-mltt.json' with { type: 'json' };

console.log('====================================================');
console.log('MADHU ML TT — ROUND-TRIP FIDELITY TEST SUITE');
console.log('====================================================');

const pureMalayalamCorpus = [
  ...Object.keys(unicodeFixtures.words),
  ...Object.keys(unicodeFixtures.matras),
  ...Object.keys(unicodeFixtures.conjuncts),
  'നമസ്കാരം',
  'മലയാളം',
  'കേരളം',
  'സ്വതന്ത്രം',
  'ശ്രീ',
  'പ്രവർത്തനം',
  'ഇന്ത്യ',
  'ഭാഷ',
  'നന്ദി'
];

const mixedCorpus = [
  ...Object.keys(unicodeFixtures.mixed),
  'Hello കേരളം',
  'കേരളം 2026',
  'Email: test@example.com',
  'കേരളം - Delhi'
];

let passed = 0;
let failed = 0;

// Pure Malayalam Roundtrip Tests
for (const input of pureMalayalamCorpus) {
  const normInput = normalizeUnicode(input);
  const mltt = unicodeToMLTT(input);
  const result = mlttToUnicode(mltt);
  const normResult = normalizeUnicode(result);

  if (normResult === normInput) {
    passed++;
  } else {
    failed++;
    console.error(`[ROUNDTRIP FAIL Pure] Input: ${input} | ML-TT: ${mltt} | Result: ${result}`);
  }
}

// Mixed Content Roundtrip Tests (using preserveEnglish: true)
for (const input of mixedCorpus) {
  const normInput = normalizeUnicode(input);
  const mltt = unicodeToMLTT(input);
  const result = mlttToUnicode(mltt, { preserveEnglish: true });
  const normResult = normalizeUnicode(result);

  if (normResult === normInput) {
    passed++;
  } else {
    failed++;
    console.error(`[ROUNDTRIP FAIL Mixed] Input: ${input} | ML-TT: ${mltt} | Result: ${result}`);
  }
}

console.log('----------------------------------------------------');
console.log(`Round-trip Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
