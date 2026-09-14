# Madhu ML TT — Core Malayalam Text Engine

[![Phase 1 Status](https://img.shields.io/badge/Phase_1-Complete-success.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()

**Madhu ML TT** is a high-performance, developer-focused Malayalam text engine designed for bidirectional conversion between modern **Unicode Malayalam** and legacy **ML-TT** (Malayalam TrueType) font encodings.

---

## Capabilities & Features

- **Bidirectional Conversion**: Accurate `Unicode -> ML-TT` and `ML-TT -> Unicode` transformation.
- **Sequence-Aware Matra Reordering**: Handles pre-base matras (`െ`, `േ`, `ൈ`, `്ര`) and split matras (`ൊ`, `ോ`, `ൌ`).
- **Atomic Chillu Standardization**: Full support for both atomic Unicode chillus (`U+0D7K`–`U+0D7F`) and legacy virama-based sequences (`ന+്+ZWJ`).
- **Mixed Content Preservation**: Retains English words, numbers, emails, URLs, punctuation (`.,!?;:()[]{}'"-/_`), and whitespace.
- **Data-Driven Architecture**: Decoupled engine algorithms and font mapping data (`ML-TTKarthika` C-DIT / GIST standard).
- **Framework Independent**: Pure ES Module with zero runtime dependencies. Runs in Node.js, browsers, or web workers.

---

## Installation & Basic Usage

```javascript
import { unicodeToMLTT, mlttToUnicode } from './src/index.js';

// 1. Unicode to ML-TT Conversion
const mltt = unicodeToMLTT('കേരളം');
console.log(mltt); // Output: "tIcfw"

// 2. ML-TT to Unicode Conversion
const unicode = mlttToUnicode('tIcfw');
console.log(unicode); // Output: "കേരളം"

// 3. Mixed Text Conversion with English Preservation
const mixedMltt = unicodeToMLTT('Hello കേരളം 2026!');
console.log(mixedMltt); // Output: "Hello tIcfw 2026!"

const restoredUnicode = mlttToUnicode(mixedMltt, { preserveEnglish: true });
console.log(restoredUnicode); // Output: "Hello കേരളം 2026!"
```

---

## Verification & Test Suite

Run the master test runner containing 19 test suites:

```bash
npm test
```

### Included Test Categories

```text
tests/
├── conformance/      # Fixed reference fixture tests for both directions
├── unicode-to-mltt/  # Vowels, consonants, matras, conjuncts, chillus, mixed
├── mltt-to-unicode/  # Basic, matras, conjuncts, chillus, mixed
├── edge-cases/       # Malformed input, unknown chars, normalization matrix
├── regression/       # Bug fix regression protection
├── roundtrip/        # 100% roundtrip fidelity suite (50 assertions)
├── performance/      # Throughput benchmarks (100 B to 1 MB)
└── font-verification.py # fontTools glyph correspondence verification
```

---

## Current Scope & Future Roadmap

* **Phase 1 (Complete)**: Technical specification, font audit, reordering engine, test suite, and core release readiness.
* **Phase 2 (Planned)**: Developer SDK (`@madhu-mltt/core`), React components, and Vite plugin integration.

---

## License

MIT License.
