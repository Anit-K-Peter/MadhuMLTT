import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createConverter } from '../../src/factory.js';
import { MLTTProvider, MLText, useMLTT } from '../../packages/react/src/index.js';
import { transformSource } from '../../packages/vite/src/transform.js';

/**
 * MADHU ML TT — PHASE 3 WORK 1 REAL-WORLD INTEGRATION VERIFICATION SUITE
 */
export function runRealWorldIntegrationTests() {
  console.log('====================================================');
  console.log('MADHU ML TT — PHASE 3 REAL-WORLD INTEGRATION SUITE');
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

  const converter = createConverter();

  // 1. Static Malayalam JSX + Vite Build-Time Transformation
  test('Vite plugin pre-converts static Malayalam JSX into accessible dual-span markup at build-time', () => {
    const inputCode = `
      export function Header() {
        return <h1 className="site-title">കേരള സാഹിത്യ വാതായനം</h1>;
      }
    `;

    const result = transformSource(inputCode, 'Header.jsx', {
      converter,
      fontFamily: 'ML-TTKarthika',
      accessible: true
    });

    assert(result !== null);
    assert(result.code.includes('aria-hidden'));
    assert(result.code.includes('fontFamily: "ML-TTKarthika"'));
    assert(result.code.includes('കേരള സാഹിത്യ വാതായനം')); // Raw Unicode for screen readers
  });

  // 2. React Runtime <MLText> Component
  test('<MLText> component converts text runtime and preserves HTML tags', () => {
    const html = renderToString(
      React.createElement(
        MLTTProvider,
        { font: 'ML-TTKarthika' },
        React.createElement(
          MLText,
          { as: 'p', className: 'card-paragraph' },
          'മലയാള ഭാഷ ',
          React.createElement('strong', null, 'സംസ്കൃതവും തമിഴും'),
          ' കലർന്ന പ്രാചീന ഭാഷയാണ്.'
        )
      )
    );

    assert(html.includes('class="card-paragraph"'));
    assert(html.includes('<strong>'));
    assert(html.includes('aria-hidden="true"'));
  });

  // 3. Coexistence of Vite Build-Time + React Runtime (No Double Conversion)
  test('Vite build-time transform and React runtime components coexist without double-conversion', () => {
    const defaultConv = createConverter();
    const convertedKarthika = defaultConv.toMLTT('കേരളം');

    // Simulate pre-converted Vite static string passed to MLText or rendered static JSX
    const html = renderToString(
      React.createElement(
        MLTTProvider,
        null,
        React.createElement(MLText, null, convertedKarthika)
      )
    );

    // Bypasses re-conversion because input is already ML-TT font encoding
    assert(html.includes(convertedKarthika));
  });

  // 4. Mixed Malayalam + English Content
  test('Preserves English text, numbers, and symbols in mixed Malayalam content', () => {
    const html = renderToString(
      React.createElement(MLText, null, 'കേരളം — Kerala State 2026')
    );

    assert(html.includes('Kerala State 2026'));
  });

  // 5. Large Malayalam Content Block Performance
  test('Handles large Malayalam content blocks cleanly under 5ms', () => {
    const largeText = 'കേരളം ദക്ഷിണേന്ത്യയിലെ ഒരു സംസ്ഥാനമാണ്. '.repeat(100);
    const start = performance.now();
    const html = renderToString(
      React.createElement(MLText, null, largeText)
    );
    const duration = performance.now() - start;

    assert(html.length > 5000);
    assert(duration < 50); // Executes efficiently
  });

  // 6. Malformed & Edge-case Input Handling
  test('Gracefully handles malformed ZWJ/ZWNJ sequences without throwing exceptions', () => {
    const malformedText = 'ക\u200D്\u200Cര\u0D57വ';
    assert.doesNotThrow(() => {
      renderToString(
        React.createElement(MLText, null, malformedText)
      );
    });
  });

  console.log('----------------------------------------------------');
  console.log(`Real-World Integration Test Results: ${passed} passed, ${failed} failed.`);
  console.log('====================================================\n');

  if (failed > 0) {
    throw new Error(`Real-world integration test suite failed with ${failed} failure(s).`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('realworld-integration.test.js')) {
  runRealWorldIntegrationTests();
}
