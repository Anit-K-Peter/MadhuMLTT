# Madhu ML TT — Architecture Documentation

## System Overview

**Madhu ML TT** is a developer-focused, sequence-aware text technology engine for Malayalam. It provides bidirectional transformation between modern **Unicode Malayalam** (ISO/IEC 10646) and legacy **ML-TT** (Malayalam TrueType) 8-bit glyph encodings.

```text
               FORWARD PIPELINE (Unicode -> ML-TT)

  +-----------------------+
  |  Unicode Input Stream |
  +-----------------------+
              |
              v
  +-----------------------+
  | Normalization (NFC)   |  <-- Converts Virama+ZWJ to Atomic Chillus
  +-----------------------+
              |
              v
  +-----------------------+
  | Sequence Tokenizer    |  <-- Partitions Malayalam vs Non-Malayalam runs
  +-----------------------+
              |
              v
  +-----------------------+
  | Matra Reordering      |  <-- Positions pre-base matras (െ, േ, ൈ, ്ര)
  | & Cluster Processing  |      in front of base consonants
  +-----------------------+
              |
              v
  +-----------------------+
  | Glyph Mapping Engine  |  <-- Data-driven lookup in ml-tt-karthika.json
  +-----------------------+
              |
              v
  +-----------------------+
  | ML-TT ASCII Stream    |
  +-----------------------+
```

---

```text
               REVERSE PIPELINE (ML-TT -> Unicode)

  +-----------------------+
  |  ML-TT ASCII Input    |
  +-----------------------+
              |
              v
  +-----------------------+
  | Inverted Indexer &    |  <-- Canonical priority overrides for chillus
  | Length-Sorted Keys    |      & matras over ZWNJ/ZWJ variants
  +-----------------------+
              |
              v
  +-----------------------+
  | FIFO Pending Vowels   |  <-- Reconstructs logical Unicode order
  | State Machine         |      from visual pre-base matra streams
  +-----------------------+
              |
              v
  +-----------------------+
  | Atomic Normalization  |  <-- Outputs clean atomic Malayalam Unicode
  +-----------------------+
              |
              v
  +-----------------------+
  | Unicode Output        |
  +-----------------------+
```

---

## Key Design Principles

1. **Framework & Environment Independence**: The core engine (`src/converter/`) has **zero runtime dependencies**, no DOM operations, no browser APIs, no network calls, and no React dependencies. It executes in any standard Node.js or JavaScript runtime.
2. **Data-Driven Architecture**: The conversion algorithms are completely decoupled from font encoding definitions. Mapping schemas are stored as structured JSON documents in `src/mappings/`.
3. **Determinism**: All operations produce deterministic outputs. Ambiguous Extended ASCII bytes (e.g. `0xFE` / `þ`) follow fallback specification rules.
4. **Package Isolation**: Structured to allow seamless future extraction into `@madhu-mltt/core`.
