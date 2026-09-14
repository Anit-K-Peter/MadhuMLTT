# `@madhu-mltt/react` API Documentation

`@madhu-mltt/react` is the official React integration layer for the Madhu ML TT Malayalam text engine. It enables React developers to write standard Unicode Malayalam text in JSX while visually rendering converted ML-TT font encodings cleanly on the client.

---

## 1. Features & Principles

- **Consumes `@madhu-mltt/core`**: Wraps the framework-independent core conversion engine with zero code duplication.
- **Accessible Dual-Span Rendering**: Generates accessible HTML markup (`aria-hidden` visual ML-TT text + `sr-only` Unicode text) ensuring screen readers, copy/paste, and search engine indexing operate seamlessly.
- **Polymorphic `<MLText>` Component**: Renders as any semantic HTML tag (`h1`, `p`, `div`, `span`, `button`, `a`) via the `as` prop.
- **Client & SSR Safe**: Fully compatible with Next.js App Router, SSR frameworks, Vite, and standard React applications with zero hydration mismatches.

---

## 2. Installation

```bash
npm install @madhu-mltt/react @madhu-mltt/core
```

---

## 3. Quick Start

### Step 1: Wrap Your Application with `<MLTTProvider>`

```jsx
import React from 'react';
import { MLTTProvider } from '@madhu-mltt/react';

export default function App() {
  return (
    <MLTTProvider
      font={{
        family: 'ML-TTKarthika',
        src: '/fonts/ML_TT_Karthika_Normal.ttf'
      }}
    >
      <Header />
      <MainContent />
    </MLTTProvider>
  );
}
```

### Step 2: Use `<MLText>` in Components

```jsx
import React, { useState } from 'react';
import { MLText } from '@madhu-mltt/react';

export function Header() {
  const [title] = useState('കേരളത്തിലേക്ക് സ്വാഗതം');

  return (
    <header>
      <MLText as="h1" className="main-title">
        {title}
      </MLText>
      
      <MLText as="p" className="subtitle">
        ഇത് ഒരു മലയാളം വെബ്സൈറ്റാണ്.
      </MLText>
    </header>
  );
}
```

---

## 4. Component Reference

### `<MLTTProvider>`

Root React Context provider registering font settings, mapping rules, and converter cache context for descendant components.

#### Props:
| Prop | Type | Default | Description |
|---|---|---|---|
| `font` | `string \| FontConfig` | `'ML-TTKarthika'` | Font family name or font configuration object `{ family, src, weight, style }` |
| `mapping` | `MLTTMapping` | Karthika Mapping | Optional custom ML-TT JSON mapping object |
| `cacheSize` | `number` | `1000` | Maximum LRU string conversion cache capacity |
| `accessible` | `boolean` | `true` | Enables dual-span accessible markup for screen readers & SEO |
| `children` | `ReactNode` | — | Descendant React components |

---

### `<MLText>`

Polymorphic component wrapper that converts Unicode Malayalam text children to ML-TT font encodings and applies custom font styling.

#### Props:
| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `React.ElementType` | `'span'` | Polymorphic HTML tag or React component (`h1`, `p`, `div`, `a`, etc.) |
| `children` | `ReactNode` | — | Text content or nested JSX elements to transform |
| `fontFamily` | `string` | Context value | Overrides active font family for this component instance |
| `mapping` | `MLTTMapping` | Context value | Overrides mapping dictionary for this component instance |
| `accessible` | `boolean` | Context value | Overrides dual-span accessibility markup |
| `className` | `string` | `undefined` | CSS class names |
| `style` | `CSSProperties` | `undefined` | Inline styles |
| `ref` | `React.Ref` | `undefined` | Forwarded ref to rendered container DOM element |

---

### `useMLTT()` Hook

Custom React hook exposing converter utilities and current font context.

#### Returns:
```typescript
{
  converter: MLTTConverter,
  fontFamily: string,
  font: string | FontConfig,
  mapping: MLTTMapping | null,
  isLoaded: boolean,
  accessible: boolean,
  toMLTT: (text: string) => string,
  toUnicode: (text: string) => string,
  convert: (text: string, options?: ConversionOptions) => string
}
```

---

## 5. Accessibility & SEO Architecture

When `accessible={true}` (default), `<MLText as="h1">കേരളം</MLText>` renders:

```html
<h1 class="main-title">
  <!-- Visual representation rendered with ML-TT font -->
  <span aria-hidden="true" style="font-family: ML-TTKarthika">tIcfw</span>
  
  <!-- Accessible to NVDA/VoiceOver screen readers, text copy/paste & Googlebot -->
  <span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;">കേരളം</span>
</h1>
```

---

## 6. SSR & Hydration Safety

- **Server-Side Rendering**: `@madhu-mltt/core` performs pure deterministic text conversions during SSR (`renderToString`). No `window` or `document` checks execute on the server.
- **Hydration Matching**: Generated server HTML and client initial render output are identical, eliminating React hydration warnings.
