import assert from 'node:assert/strict';
import { createConverter, revathiMapping } from '@madhu-mltt/core';
import { madhuMLTTVite } from '@madhu-mltt/vite';

console.log('====================================================');
console.log('MADHU ML TT — ML-TTREVATHI CONFORMANCE & SUITE');
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

const converter = createConverter({ mapping: revathiMapping });

// 1. Basic Vowels
test('Converts basic Malayalam Vowels (Revathi)', () => {
  assert.equal(converter.toMLTT('അ'), 'A');
  assert.equal(converter.toMLTT('ആ'), 'B');
  assert.equal(converter.toMLTT('ഇ'), 'C');
  assert.equal(converter.toMLTT('ഈ'), 'Cu');
  assert.equal(converter.toMLTT('ഉ'), 'D');
  assert.equal(converter.toMLTT('ഊ'), 'Du');
  assert.equal(converter.toMLTT('ഋ'), 'E');
  assert.equal(converter.toMLTT('എ'), 'F');
  assert.equal(converter.toMLTT('ഏ'), 'G');
  assert.equal(converter.toMLTT('ഒ'), 'H');
  assert.equal(converter.toMLTT('ഓ'), 'Hm');
  assert.equal(converter.toMLTT('ഔ'), 'Hu');
});

// 2. Consonants
test('Converts basic Malayalam Consonants (Revathi)', () => {
  assert.equal(converter.toMLTT('ക'), 'I');
  assert.equal(converter.toMLTT('ഖ'), 'J');
  assert.equal(converter.toMLTT('ഗ'), 'K');
  assert.equal(converter.toMLTT('ഘ'), 'L');
  assert.equal(converter.toMLTT('ങ'), 'M');
  assert.equal(converter.toMLTT('ച'), 'N');
  assert.equal(converter.toMLTT('ഛ'), 'O');
  assert.equal(converter.toMLTT('ജ'), 'P');
  assert.equal(converter.toMLTT('ഝ'), 'Q');
  assert.equal(converter.toMLTT('ഞ'), 'R');
  assert.equal(converter.toMLTT('ട'), 'S');
  assert.equal(converter.toMLTT('ഠ'), 'T');
  assert.equal(converter.toMLTT('ഡ'), 'U');
  assert.equal(converter.toMLTT('ഢ'), 'V');
  assert.equal(converter.toMLTT('ണ'), 'W');
  assert.equal(converter.toMLTT('ത'), 'X');
  assert.equal(converter.toMLTT('ഥ'), 'Y');
  assert.equal(converter.toMLTT('ദ'), 'Z');
  assert.equal(converter.toMLTT('ധ'), '[');
  assert.equal(converter.toMLTT('ന'), '\\');
  assert.equal(converter.toMLTT('പ'), ']');
  assert.equal(converter.toMLTT('ഫ'), '^');
  assert.equal(converter.toMLTT('ബ'), '_');
  assert.equal(converter.toMLTT('ഭ'), '`');
  assert.equal(converter.toMLTT('മ'), 'a');
  assert.equal(converter.toMLTT('യ'), 'b');
  assert.equal(converter.toMLTT('ര'), 'c');
  assert.equal(converter.toMLTT('റ'), 'd');
  assert.equal(converter.toMLTT('ല'), 'e');
  assert.equal(converter.toMLTT('ള'), 'f');
  assert.equal(converter.toMLTT('ഴ'), 'g');
  assert.equal(converter.toMLTT('വ'), 'h');
  assert.equal(converter.toMLTT('ഷ'), 'j');
  assert.equal(converter.toMLTT('സ'), 'k');
  assert.equal(converter.toMLTT('ഹ'), 'l');
});

// 3. Matras and Vowel Signs
test('Converts Vowel Signs / Matras & Virama (Revathi)', () => {
  assert.equal(converter.toMLTT('ക') + converter.toMLTT('ാ'), 'Im');
  assert.equal(converter.toMLTT('കി'), 'In');
  assert.equal(converter.toMLTT('കീ'), 'Io');
  assert.equal(converter.toMLTT('കു'), 'Ip');
  assert.equal(converter.toMLTT('കൂ'), 'Iq');
  assert.equal(converter.toMLTT('കൃ'), 'Ir');
  assert.equal(converter.toMLTT('ക്'), 'Iv');
  assert.equal(converter.toMLTT('കം'), 'Iw');
  assert.equal(converter.toMLTT('കഃ'), 'Ix');
});

// 4. Matra Reordering (Left-positioned matras e, ee, ai)
test('Handles left-positioned matra reordering correctly in Revathi', () => {
  assert.equal(converter.toMLTT('കെ'), 'sI'); // e-matra moves before consonant
  assert.equal(converter.toMLTT('കേ'), 'tI'); // ee-matra moves before consonant
  assert.equal(converter.toMLTT('കൊ'), 'sIm'); // e-matra + K + aa-matra
  assert.equal(converter.toMLTT('കോ'), 'tIm'); // ee-matra + K + aa-matra
});

