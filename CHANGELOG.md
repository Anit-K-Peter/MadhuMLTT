# Changelog

All notable changes to the Madhu ML TT project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-09-15

### Added

- **Zero-Syntax Developer Experience**:
  - Developers can write standard React JSX containing Malayalam text without using `<MLText>`, `<MLTTProvider>`, `useMLTT`, or manual conversion calls.
  - `@madhu-mltt/vite` (v0.1.4) automatically converts static Malayalam `JSXText` nodes into clean, un-wrapped ML-TT text nodes at build-time.
  - `@madhu-mltt/vite` automatically wraps dynamic JSX child expressions (`<p>{title}</p>`, `<p>{items.map(...)}</p>`) with type-safe `__madhuConvert()` helper calls.
  - `@madhu-mltt/react` (v0.1.3) exports official public subpath `@madhu-mltt/react/runtime` containing `__madhuConvert()`.
- **Clean Unwrapped DOM Output**: Default transformation outputs clean, native HTML nodes without generating extra `<span>` elements.
- **Strict Attribute & JS Isolation**: Preserves native Malayalam Unicode in HTML attributes (`alt`, `title`, `placeholder`, `aria-label`, `key`, `className`) and non-JSX JavaScript code.
- **Opt-Out Support**: Supports `data-mltt-ignore` attribute to skip transformation on specific JSX elements.
- **New Test Suites**: Added `react-runtime.test.js`, `vite-zero-syntax.test.js`, and `zero-syntax-integration.test.js` bringing master suite count to 31 passed test suites.

---

## [0.1.2] - 2026-09-15

### Added

- **First Public npm Beta Release**: Published official public `@madhu-mltt` package suite to npm registry.
  - `@madhu-mltt/core` v0.1.2
  - `@madhu-mltt/react` v0.1.2
  - `@madhu-mltt/vite` v0.1.3
- **Mixed-Language Preservation Rule**: Updated tokenization and conversion pipelines in `@madhu-mltt/core` to detect and preserve English/ASCII words, numbers, URLs, email addresses, and technical terms in Malayalam text strings without transforming them into ML-TT glyphs.
- **Embedded Karthika Global Default Architecture**: Embedded `ML-TTKarthika` mapping as the default core mapping while maintaining support for custom external mappings via `createConverter()`.
- **React Integration Layer (`@madhu-mltt/react`)**:
  - `<MLText>` polymorphic React component for converting Malayalam text while maintaining accessibility and HTML attributes.
  - `<MLTTProvider>` context provider for global font and converter settings.
  - `useMLTT` hook for direct access to converter instances within React trees.
  - Dual-span accessible DOM rendering (visible ML-TT visual span + screen-reader/SEO-indexed Unicode span).
- **Vite Plugin (`@madhu-mltt/vite`)**:
  - AST-based JSX transformer using Babel parser for build-time static Malayalam text pre-conversion.
  - Fast pass-through bypass for non-Malayalam source files and dynamic JSX expressions.
  - `data-mltt-ignore` attribute support for bypassing transformation per-element.
- **Comprehensive Master Test Suite**: Added 28 complete test suites covering unit conversion, matra reordering, chillu handling, edge cases, round-trip fidelity, performance benchmarks, and end-to-end package consumer integration.

### Changed

- Reorganized core mapping structure to simplify library imports and remove unnecessary file system dependencies.
- Added `@babel/parser` runtime dependency declaration to `@madhu-mltt/vite`.
