import { createConverter } from '../../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — CORE SDK IMMUTABILITY TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

const originalMapping = {
  name: 'TestMap',
  mapping: {
    'ക': 'I',
    'മ': 'a'
  }
};

const converter = createConverter({ mapping: originalMapping });

// Attempt to mutate original object
try {
  originalMapping.mapping['ക'] = 'MODIFIED';
} catch (e) {
  // Ignored in non-strict mode
}

// Converter should use its frozen internal copy
const mltt = converter.toMLTT('ക');

if (mltt === 'I') {
  passed++;
  console.log('[PASS] MLTTConverter mapping remains immutable despite external mutation attempts.');
} else {
  failed++;
  console.error(`[FAIL] MLTTConverter mapping was corrupted by external mutation. Got: ${mltt}`);
}

// Attempt to mutate converter.mapping directly
try {
  converter.mapping['ക'] = 'HACKED';
} catch (e) {
  // Expected TypeError in strict mode when mutating frozen object
}

const mlttAgain = converter.toMLTT('ക');
if (mlttAgain === 'I') {
  passed++;
  console.log('[PASS] converter.mapping is frozen (Object.freeze) and immune to direct property mutation.');
} else {
  failed++;
  console.error(`[FAIL] converter.mapping was directly mutated.`);
}

console.log('----------------------------------------------------');
console.log(`Immutability Test Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
