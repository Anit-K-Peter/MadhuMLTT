import assert from 'node:assert/strict';
import { createConverter } from '@madhu-mltt/core';
import { transformSource } from '../packages/vite/src/transform.js';

console.log('====================================================');
console.log('MADHU ML TT — ZERO-SYNTAX VITE AST TRANSFORM SUITE');
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

// 1. Static JSX Text conversion without dual spans
runTest('Static JSX text converts directly without generating extra span elements', () => {
  const source = `
    function App() {
      return <h1>കേരളത്തിന്റെ സ്വന്തം Coconut</h1>;
    }
  `;
  const result = transformSource(source, 'App.jsx', { converter });
  assert.ok(result);
  assert.ok(result.code.includes('<h1>tIcf¯nsâ kz´w Coconut</h1>'));
  assert.ok(!result.code.includes('aria-hidden'));
  assert.ok(!result.code.includes('<span'));
});

// 2. Dynamic expression wrapping
runTest('Dynamic JSX expression gets wrapped with __madhuConvert and runtime import', () => {
  const source = `
    function App({ title }) {
      return <p>{title}</p>;
    }
  `;
  const result = transformSource(source, 'App.jsx', { converter });
  assert.ok(result);
  assert.ok(result.code.includes('import { __madhuConvert } from "@madhu-mltt/react/runtime";'));
  assert.ok(result.code.includes('<p>{__madhuConvert(title)}</p>'));
});

// 3. JSX Attribute protection
runTest('JSX attributes (alt, title, placeholder, key, className) are NOT transformed', () => {
  const source = `
    function App() {
      return <img alt="കേരളം" title="തിരയുക" className="kerala-btn" key="കേരളം" />;
    }
  `;
  const result = transformSource(source, 'App.jsx', { converter });
  // Since attributes are ignored and there are no children, transformSource returns null
  assert.strictEqual(result, null);
});

// 4. Non-JSX JavaScript string protection
runTest('Non-JSX JS strings, API URLs, and logic are NOT transformed', () => {
  const source = `
    const API_URL = "https://api.kerala.gov.in/കേരളം";
    console.log("കേരളം");
    function getData() {
      return "കേരളം";
    }
  `;
  const result = transformSource(source, 'test.js', { converter });
  assert.strictEqual(result, null);
});

// 5. Opt-out via data-mltt-ignore
runTest('data-mltt-ignore attribute bypasses transformation', () => {
  const source = `
    function App() {
      return <p data-mltt-ignore>കേരളം</p>;
    }
  `;
  const result = transformSource(source, 'App.jsx', { converter });
  assert.strictEqual(result, null);
});

// 6. Third-party component handling
runTest('Third-party component children are transformed, but props are ignored', () => {
  const source = `
    function App() {
      return <Card title="കേരളം">കേരളത്തിന്റെ സ്വന്തം</Card>;
    }
  `;
  const result = transformSource(source, 'App.jsx', { converter });
  assert.ok(result);
  assert.ok(result.code.includes('title="കേരളം"'));
  assert.ok(result.code.includes('tIcf¯nsâ kz´w'));
});

console.log('----------------------------------------------------');
console.log(`Vite Zero-Syntax AST Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
