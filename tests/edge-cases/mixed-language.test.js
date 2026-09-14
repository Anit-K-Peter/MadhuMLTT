/**
 * Madhu ML TT — Mixed Language & Script Preservation Test Suite
 */

import assert from 'assert';
import { unicodeToMLTT, mlttToUnicode, createConverter } from '../../src/index.js';

const converter = createConverter();

console.log('====================================================');
console.log('MADHU ML TT — MIXED-LANGUAGE PRESERVATION TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

// 1. Malayalam + English
runTest('Malayalam + English preserving exact English string', () => {
  const input = 'മലയാളം English വാക്കുകൾ';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt.includes('English'), true, 'English word must be byte-for-byte preserved');
  const restored = converter.toUnicode(mltt);
  assert.strictEqual(restored, input, 'Round-trip must restore original string');
});

// 2. English + Malayalam
runTest('English + Malayalam preserving leading English string', () => {
  const input = 'Visit Google for more വിവരങ്ങൾ';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt.startsWith('Visit Google for more '), true, 'Leading English phrase must be byte-for-byte preserved');
  const restored = converter.toUnicode(mltt);
  assert.strictEqual(restored, input, 'Round-trip must restore original string');
});

// 3. Malayalam + English + Malayalam
runTest('Malayalam + English + Malayalam sandwich structure', () => {
  const input = 'മലയാളം JavaScript സാങ്കേതികവിദ്യ';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt.includes('JavaScript'), true, 'Embedded JavaScript identifier must be byte-for-byte preserved');
  const restored = converter.toUnicode(mltt);
  assert.strictEqual(restored, input, 'Round-trip must restore original string');
});

// 4. Malayalam containing React, JavaScript, HTML, CSS
runTest('Malayalam containing React, JavaScript, HTML, CSS tech terms', () => {
  const input1 = 'ഇത് ഒരു React component ആണ്';
  const mltt1 = converter.toMLTT(input1);
  assert.strictEqual(mltt1.includes('React component'), true);
  assert.strictEqual(converter.toUnicode(mltt1), input1);

  const input2 = 'മലയാളം JavaScript CSS HTML';
  const mltt2 = converter.toMLTT(input2);
  assert.strictEqual(mltt2.includes('JavaScript CSS HTML'), true);
  assert.strictEqual(converter.toUnicode(mltt2), input2);
});

// 5. Malayalam containing numbers & version strings
runTest('Malayalam containing numbers and version strings', () => {
  const input1 = 'Version 1.0.0';
  const mltt1 = converter.toMLTT(input1);
  assert.strictEqual(mltt1, 'Version 1.0.0');
  assert.strictEqual(converter.toUnicode(mltt1), input1);

  const input2 = 'കേരളം 2026';
  const mltt2 = converter.toMLTT(input2);
  assert.strictEqual(mltt2.includes('2026'), true);
  assert.strictEqual(converter.toUnicode(mltt2), input2);
});

// 6. Malayalam containing URLs & Emails
runTest('Malayalam containing URLs and Email addresses', () => {
  const urlInput = 'Visit https://example.com/path?query=1#hash വിവരങ്ങൾ';
  const urlMltt = converter.toMLTT(urlInput);
  assert.strictEqual(urlMltt.includes('https://example.com/path?query=1#hash'), true);
  assert.strictEqual(converter.toUnicode(urlMltt), urlInput);

  const emailInput = 'Contact user@domain.com വിവരങ്ങൾ';
  const emailMltt = converter.toMLTT(emailInput);
  assert.strictEqual(emailMltt.includes('user@domain.com'), true);
  assert.strictEqual(converter.toUnicode(emailMltt), emailInput);
});

// 7. Malayalam containing punctuation & symbols
runTest('Malayalam containing punctuation and ASCII symbols', () => {
  const input = 'കേരളം — Kerala 2026! (ഹലോ)';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt.includes('Kerala 2026!'), true);
  assert.strictEqual(converter.toUnicode(mltt), input);
});

// 8. Adjacent Malayalam and Latin characters without spaces
runTest('Adjacent Malayalam and Latin characters without spaces', () => {
  const input = 'മലയാളംReactവാക്ക്';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt.includes('React'), true, 'Adjacent React identifier must remain byte-for-byte unchanged');
  const restored = converter.toUnicode(mltt);
  assert.strictEqual(restored, input, 'Round-trip must preserve adjacent mixed content');
});

// 9. Multiple consecutive English words
runTest('Multiple consecutive English words', () => {
  const input = 'Learn React and Vite today';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt, 'Learn React and Vite today', 'All-English sentence must remain byte-for-byte identical');
  assert.strictEqual(converter.toUnicode(mltt), input);
});

// 10. English-only input
runTest('English-only input preservation', () => {
  const input = 'Hello World 2026';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt, input);
  assert.strictEqual(converter.toUnicode(mltt), input);
});

// 11. Malayalam-only input
runTest('Malayalam-only input conversion', () => {
  const input = 'കേരളം എന്റെ നാടാണ്';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt !== input, true, 'Malayalam text must be converted to ML-TT ASCII');
  assert.strictEqual(converter.toUnicode(mltt), input, 'Reverse conversion must restore original Unicode Malayalam');
});

// 12. Mixed Malayalam + ASCII symbols
runTest('Mixed Malayalam + ASCII symbols', () => {
  const input = 'Hello #Malayalam @World!';
  const mltt = converter.toMLTT(input);
  assert.strictEqual(mltt.startsWith('Hello #'), true);
  assert.strictEqual(mltt.endsWith(' @World!'), true);
  assert.strictEqual(converter.toUnicode(mltt), input);
});

console.log('----------------------------------------------------');
console.log(`Mixed Language Test Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
