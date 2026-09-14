import { unicodeToMLTT } from '../../src/index.js';
import fixtures from '../fixtures/unicode-to-mltt.json' with { type: 'json' };

console.log('--- TEST: Unicode -> ML-TT Consonants ---');
let passed = 0;
let failed = 0;

for (const [unicode, expected] of Object.entries(fixtures.consonants)) {
  const result = unicodeToMLTT(unicode);
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL] ${unicode} -> Got: ${result} | Expected: ${expected}`);
  }
}

console.log(`Consonants Test: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
