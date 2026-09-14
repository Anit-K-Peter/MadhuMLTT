# `@madhu-mltt/vite` API Documentation

`@madhu-mltt/vite` provides optional, high-performance build-time transformation for Madhu ML TT. It parses JSX source code at build time, transforming static Malayalam text nodes into accessible ML-TT font encodings for zero client-side conversion overhead.

---

## 1. Features & Principles

- **Zero Runtime Overhead for Static Text**: Pre-converts static Malayalam JSX text nodes during Vite build/dev bundling.
- **AST-Based Safety**: Parses JS/TS/JSX/TSX files into Abstract Syntax Trees using `@babel/parser`. Never performs unsafe regex string replacements over raw source files.
- **Dynamic Expression Safety**: Leaves dynamic expressions (`{title}`, `{state}`) and runtime data untouched for runtime processing by `@madhu-mltt/react` or `@madhu-mltt/core`.
- **Accessible Dual-Span Generation**: Generates accessible HTML markup (`aria-hidden` visual ML-TT text + `sr-only` Unicode Malayalam text) preserving screen readers, text copy/paste, and search engine indexing.
- **Source Map Preservation**: Emits precise source map mappings for debugger compatibility.

---

## 2. Installation

```bash
npm install --save-dev @madhu-mltt/vite
npm install @madhu-mltt/core
```

---

## 3. Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { madhuMLTTVite } from '@madhu-mltt/vite';
import karthikaMapping from './src/mappings/ml-tt-karthika.json';

export default defineConfig({
  plugins: [
    react(),
    madhuMLTTVite({
      fontFamily: 'ML-TTKarthika',
      mapping: karthikaMapping,
      accessible: true
    })
  ]
});
```

---

## 4. Options

```typescript
export interface VitePluginOptions {
  mapping?: MLTTMapping;          // Custom ML-TT mapping object (defaults to reference Karthika)
  fontFamily?: string;           // CSS font-family name (default: 'ML-TTKarthika')
  include?: RegExp | string;      // File include filter (default: /\.(jsx|tsx|js|ts)$/)
  exclude?: RegExp | string;      // File exclude filter (default: /node_modules|\.git|dist/)
  accessible?: boolean;           // Enable accessible dual-span markup (default: true)
}
```

---

## 5. Selective Opt-Out

To prevent build-time transformation on a specific element, add the `data-mltt-ignore` attribute:

```jsx
<div data-mltt-ignore>
  ഈ ടെക്സ്റ്റ് ബിൽഡ് ടൈമിൽ കൺവേർട്ട് ചെയ്യില്ല.
</div>
```
