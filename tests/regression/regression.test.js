import { unicodeToMLTT, mlttToUnicode } from '../../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — REGRESSION TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

const regressions = [
  {
    id: 'REG-001',
    desc: 'Canonical Atomic Chillu precedence over ZWNJ variants',
    mltt: 'À',
    expectedUnicode: 'ർ'
  },
  {
    id: 'REG-002',
    desc: 'Post-base matra u (p) precedence over vocalic L (p)',
    mltt: 'Ip',
    expectedUnicode: 'കു'
  },
  {
    id: 'REG-003',
    desc: 'Pre-base matra + Ra-vattu combined reordering in പ്രവർത്തനം',
    unicode: 'പ്രവർത്തനം',
    expectedMltt: '{]hÀ¯\\w'
  },
  {
    id: 'REG-004',
    desc: 'AI Matra double left-side positioning in കൈ',
    unicode: 'കൈ',
    expectedMltt: 'ssI'
  },
  {
    id: 'REG-005',
    desc: 'Split matra O expansion in കൊ',
    unicode: 'കൊ',
    expectedMltt: 'sIm'
  },
  {
    id: 'REG-006',
    desc: 'Punctuation preserving in mixed strings',
    unicode: 'കേരളം (India) - 2026',
    expectedMltt: 'tIcfw (India) - 2026'
  }
];

for (const { id, desc, unicode, mltt, expectedUnicode, expectedMltt } of regressions) {
  let isPass = false;

  if (unicode && expectedMltt) {
    const resMltt = unicodeToMLTT(unicode);
    isPass = resMltt === expectedMltt;
    if (!isPass) {
      console.error(`[REGRESSION FAIL ${id}] ${desc} | Got: ${resMltt} | Expected: ${expectedMltt}`);
    }
  }

  if (mltt && expectedUnicode) {
    const resUnicode = mlttToUnicode(mltt);
    isPass = resUnicode === expectedUnicode;
    if (!isPass) {
      console.error(`[REGRESSION FAIL ${id}] ${desc} | Got: ${resUnicode} | Expected: ${expectedUnicode}`);
    }
  }

  if (isPass) {
    passed++;
  } else {
    failed++;
  }
}

console.log('----------------------------------------------------');
console.log(`Regression Test Suite: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
