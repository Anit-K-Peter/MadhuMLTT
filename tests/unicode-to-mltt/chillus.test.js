import { unicodeToMLTT } from '../../src/index.js';
import fixtures from '../fixtures/unicode-to-mltt.json' with { type: 'json' };

console.log('--- TEST: Unicode -> ML-TT Chillus ---');
let passed = 0;
let failed = 0;

for (const [unicode, expected] of Object.entries(fixtures.chillus)) {
  const result = unicodeToMLTT(unicode);
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL] ${unicode} -> Got: ${result} | Expected: ${expected}`);
  }
}

// Test virama+ZWJ sequences
const viramaZwjTests = [
  { unicode: 'ന\u0D4D\u200D', expected: '³' },
  { unicode: 'ര\u0D4D\u200D', expected: 'À' },
  { unicode: 'ല\u0D4D\u200D', expected: 'Â' },
  { unicode: 'ള\u0D4D\u200D', expected: 'Ä' },
  { unicode: 'ണ\u0D4D\u200D', expected: '¬' }
];

for (const { unicode, expected } of viramaZwjTests) {
  const result = unicodeToMLTT(unicode);
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL Virama+ZWJ] Got: ${result} | Expected: ${expected}`);
  }
}

console.log(`Chillus Test: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
