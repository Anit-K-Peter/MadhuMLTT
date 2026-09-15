import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseFontMLTT, unquote, extractUrlValue } from '@madhu-mltt/css';

console.log('====================================================');
console.log('MADHU ML TT — @MADHU-MLTT/CSS TEST SUITE');
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

// 1. Unquote & extractUrlValue helpers
test('unquote and extractUrlValue string utilities', () => {
  assert.equal(unquote('"Karthika"'), 'Karthika');
  assert.equal(unquote("'Revathi'"), 'Revathi');
  assert.equal(unquote('  Normal  '), 'Normal');

  assert.equal(extractUrlValue('url("./fonts/karthika.ttf")'), './fonts/karthika.ttf');
  assert.equal(extractUrlValue("url('./fonts/karthika.ttf')"), './fonts/karthika.ttf');
  assert.equal(extractUrlValue('url(./fonts/karthika.ttf)'), './fonts/karthika.ttf');
});

// 2. Parse @font-mltt rule with built-in Karthika mapping
test('transforms @font-mltt into @font-face with built-in Karthika mapping', () => {
  const inputCss = `
@font-mltt {
  font-family: "Karthika";
  mapping: "Karthika";
  src: url("./fonts/karthika.ttf");
}
`;

  const { css, rules } = parseFontMLTT(inputCss);

  assert.ok(css.includes('@font-face'), 'CSS should contain @font-face');
  assert.ok(!css.includes('@font-mltt'), 'CSS should not contain @font-mltt');
  assert.ok(!css.includes('mapping:'), 'CSS should not contain mapping property');
  assert.ok(css.includes('font-family: "Karthika";'), 'CSS should retain font-family');
  assert.ok(css.includes('src: url("./fonts/karthika.ttf");'), 'CSS should retain src');

  assert.equal(rules.length, 1);
  assert.equal(rules[0].fontFamily, 'Karthika');
  assert.equal(rules[0].mappingType, 'builtin');
  assert.ok(rules[0].mappingValue.includes('Karthika'));
  assert.ok(typeof rules[0].mapping === 'object' && rules[0].mapping !== null);
});

// 3. Parse @font-mltt rule preserving extra font descriptors
test('preserves extra font descriptors (font-weight, font-style, font-display)', () => {
  const inputCss = `
@font-mltt {
  font-family: 'Revathi';
  mapping: "Karthika";
  src: url("./fonts/revathi.ttf") format('truetype');
  font-weight: bold;
  font-style: italic;
  font-display: swap;
}
`;

  const { css, rules } = parseFontMLTT(inputCss);

  assert.ok(css.includes('font-weight: bold;'));
  assert.ok(css.includes('font-style: italic;'));
  assert.ok(css.includes('font-display: swap;'));
  assert.equal(rules[0].fontFamily, 'Revathi');
});

// 4. Resolve local JSON mapping file
test('resolves local JSON file mapping if present', () => {
  const tempDir = path.join(process.cwd(), 'scratch', 'css-test-fixture');
  fs.mkdirSync(tempDir, { recursive: true });

  const customMappingPath = path.join(tempDir, 'custom.json');
  const cssPath = path.join(tempDir, 'styles.css');

  const sampleMapping = {
    name: 'CustomTestMapping',
    mapping: {
      "ക": "k"
    }
  };

  fs.writeFileSync(customMappingPath, JSON.stringify(sampleMapping, null, 2), 'utf-8');

  const inputCss = `
@font-mltt {
  font-family: "CustomFont";
  mapping: url("./custom.json");
  src: url("./font.ttf");
}
`;

  const { rules } = parseFontMLTT(inputCss, { filename: cssPath });

  assert.equal(rules.length, 1);
  assert.equal(rules[0].fontFamily, 'CustomFont');
  assert.equal(rules[0].mappingType, 'file');
  assert.equal(rules[0].mappingValue, './custom.json');
  assert.equal(rules[0].mapping.name, 'CustomTestMapping');

  // Clean up fixture directory
  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 5. Returns unchanged CSS if no @font-mltt rules exist
test('returns original CSS unchanged if no @font-mltt rules exist', () => {
  const plainCss = `body { margin: 0; color: #333; }`;
  const { css, rules } = parseFontMLTT(plainCss);

  assert.equal(css, plainCss);
  assert.equal(rules.length, 0);
});

console.log('----------------------------------------------------');
console.log(`@madhu-mltt/css Test Results: ${passed} passed, 0 failed.`);
console.log('====================================================');
