import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createConverter } from '@madhu-mltt/core';
import { transformSource } from '../packages/vite/src/transform.js';
import { __madhuConvert } from '../packages/react/src/runtime.js';

console.log('====================================================');
console.log('MADHU ML TT — ZERO-SYNTAX END-TO-END INTEGRATION TEST');
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

const converter = createConverter();

// 1. AST Code Transformation Verification
runTest('Vite AST transformer pre-converts static text and wraps dynamic expressions', () => {
  const developerCode = `
    function ProductPage() {
      const dynamicTitle = "കേരളത്തിന്റെ സ്വന്തം Coconut Oil";
      const items = ["തേങ്ങ", "വെളിച്ചെണ്ണ"];

      return (
        <div className="product-page">
          <h1>കേരളത്തിന്റെ സ്വന്തം Coconut</h1>
          <p>{dynamicTitle}</p>
          <ul>
            {items.map(item => <li key={item}>{item}</li>)}
          </ul>
          <button title="അയക്കുക">കൂടുതൽ അറിയുക</button>
        </div>
      );
    }
  `;

  const transformed = transformSource(developerCode, 'ProductPage.jsx', { converter });
  assert.ok(transformed);
  assert.ok(transformed.code.includes('import { __madhuConvert } from "@madhu-mltt/react/runtime";'));
  assert.ok(transformed.code.includes('tIcf¯nsâ kz´w Coconut')); // Static text converted
  assert.ok(transformed.code.includes('{__madhuConvert(dynamicTitle)}')); // Dynamic var wrapped
  assert.ok(transformed.code.includes('{__madhuConvert(item)}')); // Array map item wrapped
  assert.ok(transformed.code.includes('title="അയക്കുക"')); // Attribute preserved
  assert.ok(!transformed.code.includes('aria-hidden')); // Zero dual-span markup
});

// 2. Runtime SSR HTML Render Verification
runTest('React runtime renders zero-syntax components to clean HTML without extra spans', () => {
  const dynamicTitle = "കേരളത്തിന്റെ സ്വന്തം Coconut Oil";
  const items = ["തേങ്ങ", "വെളിച്ചെണ്ണ"];

  function ProductPage() {
    return React.createElement(
      'div',
      { className: 'product-page' },
      React.createElement('h1', null, converter.toMLTT('കേരളത്തിന്റെ സ്വന്തം Coconut')),
      React.createElement('p', null, __madhuConvert(dynamicTitle)),
      React.createElement(
        'ul',
        null,
        items.map(item => React.createElement('li', { key: item }, __madhuConvert(item)))
      ),
      React.createElement('button', { title: 'അയക്കുക' }, converter.toMLTT('കൂടുതൽ അറിയുക'))
    );
  }

  const html = ReactDOMServer.renderToString(React.createElement(ProductPage));

  // console.log('Rendered html:', html);
  assert.ok(html.includes('tIcf¯nsâ kz´w Coconut')); // Static text
  assert.ok(html.includes('tIcf¯nsâ kz´w Coconut Oil')); // Dynamic variable
  assert.ok(html.includes('tX§')); // Mapped array item 1 (തേങ്ങ -> tX§)
  assert.ok(html.includes(converter.toMLTT('വെളിച്ചെണ്ണ'))); // Mapped array item 2
  assert.ok(html.includes('IqSpXÂ AdnbpI')); // Button text
  assert.ok(html.includes('title="അയക്കുക"')); // Attribute preserved
  assert.ok(!html.includes('<span')); // Zero extra span wrappers in DOM!
});

console.log('----------------------------------------------------');
console.log(`Zero-Syntax Integration Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
