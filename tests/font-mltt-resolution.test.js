import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseFontMLTT } from '@madhu-mltt/css';
import { madhuMLTTVite } from '@madhu-mltt/vite';
import { defaultMapping, revathiMapping } from '@madhu-mltt/core';

console.log('====================================================');
console.log('MADHU ML TT — @FONT-MLTT RESOLUTION & FALLBACK SUITE');
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

// 1. Missing mapping in @font-mltt defaults to Karthika
test('Missing mapping in @font-mltt defaults to Karthika', () => {
  const cssCode = `
@font-mltt {
  font-family: "MyMalayalamFont";
  src: url("./fonts/my-font.ttf");
}
`;

  const { rules } = parseFontMLTT(cssCode);
  assert.equal(rules.length, 1);
  assert.equal(rules[0].isExplicitMapping, false);
  assert.equal(rules[0].mappingValue, 'Karthika');
  assert.equal(rules[0].mapping.name, defaultMapping.name);

  // Vite transformation test
  const plugin = madhuMLTTVite();
  plugin.transform(cssCode, '/src/styles.css');
  const jsxResult = plugin.transform('<h1>കേരളം</h1>', '/src/App.jsx');
  assert.ok(jsxResult.code.includes('tIcfw'), 'Should convert using Karthika default');
});

// 2. Explicit Karthika mapping -> Karthika
test('Explicit Karthika mapping in @font-mltt uses Karthika', () => {
  const cssCode = `
@font-mltt {
  font-family: "KarthikaFont";
  mapping: "Karthika";
  src: url("./fonts/karthika.ttf");
}
`;

  const { rules } = parseFontMLTT(cssCode);
  assert.equal(rules[0].isExplicitMapping, true);
  assert.equal(rules[0].mapping.name, defaultMapping.name);

  const plugin = madhuMLTTVite();
  plugin.transform(cssCode, '/src/styles.css');
  const jsxResult = plugin.transform('<h1>കേരളം</h1>', '/src/App.jsx');
  assert.ok(jsxResult.code.includes('tIcfw'));
});

// 3. Explicit ML-TTRevathi mapping -> Revathi
test('Explicit ML-TTRevathi mapping in @font-mltt uses Revathi', () => {
  const cssCode = `
@font-mltt {
  font-family: "RevathiFont";
  mapping: "ML-TTRevathi";
  src: url("./fonts/revathi.ttf");
}
`;

  const { rules } = parseFontMLTT(cssCode);
  assert.equal(rules[0].isExplicitMapping, true);
  assert.equal(rules[0].mapping.name, revathiMapping.name);

  const plugin = madhuMLTTVite();
  plugin.transform(cssCode, '/src/styles.css');
  const jsxResult = plugin.transform('<h1>കുട്ടികൾ</h1>', '/src/App.jsx');
  assert.ok(jsxResult.code.includes('IpSvSnIƒ'), 'Should convert using Revathi mapping');
});

// 4. Custom JSON mapping path
test('Custom JSON mapping in @font-mltt loads and uses custom schema', () => {
  const tempDir = path.join(process.cwd(), 'scratch', 'resolution-fixture');
  fs.mkdirSync(tempDir, { recursive: true });

  const customJsonPath = path.join(tempDir, 'custom-map.json');
  const cssPath = path.join(tempDir, 'style.css');

  const customSchema = {
    name: 'CustomTest',
    mapping: {
      "ക": "K_CUSTOM"
    }
  };

  fs.writeFileSync(customJsonPath, JSON.stringify(customSchema, null, 2), 'utf-8');

  const cssCode = `
@font-mltt {
  font-family: "CustomFont";
  mapping: url("./custom-map.json");
  src: url("./custom.ttf");
}
`;

  const { rules } = parseFontMLTT(cssCode, { filename: cssPath });
  assert.equal(rules[0].isExplicitMapping, true);
  assert.equal(rules[0].mapping.name, 'CustomTest');

  const plugin = madhuMLTTVite();
  plugin.transform(cssCode, cssPath);
  const jsxResult = plugin.transform('<h1>ക</h1>', path.join(tempDir, 'App.jsx'));
  assert.ok(jsxResult.code.includes('K_CUSTOM'));

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 5. Explicit plugin mapping option overrides @font-mltt
test('Plugin mapping option madhuMLTTVite({ mapping }) overrides @font-mltt mapping', () => {
  const plugin = madhuMLTTVite({ mapping: revathiMapping });

  const cssCode = `
@font-mltt {
  font-family: "SomeFont";
  mapping: "Karthika";
  src: url("./font.ttf");
}
`;

  plugin.transform(cssCode, '/src/styles.css');
  const jsxResult = plugin.transform('<h1>കുട്ടികൾ</h1>', '/src/App.jsx');
  assert.ok(jsxResult.code.includes('IpSvSnIƒ'), 'Plugin mapping option must take precedence over @font-mltt');
});

// 6. Multiple @font-mltt rules trigger warning and fallback
test('Multiple @font-mltt rules emit warning without automatic font guessing', () => {
  const plugin = madhuMLTTVite();

  const cssCode = `
@font-mltt {
  font-family: "FontA";
  mapping: "Karthika";
}
@font-mltt {
  font-family: "FontB";
  mapping: "ML-TTRevathi";
}
`;

  plugin.transform(cssCode, '/src/styles.css');

  let warned = false;
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && args[0].includes('Multiple @font-mltt rules detected')) {
      warned = true;
    }
  };

  try {
    const jsxResult = plugin.transform('<h1>കേരളം</h1>', '/src/App.jsx');
    assert.ok(jsxResult, 'Should return fallback transformed result');
    assert.ok(warned, 'Should warn when multiple rules exist without explicit plugin config');
  } finally {
    console.warn = originalWarn;
  }
});

// 7. Existing projects without @font-mltt continue working seamlessly
test('Projects without @font-mltt work with default Karthika zero-syntax', () => {
  const plugin = madhuMLTTVite();
  const jsxResult = plugin.transform('<h1>കേരളം</h1>', '/src/App.jsx');
  assert.ok(jsxResult.code.includes('tIcfw'));
});

console.log('----------------------------------------------------');
console.log(`Resolution & Fallback Test Results: ${passed} passed, 0 failed.`);
console.log('====================================================');
