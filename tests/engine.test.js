/**
 * Madhu ML TT — Comprehensive Test Runner
 */

import { execSync } from 'child_process';

const testFiles = [
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
  'tests/roundtrip/roundtrip.test.js',
  'tests/benchmark.js'
];

console.log('====================================================');
console.log('MADHU ML TT — RUNNING ALL SUITES');
console.log('====================================================');

let totalPassed = 0;

for (const file of testFiles) {
  try {
    const output = execSync(`node ${file}`, { encoding: 'utf8' });
    console.log(output.trim());
    totalPassed++;
  } catch (err) {
    console.error(`[ERROR IN TEST FILE ${file}]`);
    console.error(err.stdout || err.message);
    process.exit(1);
  }
}

console.log('====================================================');
console.log(`ALL ${totalPassed} TEST SUITES COMPLETED SUCCESSFULLY!`);
console.log('====================================================');
