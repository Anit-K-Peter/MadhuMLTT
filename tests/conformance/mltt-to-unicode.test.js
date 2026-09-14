import { mlttToUnicode } from '../../src/index.js';
import mlttFixtures from '../fixtures/mltt-to-unicode.json' with { type: 'json' };

console.log('====================================================');
console.log('MADHU ML TT — CONFORMANCE SUITE: ML-TT -> UNICODE');
console.log('====================================================');

let passed = 0;
let failed = 0;

const categories = ['basic', 'matras', 'conjuncts', 'chillus', 'mixed'];

for (const cat of categories) {
  const fixtureGroup = mlttFixtures[cat];
  if (!fixtureGroup) continue;

  for (const [mlttInput, expectedUnicode] of Object.entries(fixtureGroup)) {
    const isMixedCase = cat === 'mixed' && (mlttInput.includes('Email') || mlttInput.includes('Delhi'));
    const actualUnicode = mlttToUnicode(mlttInput, isMixedCase ? { preserveEnglish: true } : {});

    if (actualUnicode === expectedUnicode) {
      passed++;
    } else {
      failed++;
      console.error(`[CONFORMANCE FAIL - ${cat}] ML-TT Input: ${mlttInput}`);
      console.error(`                       Expected Unicode: ${expectedUnicode}`);
      console.error(`                       Actual Unicode:   ${actualUnicode}`);
    }
  }
}

console.log('----------------------------------------------------');
console.log(`ML-TT -> Unicode Conformance: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
