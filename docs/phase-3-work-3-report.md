# Madhu ML TT — Phase 3 / Work 3 Report
## Release Hardening & npm Package Audit

This report documents the package audit, file payload inspection (`npm pack`), fresh project installation testing, regression testing, and release hardening for **Madhu ML TT** developer SDK packages (`@madhu-mltt/core`, `@madhu-mltt/react`, `@madhu-mltt/vite`).

---

## 1. Environment

- **OS**: Linux (Ubuntu 24.04 LTS x86_64)
- **Node.js**: v20.19.0
- **Package Manager**: npm 10.8.2
- **React**: v19.3.0
- **Vite**: v5.4.21 / v8.3.0

---

## 2. Package Audit & Metadata Verification

We audited all three packages in the repository to ensure strict specification compliance, clean boundaries, and proper TypeScript support.

### 2.1 `@madhu-mltt/core` (Framework-Independent Engine Core)
- **Package Name**: `@madhu-mltt/core`
- **Version**: `0.1.0`
- **Entry Points**: `src/index.js` (main), `src/index.d.ts` (types)
- **Files Whitelist**: `["src", "README.md", "LICENSE"]`
- **Dependencies**: 0 runtime dependencies
- **Exports**:
  ```json
  "exports": {
    ".": {
      "types": "./src/index.d.ts",
      "default": "./src/index.js"
    }
  }
  ```

### 2.2 `@madhu-mltt/react` (React Integration Layer)
- **Package Name**: `@madhu-mltt/react`
- **Version**: `0.1.0`
- **Entry Points**: `src/index.js` (main), `src/index.d.ts` (types)
- **Files Whitelist**: `["src", "README.md", "LICENSE"]`
- **Dependencies**: `@madhu-mltt/core` (`^0.1.0`)
- **Peer Dependencies**: `react` (`^17.0.0 || ^18.0.0 || ^19.0.0`), `react-dom` (`^17.0.0 || ^18.0.0 || ^19.0.0`)

### 2.3 `@madhu-mltt/vite` (Vite Build-Time Plugin)
- **Package Name**: `@madhu-mltt/vite`
- **Version**: `0.1.0`
- **Entry Points**: `src/index.js` (main), `src/index.d.ts` (types)
- **Files Whitelist**: `["src", "README.md", "LICENSE"]`
- **Dependencies**: `@madhu-mltt/core` (`^0.1.0`)
- **Peer Dependencies**: `vite` (`^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0`)

---

## 3. Tarball Payload Audit (`npm pack`)

We executed `npm pack` across all packages to inspect published tarball contents and guarantee zero leakages of development tools, test suites, or monorepo source files.

| Package | Tarball Filename | Packed Size | Unpacked Size | Total Files | Leaks |
|---|---|---|---|---|---|
| `@madhu-mltt/core` | `madhu-mltt-core-0.1.0.tgz` | 8.6 kB | 28.7 kB | 14 files | 0 leaks |
| `@madhu-mltt/react` | `madhu-mltt-react-0.1.0.tgz` | 5.8 kB | 15.9 kB | 11 files | 0 leaks |
| `@madhu-mltt/vite` | `madhu-mltt-vite-0.1.0.tgz` | 4.0 kB | 10.6 kB | 7 files | 0 leaks |

### Verification of Tarball Contents
- **Included Files**: Source files (`src/`), TypeScript definitions (`.d.ts`), built-in reference mapping (`src/mapping.json`), `README.md`, `LICENSE`, `package.json`.
- **Excluded Artifacts**: Zero test files (`tests/`), zero example apps (`examples/`), zero build caches, zero `.git` files, zero internal development scripts.

---

## 4. Packaging Bug Found & Fixed

### 🐛 Bug: Internal Relative Path Import Leaks in Subpackages
- **Symptom**: During initial fresh consumer installation testing, running `npm run build` failed with `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../node_modules/src/factory.js' imported from .../node_modules/@madhu-mltt/vite/src/plugin.js`.
- **Root Cause**: `packages/vite/src/plugin.js`, `packages/react/src/provider.js`, `packages/react/src/hook.js`, and `packages/react/src/component.js` contained internal monorepo relative paths (`import ... from '../../../src/factory.js'`).
- **Fix**: Updated all internal subpackage imports to consume `@madhu-mltt/core` public package interface (`import ... from '@madhu-mltt/core'`).
- **Verification**: Re-packed tarballs and re-ran fresh consumer installation and build. Passed cleanly.

---

## 5. Fresh Consumer Application Test (`examples/fresh-npm-consumer/`)

To mirror an external developer installing Madhu from npm, we created a completely fresh, isolated React + Vite application: `examples/fresh-npm-consumer/`.

### Installation Strategy
Installed the generated `.tgz` tarballs directly via `npm install`:
```bash
npm install file:../../madhu-mltt-core-0.1.0.tgz file:../../packages/react/madhu-mltt-react-0.1.0.tgz
npm install --save-dev file:../../packages/vite/madhu-mltt-vite-0.1.0.tgz
```

### Verified Functionality
1. **`<MLTTProvider>`**: Global context initialization using default core Karthika mapping.
2. **`<MLText>`**: Polymorphic components (`h1`, `h2`, `p`, `button`) rendering transformed ML-TT legacy text alongside accessible `.sr-only` Malayalam Unicode.
3. **`useMLTT()` Hook**: Direct hook utilities executing forward and reverse conversions cleanly.
4. **`createConverter()` Core API**: Core engine instantiation and conversion directly from `@madhu-mltt/core`.
5. **Vite Plugin (`madhuMLTTVite`)**: Build-time static Malayalam pre-conversion during Vite compilation.
6. **Dynamic & Async Content**: `useState` and `useEffect` state updates updating legacy font output seamlessly.
7. **Production Build**: Production build (`npm run build`) succeeded in **1.18s** with 0 warnings, 0 console errors, and 0 hydration mismatches.

---

## 6. Master Test Suite Verification

Executed `npm test` across the monorepo runner (`tests/engine.test.js`):

```text
====================================================
ALL 27 TEST SUITES PASSED CLEANLY!
====================================================
- Core Engine Tests: 14 passed
- Cache Tests: 2 passed
- React Integration Tests: 9 passed
- Vite Plugin Tests: 7 passed
- Real-World Integration Tests: 6 passed
- Package Consumer Tests: 6 passed
- Unicode -> ML-TT Conformance Tests: 91 passed
- ML-TT -> Unicode Conformance Tests: 41 passed
- Vowels/Consonants/Matras/Conjuncts/Chillus: 86 passed
- Malformed & Edge-Case Tests: 25 passed
- Regression & Round-Trip Tests: 56 passed
- Performance Benchmarks: ALL PASSED
```

---

## 7. Developer Experience Summary

- **Installation Simplicity**: Simple `npm install @madhu-mltt/react @madhu-mltt/core` command.
- **Zero-Config Mapping**: Developers do not need to hunt for mapping files; `@madhu-mltt/core` ships with built-in default Karthika mapping.
- **Vite Integration**: A single line in `vite.config.js` (`madhuMLTTVite()`) pre-converts static text at build time.
- **Full TypeScript Support**: All 3 packages bundle high-quality `.d.ts` declaration files for IDE autocomplete and type safety.

---

## 8. Final Verdict

**Verdict**: **`PASS`**