// 5. Common Conjuncts & Chillus
test('Converts Conjuncts and Chillus (Revathi)', () => {
  assert.equal(converter.toMLTT('ന്റ'), '‚');
  assert.equal(converter.toMLTT('ഷ്ട'), '„');
  assert.equal(converter.toMLTT('ക്ത'), '‡');
  assert.equal(converter.toMLTT('റ്റ'), '‰');
  assert.equal(converter.toMLTT('ഞ്ഞ'), '™');
  assert.equal(converter.toMLTT('ശ്ച'), '›');
  assert.equal(converter.toMLTT('ക്ഷ'), '£');
  assert.equal(converter.toMLTT('ന്ത'), '¥');
  assert.equal(converter.toMLTT('ഗ്ഗ'), '§');

  // Chillus
  assert.equal(converter.toMLTT('ൺ'), '¨');
  assert.equal(converter.toMLTT('ൻ'), '³');
  assert.equal(converter.toMLTT('ർ'), 'À');
  assert.equal(converter.toMLTT('ൽ'), 'Â');
  assert.equal(converter.toMLTT('ൾ'), 'ƒ');
});

// 6. User-Specified Real-World Malayalam Examples
test('Converts real-world user-specified Malayalam words (Revathi)', () => {
  assert.equal(converter.toMLTT('കേരളം'), 'tIcfw');
  assert.equal(converter.toMLTT('മലയാളം'), 'aebmfw');
  assert.equal(converter.toMLTT('നമസ്കാരം'), '\\akvImcw');
  assert.equal(converter.toMLTT('കുട്ടികൾ'), 'IpSvSnIƒ');
  assert.equal(converter.toMLTT('പ്രവർത്തിക്കുന്നു'), '{]hÀXvXnIvIp\\v\\p');
  assert.equal(converter.toMLTT('കേരളത്തിന്റെ സ്വന്തം Coconut'), 'tIcfXvXns‚ kz¥w Coconut');
  assert.equal(converter.toMLTT('നാടൻ Coconut Oil'), '\\mS³ Coconut Oil');
});

// 7. Mixed Content, Numbers, Whitespace, Punctuation
test('Preserves English, numbers, whitespace, and punctuation in Revathi conversion', () => {
  const mixed = 'കേരളം 2026! (Kerala)';
  const converted = converter.toMLTT(mixed);
  assert.ok(converted.startsWith('tIcfw 2026! (Kerala)'));

  // Round-trip check
  const roundtrip = converter.toUnicode(converted);
  assert.ok(roundtrip.includes('2026! (Kerala)'));
});

// 8. Edge cases: Malformed input & Unknown characters
test('Handles malformed input & unknown characters safely', () => {
  assert.equal(converter.toMLTT(''), '');
  assert.equal(converter.toMLTT(null), '');
  assert.equal(converter.toMLTT(undefined), '');
  assert.equal(converter.toMLTT('ABC 123'), 'ABC 123');
});

// 9. Reverse Conversion (ML-TT -> Unicode) & Round-Trip
test('Performs reverse conversion (ML-TT -> Unicode) and round-trip fidelity', () => {
  const words = ['കേരളം', 'മലയാളം', 'നമസ്കാരം'];
  for (const word of words) {
    const mltt = converter.toMLTT(word);
    const unicodeBack = converter.toUnicode(mltt);
    assert.equal(unicodeBack, word, `Roundtrip failed for ${word}`);
  }
});

// 10. Integration with @font-mltt CSS at-rule
test('Integrates seamlessly with @font-mltt CSS and Vite plugin', () => {
  const plugin = madhuMLTTVite();
  const cssCode = `
@font-mltt {
  font-family: "Revathi";
  mapping: "ML-TTRevathi";
  src: url("./fonts/revathi.ttf");
}
`;

  const cssResult = plugin.transform(cssCode, '/src/styles.css');
  assert.ok(cssResult.code.includes('@font-face'));
  assert.ok(cssResult.code.includes('font-family: "Revathi";'));

  const jsxCode = `
export default function App() {
  return <h1>കേരളത്തിന്റെ സ്വന്തം Coconut</h1>;
}
`;

  const jsxOutput = plugin.transform(jsxCode, '/src/App.jsx');
  assert.ok(jsxOutput.code.includes('tIcfXvXns‚ kz¥w Coconut'));
});

console.log('----------------------------------------------------');
console.log(`ML-TTRevathi Conformance Results: ${passed} passed, 0 failed.`);
console.log('====================================================');
