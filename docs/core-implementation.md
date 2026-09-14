# `@madhu-mltt/core` Implementation Architecture

This document describes the internal implementation architecture of `@madhu-mltt/core`, detailing how the public SDK wraps the validated Phase 1 conversion engine without modifying its core conversion logic.

---

## 1. Architectural Data Flow

```text
Developer Application
        │
        ▼
createConverter(options)
        │
        ├─► validateMapping(options.mapping)
        ├─► Deep Clone & Object.freeze(mapping)
        └─► Instantiate SimpleLRUCache(cacheSize)
        │
        ▼
MLTTConverter Instance
        │
┌───────┴───────────────────────────────┐
│ converter.toMLTT() / toUnicode()       │
└───────┬───────────────────────────────┘
        │
        ▼
   Check Cache hit?
   ├── YES ──► Return cached result (O(1))
   └── NO  ──► Execute Phase 1 Conversion Engine:
                  - Unicode NFC Normalization
                  - Pre-base / Post-base Matra Reordering
                  - Atomic / Virama Chillu Processing
                  - Conjunct Glyph Substitution
                  - Store result in LRU Cache
                  - Return output string
```

---

## 2. Directory & Module Structure

```text
packages/core (root)
  │
  ├── src/
  │   ├── index.js          # Public ESM/CJS export entry point
  │   ├── index.d.ts        # TypeScript definitions for SDK consumer
  │   ├── factory.js        # createConverter, MLTTConverter, validateMapping, LRU Cache
  │   ├── converter/        # Validated Phase 1 core conversion engine
  │   │   ├── index.js      # Internal conversion facade (unicodeToMLTT, mlttToUnicode)
  │   │   ├── forward.js    # Forward transformation rules (Unicode -> ML-TT)
  │   │   ├── reverse.js    # Reverse transformation rules (ML-TT -> Unicode)
  │   │   ├── matra.js      # Matra reordering & positioning algorithms
  │   │   ├── chillu.js     # Chillu normalization & mapping handlers
  │   │   └── rules.js      # Canonical sequence matching engine
  │   └── mappings/
  │       └── karthika.json # Validated reference mapping specification
  │
  ├── tests/                # Automated verification & regression test suite
  └── docs/                 # Public & technical documentation
```

---

## 3. Core Component Isolation

### Factory & Public API Boundary (`src/factory.js`)
- Exposes `createConverter()` and `MLTTConverter`.
- Acts as a defensive wrapper around low-level conversion routines in `src/converter/`.
- Implements mapping validation using `validateMapping()`.

### Defensive Immutability & Safety
- Caller-provided mapping dictionaries are deep-cloned and recursively frozen with `Object.freeze()`.
- External attempts to mutate mapping keys or values after passing them to `createConverter()` have zero effect on internal converter state.

### High-Efficiency LRU Cache (`SimpleLRUCache`)
- Integrated within each `MLTTConverter` instance.
- Caches converted strings up to `cacheSize` limit (default 1000 items).
- Reduces repeat string conversion latency from ~0.1 ms to ~0.002 ms per conversion.

### Validated Engine Integrity (`src/converter/`)
- Phase 1 core transformation algorithms remain completely intact and untouched.
- Handles edge cases including ZWJ (`\u200D`), ZWNJ (`\u200C`), atomic vs. virama chillus, non-Malayalam mixed text, and extended ASCII ranges.

---

## 4. Browser, Node & SSR Safety Verification

- **DOM Independence**: Zero references to `window`, `document`, `navigator`, `HTMLElement`, `MutationObserver`, or `FontFace`.
- **Node File System Independence**: Runtime conversions perform no dynamic `fs` or `path` IO operations.
- **Zero Runtime Dependencies**: The package relies purely on native ECMAScript standard libraries (`Map`, `Object.freeze`, standard String regex methods).
