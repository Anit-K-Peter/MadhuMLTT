import assert from 'node:assert/strict';
import React from 'react';
import { __madhuConvert } from '../packages/react/src/runtime.js';

console.log('====================================================');
console.log('MADHU ML TT — ZERO-SYNTAX REACT RUNTIME HELPER TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(err);
    failed++;
  }
}

// 1. Primitive null/undefined/boolean/number pass-through
runTest('Null, undefined, boolean, and numbers pass through untouched', () => {
  assert.strictEqual(__madhuConvert(null), null);
  assert.strictEqual(__madhuConvert(undefined), undefined);
  assert.strictEqual(__madhuConvert(true), true);
  assert.strictEqual(__madhuConvert(false), false);
  assert.strictEqual(__madhuConvert(42), 42);
  assert.strictEqual(__madhuConvert(0), 0);
});

// 2. Non-Malayalam strings pass-through
runTest('English, numbers, and ASCII strings pass through untouched', () => {
  assert.strictEqual(__madhuConvert('Hello World'), 'Hello World');
  assert.strictEqual(__madhuConvert('12345'), '12345');
  assert.strictEqual(__madhuConvert('https://example.com'), 'https://example.com');
});

// 3. Malayalam string conversion
runTest('Malayalam Unicode string converts to ML-TT ASCII', () => {
  const result = __madhuConvert('കേരളം');
  assert.strictEqual(result, 'tIcfw');
});

// 4. Mixed Malayalam + English preservation
runTest('Mixed Malayalam + English string converts Malayalam while preserving English', () => {
  const result = __madhuConvert('കേരളത്തിന്റെ സ്വന്തം Coconut');
  assert.strictEqual(result, 'tIcf¯nsâ kz´w Coconut');
});

// 5. React Element pass-through
runTest('Valid React element passes through untouched', () => {
  const element = React.createElement('span', { key: 'test' }, 'Hello');
  const result = __madhuConvert(element);
  assert.strictEqual(result, element);
});

// 6. Array processing with Malayalam
runTest('Array containing Malayalam strings processes elements', () => {
  const input = ['കേരളം', 'English', 123];
  const result = __madhuConvert(input);
  assert.strictEqual(result[0], 'tIcfw');
  assert.strictEqual(result[1], 'English');
  assert.strictEqual(result[2], 123);
});

// 7. Array without Malayalam (Zero allocation reference check)
runTest('Array without Malayalam returns same array reference', () => {
  const input = ['Hello', 'World', 123];
  const result = __madhuConvert(input);
  assert.strictEqual(result, input);
});

console.log('----------------------------------------------------');
console.log(`React Runtime Helper Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
