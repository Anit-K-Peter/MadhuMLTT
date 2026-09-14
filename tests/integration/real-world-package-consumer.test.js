import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createConverter, defaultMapping } from '@madhu-mltt/core';
import { MLTTProvider, MLText, useMLTT } from '@madhu-mltt/react';
import { madhuMLTTVite } from '@madhu-mltt/vite';
import { transformSource } from '../../packages/vite/src/transform.js';

/**
 * MADHU ML TT — PHASE 3 WORK 2 REAL-WORLD PACKAGE CONSUMER VERIFICATION SUITE
 */
export function runRealWorldPackageConsumerTests() {
  console.log('====================================================');
  console.log('MADHU ML TT — PHASE 3 WORK 2 PACKAGE CONSUMER SUITE');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function test(description, fn) {
    try {
      fn();
      console.log(`[PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${description}`);
      console.error(err);
      failed++;
    }
  }

  // 1. Pure Package Imports & Default Mapping Resolution
  test('Pure package imports resolve createConverter and defaultMapping from @madhu-mltt/core', () => {
    assert(defaultMapping !== null && typeof defaultMapping === 'object');
    assert.strictEqual(defaultMapping.name, 'ML-TTKarthika');

    const converter = createConverter(); // No mapping passed; uses default core mapping
    assert.strictEqual(converter.toMLTT('കേരളം'), 'tIcfw');
  });

  // 2. React MLTTProvider Default Mapping Fallback
  test('MLTTProvider uses core default mapping when no mapping prop is passed', () => {
    let hookResult = null;

    function Consumer() {
      hookResult = useMLTT();
      return React.createElement(MLText, null, 'കേരളം');
    }

    const html = renderToString(
      React.createElement(
        MLTTProvider,
        { font: { family: 'ML-TTKarthika', src: '/fonts/ML_TT_Karthika_Normal.ttf' } },
        React.createElement(Consumer)
      )
    );

    assert.strictEqual(hookResult.fontFamily, 'ML-TTKarthika');
    assert(html.includes('tIcfw'));
    assert(html.includes('കേരളം'));
  });

  // 3. Vite Plugin Build-Time Transformation with Default Mapping
  test('madhuMLTTVite plugin pre-converts static JSX text using default core mapping', () => {
    const converter = createConverter();
    const inputCode = `
      export function Hero() {
        return <h1>കേരളം എന്റെ നാടാണ്</h1>;
      }
    `;

    const result = transformSource(inputCode, 'Hero.jsx', {
      converter,
      fontFamily: 'ML-TTKarthika',
      accessible: true
    });

    assert(result !== null);
    assert(result.code.includes('tIcfw Fsâ')); // Transformed ML-TT visual string
    assert(result.code.includes('കേരളം എന്റെ നാടാണ്')); // Raw Unicode for copy/paste & screen reader
  });

  // 4. Accessibility, Copy/Paste & Search Engine Verification
  test('Dual-span markup exposes standard Unicode Malayalam for copy/paste and search indexing', () => {
    const html = renderToString(
      React.createElement(MLText, { as: 'h1' }, 'കേരളം എന്റെ നാടാണ്')
    );

    // Visual span (hidden from screen readers)
    assert(html.includes('aria-hidden="true"'));
    assert(html.includes('tIcfw Fsâ \\mSmWv'));

    // Accessible sr-only span (readable by VoiceOver/NVDA, selectable for copy/paste)
    assert(html.includes('കേരളം എന്റെ നാടാണ്'));
    assert(html.includes('position:absolute'));
    assert(html.includes('clip:rect(0, 0, 0, 0)'));
  });

  // 5. Coexistence of Vite Build-Time + React Runtime (No Double Conversion)
  test('Vite build-time transform and React runtime MLText coexist without double conversion', () => {
    const converter = createConverter();
    const converted = converter.toMLTT('കേരളം');

    const html = renderToString(
      React.createElement(
        MLTTProvider,
        null,
        React.createElement(MLText, null, converted)
      )
    );

    assert(html.includes(converted));
    assert(!html.includes('double-converted-gibberish'));
  });

  // 6. Mapping Error Handling Resilience
  test('Deterministic error thrown when passing invalid mapping object', () => {
    assert.throws(() => {
      createConverter({ mapping: null });
    }, /Invalid mapping provided/);
  });

  console.log('----------------------------------------------------');
  console.log(`Package Consumer Test Results: ${passed} passed, ${failed} failed.`);
  console.log('====================================================\n');

  if (failed > 0) {
    throw new Error(`Package Consumer test suite failed with ${failed} failure(s).`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('real-world-package-consumer.test.js')) {
  runRealWorldPackageConsumerTests();
}
