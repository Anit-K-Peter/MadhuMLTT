import { unicodeToMLTT, mlttToUnicode } from '../src/index.js';

console.log('====================================================');
console.log('MADHU ML TT — PERFORMANCE BENCHMARK');
console.log('====================================================');

const baseText = 'കേരളം ഇന്ത്യയുടെ തെക്കുപടിഞ്ഞാറൻ തീരത്തുള്ള ഒരു സംസ്ഥാനമാണ്. മലയാളം ആണ് ഔദ്യോഗിക ഭാഷ. ';

function generateSampleText(targetBytes) {
  let text = baseText;
  while (Buffer.byteLength(text, 'utf8') < targetBytes) {
    text += baseText;
  }
  return text;
}

const sizes = [
  { name: '100 B', bytes: 100 },
  { name: '1 KB', bytes: 1024 },
  { name: '10 KB', bytes: 10 * 1024 },
  { name: '100 KB', bytes: 100 * 1024 },
  { name: '1 MB', bytes: 1024 * 1024 }
];

for (const { name, bytes } of sizes) {
  const sample = generateSampleText(bytes);
  const actualBytes = Buffer.byteLength(sample, 'utf8');

  // Measure Forward Conversion
  const t0 = performance.now();
  const mltt = unicodeToMLTT(sample);
  const t1 = performance.now();
  const forwardMs = (t1 - t0).toFixed(2);

  // Measure Reverse Conversion
  const t2 = performance.now();
  const unicode = mlttToUnicode(mltt);
  const t3 = performance.now();
  const reverseMs = (t3 - t2).toFixed(2);

  console.log(`[${name.padEnd(6)}] Forward (Unicode->MLTT): ${forwardMs.padStart(7)} ms | Reverse (MLTT->Unicode): ${reverseMs.padStart(7)} ms | Output Match: ${sample === unicode}`);
}

console.log('====================================================');
