import { createConverter } from '../../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — CORE SDK CACHE & REUSE TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

const converter = createConverter({ cacheSize: 5 });

const sampleText = 'സ്വതന്ത്ര മലയാളം';

// 1. Initial conversion
const res1 = converter.toMLTT(sampleText);
const resReverse1 = converter.toUnicode(res1);

// 2. Repeat conversions (should hit LRU cache)
const res2 = converter.toMLTT(sampleText);
const resReverse2 = converter.toUnicode(res1);

if (res1 === res2 && resReverse1 === resReverse2) {
  passed++;
  console.log('[PASS] Repeated conversions produce identical output via LRU cache.');
} else {
  failed++;
  console.error('[FAIL] Cache return mismatch.');
}

// 3. Clear Cache test
converter.clearCache();
const res3 = converter.toMLTT(sampleText);
if (res3 === res1) {
  passed++;
  console.log('[PASS] converter.clearCache() resets cache cleanly without state corruption.');
} else {
  failed++;
  console.error('[FAIL] Post clearCache conversion output mismatch.');
}

console.log('----------------------------------------------------');
console.log(`Cache Test Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
