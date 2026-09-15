import { createConverter, MLTTConverter, validateMapping, karthikaMapping } from '../../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — CORE SDK FACTORY & CLASS TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

// Test 1: Factory instance creation
const converter = createConverter();
if (converter instanceof MLTTConverter) {
  passed++;
  console.log('[PASS] createConverter() returned valid MLTTConverter instance.');
} else {
  failed++;
  console.error('[FAIL] createConverter() did not return MLTTConverter instance.');
}

// Test 2: Forward conversion via converter instance
const mlttRes = converter.toMLTT('കേരളം');
if (mlttRes === 'tIcfw') {
  passed++;
  console.log('[PASS] converter.toMLTT("കേരളം") -> "tIcfw"');
} else {
  failed++;
  console.error(`[FAIL] converter.toMLTT("കേരളം") -> Got: ${mlttRes}`);
}

// Test 3: Reverse conversion via converter instance
const unicodeRes = converter.toUnicode('tIcfw');
if (unicodeRes === 'കേരളം') {
  passed++;
  console.log('[PASS] converter.toUnicode("tIcfw") -> "കേരളം"');
} else {
  failed++;
  console.error(`[FAIL] converter.toUnicode("tIcfw") -> Got: ${unicodeRes}`);
}

// Test 4: Smart convert method auto-detection
const autoForward = converter.convert('കേരളം');
const autoReverse = converter.convert('tIcfw');
if (autoForward === 'tIcfw' && autoReverse === 'കേരളം') {
  passed++;
  console.log('[PASS] converter.convert() smart direction auto-detection.');
} else {
  failed++;
  console.error(`[FAIL] converter.convert() auto-detection failed. Got: fwd=${autoForward}, rev=${autoReverse}`);
}

// Test 5: Mapping Validation Utility
const validCheck = validateMapping(karthikaMapping);
const invalidCheck = validateMapping({ invalidKey: 123 });
if (validCheck.valid && !invalidCheck.valid) {
  passed++;
  console.log('[PASS] validateMapping() accurately validates mapping schemas.');
} else {
  failed++;
  console.error(`[FAIL] validateMapping() failed. validCheck=${validCheck.valid}, invalidCheck=${invalidCheck.valid}`);
}

// Test 6: Cache hit verification
const t0 = performance.now();
converter.toMLTT('കേരളം ഇന്ത്യയുടെ തെക്കുപടിഞ്ഞാറൻ തീരത്തുള്ള ഒരു സംസ്ഥാനമാണ്.');
const t1 = performance.now();
converter.toMLTT('കേരളം ഇന്ത്യയുടെ തെക്കുപടിഞ്ഞാറൻ തീരത്തുള്ള ഒരു സംസ്ഥാനമാണ്.'); // Should hit LRU cache
const t2 = performance.now();

const initialMs = t1 - t0;
const cachedMs = t2 - t1;

if (cachedMs <= initialMs) {
  passed++;
  console.log(`[PASS] LRU Cache accelerated repeat conversion (Initial: ${initialMs.toFixed(3)} ms -> Cached: ${cachedMs.toFixed(3)} ms)`);
} else {
  failed++;
  console.error(`[FAIL] LRU Cache failed to accelerate repeat conversion.`);
}

// Test 7: Programmatic Mapping Registry
import { supportedMappings, getMapping } from '../../src/index.js';
const karthikaResolved = getMapping('Karthika');
const revathiResolved = getMapping('Revathi');
if (karthikaResolved && revathiResolved && Object.keys(supportedMappings).length >= 4) {
  passed++;
  console.log('[PASS] getMapping() and supportedMappings registry resolve built-in font mappings accurately.');
} else {
  failed++;
  console.error('[FAIL] Mapping registry resolution failed.');
}

console.log('----------------------------------------------------');
console.log(`Core SDK Factory Tests: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
