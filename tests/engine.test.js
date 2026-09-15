/**
 * Madhu ML TT — Master Test Runner
 */

import { execSync } from 'child_process';

const testSuites = [
  // Core SDK Factory & Integration Suites
  'tests/core/factory.test.js',
  'tests/core/immutability.test.js',
  'tests/core/errors.test.js',
  'tests/core/cache.test.js',

  // React Integration Suite
  'tests/react/react.test.js',
  'tests/react-runtime.test.js',

  // Vite Integration Suite
  'tests/vite/vite.test.js',
  'tests/vite-zero-syntax.test.js',
  'tests/css.test.js',
  'tests/vite-css-integration.test.js',
  'tests/revathi.test.js',

  // Real-World Integration Suite
  'tests/integration/realworld-integration.test.js',
  'tests/integration/real-world-package-consumer.test.js',
  'tests/zero-syntax-integration.test.js',

  // Conformance Suites
  'tests/conformance/unicode-to-mltt.test.js',
  'tests/conformance/mltt-to-unicode.test.js',

  // Unit Test Suites
  'tests/unicode-to-mltt/vowels.test.js',
  'tests/unicode-to-mltt/consonants.test.js',
  'tests/unicode-to-mltt/matras.test.js',
  'tests/unicode-to-mltt/conjuncts.test.js',
  'tests/unicode-to-mltt/chillus.test.js',
  'tests/unicode-to-mltt/mixed-content.test.js',
  'tests/mltt-to-unicode/basic.test.js',
  'tests/mltt-to-unicode/matras.test.js',
  'tests/mltt-to-unicode/conjuncts.test.js',
  'tests/mltt-to-unicode/chillus.test.js',
  'tests/mltt-to-unicode/mixed-content.test.js',

  // Edge Case Suites
  'tests/edge-cases/malformed-input.test.js',
  'tests/edge-cases/unknown-chars.test.js',
  'tests/edge-cases/normalization.test.js',
  'tests/edge-cases/mixed-language.test.js',

  // Regression Suite
  'tests/regression/regression.test.js',

  // Roundtrip Suite
  'tests/roundtrip/roundtrip.test.js',

  // Performance Suite
  'tests/performance/benchmark.test.js'
];

console.log('====================================================');
console.log('MADHU ML TT — MASTER TEST SUITE RUNNER');
console.log('====================================================');

let totalPassed = 0;

for (const suite of testSuites) {
  try {
    const output = execSync(`node ${suite}`, { encoding: 'utf8' });
    console.log(output.trim());
    totalPassed++;
  } catch (err) {
    console.error(`[ERROR IN TEST SUITE ${suite}]`);
    console.error(err.stdout || err.message);
    process.exit(1);
  }
}

console.log('====================================================');
console.log(`ALL ${totalPassed} TEST SUITES PASSED CLEANLY!`);
console.log('====================================================');
