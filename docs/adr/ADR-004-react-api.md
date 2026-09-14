# ADR-004: React API Contract and Developer Experience

## Context
Developers using React need a straightforward, declarative interface to render ML-TT formatted Malayalam text without manually managing font loading or low-level conversion calls.

## Decision
The public API for `@madhu-mltt/react` will expose:
1. `<MLTTProvider font={...} mapping={...}>`: Root provider registering font `@font-face` styles, active mapping, and caching context.
2. `<MLText>`: Component wrapper for explicit text transformation.
3. `useMLTT()`: Custom React Hook exposing conversion functions (`unicodeToMLTT`, `mlttToUnicode`) and active font status.

## Rationale
- Minimal API surface that aligns with modern React conventions (`Context`, `Hooks`, `Provider`).
- Allows global configuration at the app root while supporting per-component overrides.

## Status
Approved.
