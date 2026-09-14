# ADR-002: Explicit Separation of Font Rendering Assets and Encoding Mappings

## Context
Legacy Malayalam fonts use non-standard ASCII glyph layouts. However, a TrueType `.ttf` or `.woff2` font file alone does not specify the sequence-level Unicode mapping or character reordering rules.

## Decision
The SDK architecture explicitly decouples:
1. `Font Asset`: The binary font file (`.ttf`, `.woff2`, or `@font-face` URL) responsible solely for visual outline rendering.
2. `Mapping Definition`: The JSON metadata document detailing character codepoints, matra reordering rules, and chillu priorities.

## Rationale
- Enables supporting new ML-TT fonts (e.g. Revathi, Ambili, Athira) by passing a different JSON mapping without modifying the core conversion engine.
- Prevents embedding proprietary font binaries inside the SDK distribution.

## Status
Approved.
