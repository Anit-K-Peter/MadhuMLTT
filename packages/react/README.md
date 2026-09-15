# @madhu-mltt/react

[![npm version](https://img.shields.io/npm/v/@madhu-mltt/react.svg)](https://www.npmjs.com/package/@madhu-mltt/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Official React integration layer for the **Madhu ML TT** Malayalam text technology engine.

---

## Key Features

- **Polymorphic `<MLText>` Component**: Render converted Malayalam text into any semantic HTML element (`h1`, `p`, `span`, `button`, etc.).
- **Accessible Dual-Span Rendering**: Renders a visually styled ML-TT text span alongside an accessible, visually-hidden Malayalam Unicode span for screen readers, copy/paste, and search engine indexing.
- **Context Management (`<MLTTProvider>`)**: Configure default font family and mapping settings globally across your component tree.
- **Hook API (`useMLTT`)**: Access converter instances directly in custom components.
- **Client & SSR Ready**: Server-Side Rendering safe with Next.js, Remix, and Vite.

---

## Installation

```bash
npm install @madhu-mltt/react @madhu-mltt/core
```

---

## Quick Start

Wrap your application in `<MLTTProvider>` and use `<MLText>` to render Malayalam text:

```jsx
import React from 'react';
import { MLTTProvider, MLText } from '@madhu-mltt/react';

export default function App() {
  return (
    <MLTTProvider font="ML-TTKarthika">
      <MLText as="h1" className="title">
        കേരളം എന്റെ നാടാണ്
      </MLText>
      
      <MLText as="p" className="content">
        ഇത് ഒരു Malayalam React website ആണ്. (Version 1.0)
      </MLText>
    </MLTTProvider>
  );
}
```

---

## Component API

### `<MLTTProvider>`

Context provider for ML-TT text settings.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `font` | `string` | `'ML-TTKarthika'` | Active ML-TT font family name applied to visual elements. |
| `mapping` | `object` | `defaultMapping` | Custom font mapping dictionary object. |
| `accessible` | `boolean` | `true` | Enables dual-span accessible markup generation by default. |

### `<MLText>`

Polymorphic text conversion component.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `as` | `ElementType` | `'span'` | The HTML tag or React component to render (`h1`, `p`, `button`, etc.). |
| `accessible` | `boolean` | `true` | Overrides global accessibility setting for this component. |
| `font` | `string` | Provider default | Overrides active font family for this component. |
| `mapping` | `object` | Provider default | Overrides mapping dictionary for this component. |

#### Example: Direct Text Replacement (Non-Accessible Mode)

If dual-span rendering is not needed for a specific element (e.g. icon labels or buttons):

```jsx
<MLText as="button" accessible={false}>
  സമർപ്പിക്കുക
</MLText>
```

---

## Hook Usage (`useMLTT`)

Access the underlying converter instance directly inside custom components:

```jsx
import React from 'react';
import { useMLTT } from '@madhu-mltt/react';

export function MalayalamBadge({ text }) {
  const { converter, font } = useMLTT();
  const mlttText = converter.toMLTT(text);

  return (
    <span style={{ fontFamily: font }}>
      {mlttText}
    </span>
  );
}
```

---

## License

MIT License © Anit K Peter
