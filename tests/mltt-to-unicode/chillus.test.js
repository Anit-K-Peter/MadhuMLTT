import { mlttToUnicode } from '../../src/index.js';
import fixtures from '../fixtures/mltt-to-unicode.json' with { type: 'json' };

console.log('--- TEST: ML-TT -> Unicode Chillus ---');
let passed = 0;
let failed = 0;

for (const [ascii, expected] of Object.entries(fixtures.chillus)) {
  const result = mlttToUnicode(ascii);
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL] ${ascii} -> Got: ${result} | Expected: ${expected}`);
  }
}

console.log(`ML-TT Chillus Test: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
