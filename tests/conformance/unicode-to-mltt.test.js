import { unicodeToMLTT } from '../../src/index.js';
import unicodeFixtures from '../fixtures/unicode-to-mltt.json' with { type: 'json' };

console.log('====================================================');
console.log('MADHU ML TT — CONFORMANCE SUITE: UNICODE -> ML-TT');
console.log('====================================================');

let passed = 0;
let failed = 0;

const categories = ['vowels', 'consonants', 'matras', 'conjuncts', 'chillus', 'words', 'mixed'];

for (const cat of categories) {
  const fixtureGroup = unicodeFixtures[cat];
  if (!fixtureGroup) continue;

  for (const [unicodeInput, expectedMltt] of Object.entries(fixtureGroup)) {
    const actualMltt = unicodeToMLTT(unicodeInput);
    if (actualMltt === expectedMltt) {
      passed++;
    } else {
      failed++;
      console.error(`[CONFORMANCE FAIL - ${cat}] Input: ${unicodeInput}`);
      console.error(`                       Expected ML-TT: ${expectedMltt}`);
      console.error(`                       Actual ML-TT:   ${actualMltt}`);
    }
  }
}

console.log('----------------------------------------------------');
console.log(`Unicode -> ML-TT Conformance: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
