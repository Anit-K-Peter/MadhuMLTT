# @madhu-mltt/core API Documentation

`@madhu-mltt/core` is a framework-independent, high-performance developer SDK for bidirectional Malayalam text conversion between modern Unicode and legacy ML-TT font encodings.

---

## 1. Overview & Key Principles

- **Framework Independent**: Zero dependencies, fully safe for Node.js, browsers, SSR (Next.js/Nuxt), Vite, React, Vue, Svelte, and Angular.
- **Font & Mapping Decoupled**: The SDK transforms text based on explicit mapping objects. It does not inspect, parse, load, or bundle `.ttf`/`.otf` font files.
- **Deterministic Immutability**: All provided mapping objects are validated and defensively frozen (`Object.freeze`) internally to eliminate side-effects and runtime corruption.
- **Built-in Performance Caching**: `MLTTConverter` features an integrated, memory-capped LRU (Least Recently Used) cache to accelerate repeated text conversions.

---

## 2. Installation

```bash
npm install @madhu-mltt/core
```

*(Note: Package is ready for local workspace integration before npm publication).*

---

## 3. Quick Start

### Basic Conversion with Default Mapping (ML-TT Karthika)

```typescript
import { createConverter } from "@madhu-mltt/core";

// Initialize converter instance (uses default ML-TT Karthika mapping if omitted)
const converter = createConverter();

// Forward conversion: Unicode Malayalam -> ML-TT font encoding
const mlttText = converter.toMLTT("കേരളം");
console.log(mlttText); // Output: "tIcfw"

// Reverse conversion: ML-TT font encoding -> Unicode Malayalam
const unicodeText = converter.toUnicode("tIcfw");
console.log(unicodeText); // Output: "കേരളം"

// Smart bi-directional auto-detection
const autoDetected = converter.convert("കേരളം");
console.log(autoDetected); // Output: "tIcfw"
```

### Custom Mapping Initialization

```typescript
import { createConverter, validateMapping, type MLTTMapping } from "@madhu-mltt/core";

const customMapping: MLTTMapping = {
  vowels: { "അ": "A", "ആ": "B" },
  consonants: { "ക": "C", "ഖ": "D" },
  matras: { "ാ": "b" },
  chillus: { "ൽ": "L" },
  conjuncts: { "ക്ക": "CC" },
  digits: { "൦": "0" },
  specials: {}
};

// Validate mapping schema before usage
const validation = validateMapping(customMapping);
if (!validation.valid) {
  console.error("Mapping Errors:", validation.errors);
  throw new Error("Invalid mapping definition");
}

// Create converter with custom mapping and custom LRU cache limit
const converter = createConverter({
  mapping: customMapping,
  cacheSize: 500
});
```

---

## 4. Public API Reference

### `createConverter(options?: ConverterOptions): MLTTConverter`

Factory function to instantiate an `MLTTConverter`.

- **Parameters**:
  - `options` *(optional)*: Configuration options for the converter.
- **Returns**: A thread-safe, immutable `MLTTConverter` instance.
- **Throws**: `TypeError` or `Error` if mapping validation fails when an invalid mapping is explicitly passed.

---

### Class `MLTTConverter`

#### Constructor
`new MLTTConverter(options?: ConverterOptions)`

#### Methods

##### `toMLTT(text: string): string`
Converts Unicode Malayalam text into ML-TT font-encoded string representation. Performs Unicode NFC normalization, matra reordering (e.g., pre-base matras `െ`, `ൈ`, `ൊ`), chillu mapping, and conjunct substitution.

##### `toUnicode(text: string): string`
Converts an ML-TT font-encoded text string back into standard Unicode Malayalam. Reconstructs multi-glyph conjuncts, restores post-base matra positioning, and normalizes atomic/virama chillus.

##### `convert(text: string, options?: ConversionOptions): string`
Bi-directional smart conversion method. Automatically detects input text encoding:
- If input contains Malayalam Unicode range (`\u0D00-\u0D7F`), performs `toMLTT()`.
- Otherwise, performs `toUnicode()`.

Can be forced to a specific direction via `options.direction`:
```typescript
converter.convert(text, { direction: "toMLTT" });
converter.convert(text, { direction: "toUnicode" });
```

##### `clearCache(): void`
Flushes the internal LRU conversion cache for this converter instance.

---

## 5. TypeScript Interfaces & Types

```typescript
export interface MLTTMapping {
  version?: string;
  name?: string;
  vowels?: Record<string, string>;
  consonants?: Record<string, string>;
  matras?: Record<string, string>;
  chillus?: Record<string, string>;
  conjuncts?: Record<string, string>;
  digits?: Record<string, string>;
  specials?: Record<string, string>;
  [category: string]: unknown;
}

export interface ConverterOptions {
  mapping?: MLTTMapping;
  cacheSize?: number; // Default: 1000
}

export interface ConversionOptions {
  direction?: 'auto' | 'toMLTT' | 'toUnicode';
  strict?: boolean;
}
```

---

## 6. Error Handling Strategy

The `@madhu-mltt/core` SDK enforces predictable, deterministic error handling:

1. **Mapping Errors**: Passing `null`, `undefined`, or non-object types to `createConverter({ mapping })` throws an explicit `TypeError` with detailed error descriptions.
2. **Text Processing**: Passing non-string primitives (numbers, objects) to `toMLTT()` or `toUnicode()` gracefully converts them to string or returns empty strings without throwing runtime exceptions.
3. **Non-Malayalam / English Content**: English text, ASCII punctuation, numbers, and symbols are preserved unchanged through conversions.

---

## 7. Direct Low-Level Functions

For standalone scripting or lightweight single-shot operations without cache instantiation, low-level conversion functions are also exported:

```typescript
import { unicodeToMLTT, mlttToUnicode } from "@madhu-mltt/core";

const mltt = unicodeToMLTT("കേരളം", mappingData);
const unicode = mlttToUnicode("tIcfw", mappingData);
```
