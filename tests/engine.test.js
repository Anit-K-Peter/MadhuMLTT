/**
 * Madhu ML TT — Engine Test Suite
 */

import { unicode2mltt, mltt2unicode, isMalayalam } from '../src/index.js';

const testCases = [
  { unicode: 'നമസ്കാരം', expectedAscii: '\\akvImcw' },
  { unicode: 'മലയാളം', expectedAscii: 'aebmfw' },
  { unicode: 'കേരളം', expectedAscii: 'tIcfw' },
  { unicode: 'സ്വതന്ത്രം', expectedAscii: 'kzX{´w' },
  { unicode: 'ശ്രീ', expectedAscii: '{io' },
  { unicode: 'പ്രവർത്തനം', expectedAscii: '{]hÀ¯\\w' },
  { unicode: 'ഇന്ത്യ', expectedAscii: 'C´y' },
  { unicode: 'ഭാഷ', expectedAscii: '`mj' },
  { unicode: 'നന്ദി', expectedAscii: '\\µn' }
];

console.log('====================================================');
console.log('MADHU ML TT — ENGINE AUTOMATED TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

for (const { unicode, expectedAscii } of testCases) {
  const asciiResult = unicode2mltt(unicode);
  const revertedUnicode = mltt2unicode(asciiResult);

  const forwardMatch = asciiResult === expectedAscii;
  const reverseMatch = revertedUnicode === unicode;

  if (forwardMatch && reverseMatch) {
    passed++;
    console.log(`[PASS] ${unicode} -> ${asciiResult} -> ${revertedUnicode}`);
  } else {
    failed++;
    console.error(`[FAIL] Input: ${unicode}`);
    console.error(`       Expected ASCII: ${expectedAscii} | Got: ${asciiResult}`);
    console.error(`       Reverted: ${revertedUnicode}`);
  }
}

console.log('----------------------------------------------------');
console.log(`Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
