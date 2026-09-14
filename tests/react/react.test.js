import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createConverter } from '../../src/factory.js';
import { MLTTProvider, MLText, useMLTT } from '../../packages/react/src/index.js';

/**
 * MADHU ML TT — REACT INTEGRATION TEST SUITE
 */
export function runReactTests() {
  console.log('====================================================');
  console.log('MADHU ML TT — REACT INTEGRATION TEST SUITE');
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

  // 1. MLTTProvider & Context Initialization
  test('MLTTProvider initializes context and exposes converter via useMLTT', () => {
    let hookResult = null;

    function TestConsumer() {
      hookResult = useMLTT();
      return React.createElement('div', null, hookResult.toMLTT('കേരളം'));
    }

    const html = renderToString(
      React.createElement(
        MLTTProvider,
        { font: 'CustomKarthika' },
        React.createElement(TestConsumer)
      )
    );

    assert.strictEqual(hookResult.fontFamily, 'CustomKarthika');
    assert.strictEqual(hookResult.toMLTT('കേരളം'), 'tIcfw');
    assert(html.includes('tIcfw'));
  });

  // 2. Standalone useMLTT Hook (Outside Provider)
  test('useMLTT falls back cleanly when used outside MLTTProvider', () => {
    let hookResult = null;

    function StandaloneConsumer() {
      hookResult = useMLTT();
      return React.createElement('span', null, hookResult.toMLTT('കേരളം'));
    }

    const html = renderToString(React.createElement(StandaloneConsumer));
    assert.strictEqual(hookResult.fontFamily, 'ML-TTKarthika');
    assert.strictEqual(hookResult.toMLTT('കേരളം'), 'tIcfw');
    assert(html.includes('tIcfw'));
  });

  // 3. Basic MLText Component Rendering (Accessible Dual-Span)
  test('MLText renders converted ML-TT visual text and accessible Unicode Malayalam span', () => {
    const html = renderToString(
      React.createElement(MLText, null, 'കേരളം')
    );

    // Should contain aria-hidden ML-TT text "tIcfw"
    assert(html.includes('aria-hidden="true"'));
    assert(html.includes('tIcfw'));
    // Should contain sr-only accessible raw text "കേരളം"
    assert(html.includes('കേരളം'));
    assert(html.includes('position:absolute'));
  });

  // 4. Polymorphic Element Support (as="h1", as="p", as="div")
  test('MLText correctly renders polymorphic container elements (as="h1", as="p")', () => {
    const htmlH1 = renderToString(
      React.createElement(MLText, { as: 'h1', className: 'title' }, 'കേരളം')
    );
    assert(htmlH1.startsWith('<h1 class="title">'));
    assert(htmlH1.endsWith('</h1>'));

    const htmlP = renderToString(
      React.createElement(MLText, { as: 'p', id: 'desc' }, 'കേരളം')
    );
    assert(htmlP.startsWith('<p id="desc">'));
    assert(htmlP.endsWith('</p>'));
  });

  // 5. Accessible = False Single-Span Mode
  test('MLText supports accessible=false for direct single-element styling', () => {
    const html = renderToString(
      React.createElement(MLText, { accessible: false, fontFamily: 'ML-TTKarthika' }, 'കേരളം')
    );

    assert(!html.includes('aria-hidden'));
    assert(html.includes('font-family:ML-TTKarthika'));
    assert(html.includes('tIcfw'));
  });

  // 6. Props & Attributes Preservation
  test('MLText passes through custom HTML attributes, styles, and handlers', () => {
    const html = renderToString(
      React.createElement(
        MLText,
        {
          as: 'button',
          className: 'btn-primary',
          'data-testid': 'ml-btn',
          aria_label: 'Malayalam Button',
          style: { color: 'blue' }
        },
        'കേരളം'
      )
    );

    assert(html.includes('class="btn-primary"'));
    assert(html.includes('data-testid="ml-btn"'));
    assert(html.includes('color:blue'));
  });

  // 7. Mixed Content & Nested HTML Elements
  test('MLText preserves nested HTML elements while converting text nodes', () => {
    const defaultConv = createConverter();
    const convertedSubText = defaultConv.toMLTT('പ്രധാനപ്പെട്ടത്');

    const html = renderToString(
      React.createElement(
        MLText,
        { as: 'div' },
        'കേരളം ',
        React.createElement('strong', null, 'പ്രധാനപ്പെട്ടത്')
      )
    );

    assert(html.includes('tIcfw')); // "കേരളം" converted
    assert(html.includes('<strong>')); // <strong> tag preserved
    assert(html.includes(convertedSubText)); // Converted text inside <strong>
  });

  // 8. Custom Mapping Override per Component
  test('MLText supports per-component mapping prop override', () => {
    const customMap = {
      name: 'Custom',
      mapping: {
        "അ": "A",
        "ക": "K"
      }
    };

    const html = renderToString(
      React.createElement(MLText, { mapping: customMap }, 'അക')
    );

    assert(html.includes('AK'));
  });

  // 9. SSR Safety Verification
  test('React SDK components execute cleanly during Server-Side Rendering (SSR)', () => {
    assert.doesNotThrow(() => {
      renderToString(
        React.createElement(
          MLTTProvider,
          { font: { family: 'ML-TTKarthika', src: '/fonts/ML_TT_Karthika_Normal.ttf' } },
          React.createElement(MLText, { as: 'h2' }, 'കേരളം എന്റെ നാടാണ്')
        )
      );
    });
  });

  console.log('----------------------------------------------------');
  console.log(`React SDK Test Results: ${passed} passed, ${failed} failed.`);
  console.log('====================================================\n');

  if (failed > 0) {
    throw new Error(`React SDK test suite failed with ${failed} failure(s).`);
  }
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('react.test.js')) {
  runReactTests();
}
