# @madhu-mltt/react

Official React integration layer for the Madhu ML TT Malayalam text technology engine.

## Installation

```bash
npm install @madhu-mltt/react @madhu-mltt/core
```

## Quick Start

```jsx
import React from 'react';
import { MLTTProvider, MLText } from '@madhu-mltt/react';

export default function App() {
  return (
    <MLTTProvider font="ML-TTKarthika">
      <MLText as="h1">കേരളം എന്റെ നാടാണ്</MLText>
      <MLText as="p">ഇത് ഒരു മലയാളം വെബ്സൈറ്റാണ്.</MLText>
    </MLTTProvider>
  );
}
```

## Features

- **Polymorphic `<MLText>` Component**: Render converted Malayalam text into any semantic HTML element (`h1`, `p`, `span`, `button`, etc.).
- **Accessible Dual-Span Rendering**: Generates accessible visual ML-TT text alongside hidden canonical Malayalam Unicode for screen readers, search engines, and copy/paste functionality.
- **Dynamic React State**: Efficiently converts dynamic text state with zero hydration issues.
- **Client & SSR Ready**: Safe for Vite, Next.js, and standard React applications.

## License

MIT © Anit K Peter
