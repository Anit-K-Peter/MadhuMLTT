# @madhu-mltt/core

[![npm version](https://img.shields.io/npm/v/@madhu-mltt/core.svg)](https://www.npmjs.com/package/@madhu-mltt/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**@madhu-mltt/core** is a high-performance, framework-independent Malayalam text engine designed for bidirectional conversion between modern **Unicode Malayalam** and legacy **ML-TT** (Malayalam TrueType) font encodings.

---

## Key Features

- **Bidirectional Conversion**: High-accuracy `Unicode -> ML-TT` and `ML-TT -> Unicode` transformations.
- **Embedded Karthika Mapping**: Uses the standard `ML-TTKarthika` font mapping as the built-in global default.
- **Mixed-Language Preservation**: Preserves English words, numbers, technical terms, URLs, email addresses, and punctuation inside Malayalam text.
- **Matra Reordering Engine**: Handles pre-base matras (`െ`, `േ`, `ൈ`, `്ര`) and split matras (`ൊ`, `ോ`, `ൌ`).
- **Chillu Standardization**: Supports both atomic Unicode chillus (`U+0D7K`–`U+0D7F`) and legacy virama-based sequences (`ന+്+ZWJ`).
- **LRU Caching**: Built-in LRU cache for string conversions ensuring sub-millisecond throughput.
- **Zero Runtime Dependencies**: Pure ES Module compatible with Node.js, modern browsers, Next.js, Vite, and Web Workers.

---

## Installation

```bash
npm install @madhu-mltt/core
```

---

## Quick Start

```javascript
import { createConverter, defaultMapping } from '@madhu-mltt/core';

// 1. Initialize converter with default Karthika mapping
const converter = createConverter(defaultMapping);

// 2. Convert Unicode Malayalam to ML-TT ASCII
const mltt = converter.toMLTT('കേരളം');
console.log(mltt); // "tIcfw"

// 3. Convert ML-TT ASCII back to Unicode Malayalam
const unicode = converter.toUnicode('tIcfw');
console.log(unicode); // "കേരളം"

// 4. Mixed Language Text Preservation
const mixedText = 'കേരളം (Kerala) is a state in South India.';
const convertedMixed = converter.toMLTT(mixedText);
console.log(convertedMixed); // "tIcfw (Kerala) is a state in South India."
```

---

## API Reference

### `createConverter(mapping?, options?)`

Factory function that creates a new `MLTTConverter` instance.

- **`mapping`** *(object, optional)*: Font mapping object. Defaults to built-in `defaultMapping` (Karthika).
- **`options`** *(object, optional)*:
  - **`mode`** *('mixed' | 'strict')*: Reverse conversion mode. Default: `'mixed'`.
  - **`preserveEnglish`** *(boolean)*: English preservation flag. Default: `true`.
  - **`cacheSize`** *(number)*: Maximum entries for LRU conversion cache. Default: `1000`.

### Converter Instance Methods

#### `converter.toMLTT(unicodeText)`
Converts a Malayalam Unicode string into an ML-TT font encoded ASCII string.

- **`unicodeText`** *(string)*: Malayalam Unicode text.
- **Returns**: *(string)* ML-TT ASCII string.

#### `converter.toUnicode(mlttText, overrideOptions?)`
Converts an ML-TT ASCII string back into modern Malayalam Unicode text.

- **`mlttText`** *(string)*: ML-TT ASCII text.
- **`overrideOptions`** *(object, optional)*: Override instance default options for this invocation.
- **Returns**: *(string)* Malayalam Unicode text.

---

## Advanced Usage

### Using Custom Mappings

You can supply custom font mapping dictionaries to `createConverter()`:

```javascript
import { createConverter } from '@madhu-mltt/core';
import customMappingData from './my-custom-mapping.json' with { type: 'json' };

const customConverter = createConverter(customMappingData);
const result = customConverter.toMLTT('മലയാളം');
```

---

## Testing

Run the complete test suite:

```bash
npm test
```

---

## License

MIT License © Anit K Peter
