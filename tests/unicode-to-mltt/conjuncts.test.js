import { unicodeToMLTT } from '../../src/index.js';
import fixtures from '../fixtures/unicode-to-mltt.json' with { type: 'json' };

console.log('--- TEST: Unicode -> ML-TT Conjuncts ---');
let passed = 0;
let failed = 0;

for (const [unicode, expected] of Object.entries(fixtures.conjuncts)) {
  const result = unicodeToMLTT(unicode);
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL] ${unicode} -> Got: ${result} | Expected: ${expected}`);
  }
}

console.log(`Conjuncts Test: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
