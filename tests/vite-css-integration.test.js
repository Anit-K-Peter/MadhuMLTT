import assert from 'node:assert/strict';
import { madhuMLTTVite } from '@madhu-mltt/vite';

console.log('====================================================');
console.log('MADHU ML TT — VITE @FONT-MLTT INTEGRATION SUITE');
console.log('====================================================');

let passed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    process.exit(1);
  }
}

// 1. CSS file transformation
test('Vite plugin parses CSS with @font-mltt and outputs @font-face', () => {
  const plugin = madhuMLTTVite();
  const cssCode = `
@font-mltt {
  font-family: "Karthika";
  mapping: "Karthika";
  src: url("./fonts/karthika.ttf");
}
`;

  const result = plugin.transform(cssCode, '/src/styles.css');
  assert.ok(result, 'Plugin should return transformed result for CSS');
  assert.ok(result.code.includes('@font-face'), 'CSS should contain @font-face');
  assert.ok(!result.code.includes('@font-mltt'), 'CSS should not contain @font-mltt');
  assert.ok(!result.code.includes('mapping:'), 'CSS should not contain mapping property');
});

// 2. Single @font-mltt rule in CSS feeds zero-syntax JSX conversion
test('Single @font-mltt rule in CSS sets active mapping for zero-syntax JSX', () => {
  const plugin = madhuMLTTVite();
  const cssCode = `
@font-mltt {
  font-family: "Karthika";
  mapping: "Karthika";
  src: url("./fonts/karthika.ttf");
}
`;

  // 1. Process CSS first
  plugin.transform(cssCode, '/src/styles.css');

  // 2. Process JSX
  const jsxCode = `
export default function App() {
  return (
    <main>
      <h1>കേരളത്തിന്റെ സ്വന്തം Coconut</h1>
      <p>നാടൻ Coconut Oil</p>
    </main>
  );
}
`;

  const jsxResult = plugin.transform(jsxCode, '/src/App.jsx');
  assert.ok(jsxResult, 'JSX should be transformed');
  assert.ok(jsxResult.code.includes('Coconut'), 'English text Coconut must be preserved');
  assert.ok(jsxResult.code.includes('Coconut Oil'), 'English text Coconut Oil must be preserved');
  assert.ok(!jsxResult.code.includes('കേരളത്തിന്റെ'), 'Malayalam Unicode should be converted to ML-TT ASCII');
});

// 3. Multiple @font-mltt rules emit warning without guessing
test('Multiple @font-mltt rules without explicit plugin config emit warning without guessing', () => {
  const plugin = madhuMLTTVite();
  const cssCode = `
@font-mltt {
  font-family: "Karthika";
  mapping: "Karthika";
  src: url("./fonts/karthika.ttf");
}

@font-mltt {
  font-family: "Revathi";
  mapping: "Karthika";
  src: url("./fonts/revathi.ttf");
}
`;

  // 1. Process CSS containing 2 rules
  plugin.transform(cssCode, '/src/styles.css');

  let warningLogged = false;
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && args[0].includes('Multiple @font-mltt rules detected')) {
      warningLogged = true;
    }
  };

  const jsxCode = `
export default function App() {
  return <h1>കേരളത്തിന്റെ സ്വന്തം Coconut</h1>;
}
`;

  try {
    const jsxResult = plugin.transform(jsxCode, '/src/App.jsx');
    assert.ok(jsxResult, 'JSX should still transform safely using default fallback');
    assert.ok(warningLogged, 'Warning should be emitted when multiple rules exist without explicit mapping option');
  } finally {
    console.warn = originalWarn;
  }
});

// 4. Milestone Verification: Complete workflow
test('Milestone End-to-End: CSS @font-mltt + zero-syntax Malayalam JSX', () => {
  const plugin = madhuMLTTVite();

  const cssCode = `
@font-mltt {
  font-family: "Karthika";
  mapping: "Karthika";
  src: url("./fonts/karthika.ttf");
}

h1 {
  font-family: "Karthika", sans-serif;
}
`;

  const cssOutput = plugin.transform(cssCode, '/src/styles.css');
  assert.ok(cssOutput.code.includes('@font-face'));
  assert.ok(cssOutput.code.includes('h1 {'));

  const jsxCode = `
export default function App() {
  return (
    <main>
      <h1>കേരളത്തിന്റെ സ്വന്തം Coconut</h1>
      <p>നാടൻ Coconut Oil</p>
    </main>
  );
}
`;

  const jsxOutput = plugin.transform(jsxCode, '/src/App.jsx');
  assert.ok(!jsxOutput.code.includes('കേരളത്തിന്റെ'), 'Unicode Malayalam transformed');
  assert.ok(!jsxOutput.code.includes('നാടൻ'), 'Unicode Malayalam transformed');
  assert.ok(jsxOutput.code.includes('Coconut'), 'English preserved');
  assert.ok(jsxOutput.code.includes('Coconut Oil'), 'English preserved');
  assert.ok(!jsxOutput.code.includes('@madhu-mltt/css'), 'No CSS runtime injected into client bundle');
});

console.log('----------------------------------------------------');
console.log(`Vite @font-mltt Integration Results: ${passed} passed, 0 failed.`);
console.log('====================================================');
