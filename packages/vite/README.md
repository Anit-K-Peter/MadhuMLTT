# @madhu-mltt/vite

[![npm version](https://img.shields.io/npm/v/@madhu-mltt/vite.svg)](https://www.npmjs.com/package/@madhu-mltt/vite)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Official Vite build-time transformation plugin for the **Madhu ML TT** Malayalam text technology engine.

---

## Key Features

- **Zero Client Overhead**: Converts static Malayalam JSX text nodes into accessible ML-TT markup during Vite build/dev bundling.
- **AST-Based Precision**: Uses Babel AST parsing for safe node transformations without regular expression search/replace bugs.
- **Dynamic Expression Safety**: Leaves dynamic React expressions (`{title}`) untouched for runtime processing by `@madhu-mltt/react`.
- **Selective Ignored Elements**: Supports `data-mltt-ignore` attribute to skip transformation on specific JSX elements.
- **Accessible Dual-Span Generation**: Generates accessible visual ML-TT text alongside hidden canonical Malayalam Unicode for screen readers and SEO indexing.

---

## Installation

```bash
npm install --save-dev @madhu-mltt/vite
npm install @madhu-mltt/core
```

---

## Usage

Add `madhuMLTTVite` to your `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { madhuMLTTVite } from '@madhu-mltt/vite';

export default defineConfig({
  plugins: [
    react(),
    madhuMLTTVite({
      fontFamily: 'ML-TTKarthika',
      accessible: true
    })
  ]
});
```

---

## Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `fontFamily` | `string` | `'ML-TTKarthika'` | Font family name applied to generated ML-TT visual spans. |
| `accessible` | `boolean` | `true` | When true, generates dual-span accessible markup. When false, replaces text nodes directly. |
| `mapping` | `object` | `defaultMapping` | Custom font mapping dictionary object. |
| `include` | `FilterPattern` | `/\.[jt]sx?$/` | Minimatch pattern for files to include in transformation. |
| `exclude` | `FilterPattern` | `[/\bnode_modules\b/]` | Minimatch pattern for files to exclude from transformation. |

---

## Bypassing Transformation

To prevent the Vite plugin from transforming a specific JSX element, add the `data-mltt-ignore` attribute:

```jsx
<p data-mltt-ignore>
  ഇത് മാറ്റി സ്ഥാപിക്കപ്പെടുകയില്ല (Untransformed Unicode Malayalam)
</p>
```

---

## License

MIT License © Anit K Peter
