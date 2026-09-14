# @madhu-mltt/vite

Vite build-time transformation plugin for the Madhu ML TT Malayalam text technology engine.

## Installation

```bash
npm install --save-dev @madhu-mltt/vite
npm install @madhu-mltt/core
```

## Quick Start

Add the plugin to your `vite.config.js`:

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

## Features

- **Build-Time Pre-Conversion**: Transforms static Malayalam JSX text nodes during Vite build/dev bundling for zero client-side conversion overhead.
- **AST-Based Safety**: Uses Babel AST parsing for safe, precise node transformations without regular expression search/replace bugs.
- **Dynamic Expression Safety**: Leaves dynamic variables (`{title}`) untouched for runtime processing by `@madhu-mltt/react`.
- **Accessible Dual-Span Generation**: Generates accessible visual ML-TT text alongside hidden canonical Malayalam Unicode for screen readers, search engines, and copy/paste functionality.

## License

MIT © Anit K Peter
