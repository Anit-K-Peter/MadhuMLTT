import assert from 'node:assert';
import { madhuMLTTVite } from '../../packages/vite/src/index.js';
import { transformSource } from '../../packages/vite/src/transform.js';
import { createConverter } from '../../src/factory.js';

/**
 * MADHU ML TT — VITE PLUGIN INTEGRATION TEST SUITE
 */
export function runViteTests() {
  console.log('====================================================');
  console.log('MADHU ML TT — VITE PLUGIN INTEGRATION TEST SUITE');
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

  // 1. Plugin Creation & Initialization
  test('madhuMLTTVite creates a valid Vite plugin object', () => {
    const plugin = madhuMLTTVite({ fontFamily: 'ML-TTKarthika' });
    assert.strictEqual(plugin.name, 'vite-plugin-madhu-mltt');
    assert.strictEqual(plugin.enforce, 'pre');
    assert.strictEqual(typeof plugin.transform, 'function');
  });

  // 2. Static JSX Text Node Build-Time Transformation (Accessible Dual-Span)
  test('Transforms static JSX text nodes into dual-span accessible JSX fragments', () => {
    const inputCode = `
      export function App() {
        return (
          <h1 className="title">കേരളം</h1>
        );
      }
    `;

    const result = transformSource(inputCode, 'App.jsx', {
      converter,
      fontFamily: 'ML-TTKarthika',
      accessible: true
    });

    assert(result !== null);
    assert(result.code.includes('tIcfw')); // Visual ML-TT text
    assert(result.code.includes('കേരളം')); // Accessible raw text
    assert(result.code.includes('aria-hidden'));
    assert(result.code.includes('fontFamily: "ML-TTKarthika"'));
    assert(result.map !== null && typeof result.map === 'object');
  });

  // 3. Dynamic Expression Safety ({title})
  test('Ignores dynamic JSX expressions ({title}) to prevent build-time corruption', () => {
    const inputCode = `
      export function DynamicHeader({ title }) {
        return <h1>{title}</h1>;
      }
    `;

    const plugin = madhuMLTTVite();
    const result = plugin.transform(inputCode, 'DynamicHeader.jsx');

    assert.strictEqual(result, null); // Skipped because no static Malayalam string literals exist
  });

  // 4. Ignored Attributes (data-mltt-ignore)
  test('Honors data-mltt-ignore attribute to bypass transformation', () => {
    const inputCode = `
      export function RawMalayalam() {
        return <div data-mltt-ignore>കേരളം</div>;
      }
    `;

    const result = transformSource(inputCode, 'RawMalayalam.jsx', {
      converter,
      fontFamily: 'ML-TTKarthika',
      accessible: true
    });

    // Should return null (not transformed due to data-mltt-ignore)
    assert.strictEqual(result, null);
  });

  // 5. Non-Malayalam Code Pass-Through
  test('Fast pass-through for non-Malayalam source files', () => {
    const inputCode = `
      export function Counter() {
        const [count, setCount] = useState(0);
        return <button onClick={() => setCount(count + 1)}>Click: {count}</button>;
      }
    `;

    const plugin = madhuMLTTVite();
    const result = plugin.transform(inputCode, 'Counter.jsx');

    assert.strictEqual(result, null);
  });

  // 6. Exclude node_modules
  test('Excludes node_modules files from transformation', () => {
    const inputCode = `<h1>കേരളം</h1>`;
    const plugin = madhuMLTTVite();
    const result = plugin.transform(inputCode, 'node_modules/some-lib/index.jsx');

    assert.strictEqual(result, null);
  });

  // 7. Non-Accessible Mode (Direct Text Substitution)
  test('Supports accessible=false for direct text replacement mode', () => {
    const inputCode = `
      export function Simple() {
        return <p>കേരളം</p>;
      }
    `;

    const result = transformSource(inputCode, 'Simple.jsx', {
      converter,
      fontFamily: 'ML-TTKarthika',
      accessible: false
    });

    assert(result !== null);
    assert(result.code.includes('tIcfw'));
    assert(!result.code.includes('aria-hidden'));
  });

  console.log('----------------------------------------------------');
  console.log(`Vite Plugin Test Results: ${passed} passed, ${failed} failed.`);
  console.log('====================================================\n');

  if (failed > 0) {
    throw new Error(`Vite plugin test suite failed with ${failed} failure(s).`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('vite.test.js')) {
  runViteTests();
}
