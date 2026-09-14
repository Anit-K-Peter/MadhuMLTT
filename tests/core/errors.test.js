import { createConverter, validateMapping } from '../../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — CORE SDK ERROR HANDLING TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

const invalidMappings = [
  null,
  undefined,
  123,
  'string',
  {},
  { mapping: null },
  { mapping: {} }
];

for (const badMap of invalidMappings) {
  const check = validateMapping(badMap);
  if (!check.valid && check.errors.length > 0) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL] validateMapping failed to flag invalid mapping:`, badMap);
  }

  try {
    createConverter({ mapping: badMap });
    failed++;
    console.error(`[FAIL] createConverter failed to throw on invalid mapping:`, badMap);
  } catch (err) {
    passed++;
    console.log(`[PASS] Deterministic error thrown: "${err.message}"`);
  }
}

console.log('----------------------------------------------------');
console.log(`Error Handling Test Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
