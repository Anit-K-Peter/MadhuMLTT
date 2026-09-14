# Madhu ML TT — Developer SDK Architecture & API Design Specification

**Document Version:** 1.0.0  
**Phase:** Phase 2 / Work 1 — Developer SDK Architecture & API Design  
**Target Repository:** `/mnt/WorkStation/Main Project/MadhuMLTT`  
**Status:** Architectural Specification Complete  

---

## 1. Goals

- **Developer Simplicity**: Allow developers to write standard, human-readable Unicode Malayalam in JSX/React source code while rendering visual ML-TT font output seamlessly.
- **Strict Decoupling**: Maintain clear separation between the conversion engine (`@madhu-mltt/core`), React integration (`@madhu-mltt/react`), font rendering assets, and JSON encoding mappings.
- **Accessibility & Copy/Paste Preservation**: Provide mechanisms that maintain semantic Unicode accessibility for screen readers and text copying while presenting visual ML-TT font rendering.
- **High Throughput & Caching**: Ensure zero UI lag by memoizing text transformations across React re-renders.
- **SSR & Next.js Compatibility**: Eliminate hydration mismatches and prevent browser-only API crashes during Server-Side Rendering.

---

## 2. Non-Goals

- **No Core Engine Modification**: The validated Phase 1 core converter (`src/converter/`) will not be rewritten or altered.
- **No Bundled Third-Party Fonts**: The SDK will not distribute copyrighted font binaries. Developers supply their own licensed font assets and mappings.
- **No Direct DOM String Mutation**: The SDK will avoid unconstrained MutationObserver text replacement that corrupts Virtual DOM text nodes.

---

## 3. Package Architecture

```text
madhu-mltt/
├── packages/
│   ├── core/           # @madhu-mltt/core (Framework-independent conversion engine)
│   ├── react/          # @madhu-mltt/react (Context, Provider, Hooks, MLText)
│   └── vite/           # @madhu-mltt/vite (Build-time transformation plugin - Future)
```

```text
+-------------------------------------------------------------------------+
|                              REACT APP                                  |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           @madhu-mltt/react                             |
|  - <MLTTProvider>   - <MLText>   - useMLTT()   - Font Injection         |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           @madhu-mltt/core                              |
|  - unicodeToMLTT()  - mlttToUnicode()  - normalizeUnicode()             |
+-------------------------------------------------------------------------+
                                     |
                                     v
+------------------------------------+------------------------------------+
|            FONT ASSET              |             MAPPING DATA           |
|  (.ttf / .woff2 / @font-face)      |  (ml-tt-karthika.json)             |
+------------------------------------+------------------------------------+
```

---

## 4. React API Proposal

### 4.1 Provider Setup (`<MLTTProvider>`)

```jsx
import { MLTTProvider } from '@madhu-mltt/react';
import karthikaMapping from './mappings/ml-tt-karthika.json';

export default function App() {
  return (
    <MLTTProvider
      font={{
        family: 'ML-TTKarthika',
        src: '/fonts/ML_TT_Karthika_Normal.ttf'
      }}
      mapping={karthikaMapping}
    >
      <MainLayout />
    </MLTTProvider>
  );
}
```

### 4.2 Explicit Component Wrapper (`<MLText>`)

```jsx
import { MLText } from '@madhu-mltt/react';

export function HeaderSection() {
  return (
    <div>
      <MLText as="h1" className="title">
        കേരളത്തിലേക്ക് സ്വാഗതം
      </MLText>
      
      <MLText as="p">
        ഇത് ഒരു മലയാളം വെബ്സൈറ്റാണ്.
      </MLText>
    </div>
  );
}
```

### 4.3 Custom React Hook (`useMLTT`)

```jsx
import { useMLTT } from '@madhu-mltt/react';

export function CustomConverterComponent() {
  const { unicodeToMLTT, mlttToUnicode, isLoaded } = useMLTT();

  const mlttString = unicodeToMLTT('കേരളം'); // Output: "tIcfw"

  return <div>{mlttString}</div>;
}
```

---

## 5. Font Architecture

The SDK accepts developer fonts in multiple formats:
- Binary font imports (`.ttf`, `.otf`, `.woff`, `.woff2`)
- Remote URL endpoints (`https://cdn.example.com/fonts/karthika.woff2`)
- Existing CSS font family names already registered in global styles.

```typescript
export interface FontConfig {
  family: string;
  src?: string;
  weight?: string | number;
  style?: string;
  format?: 'truetype' | 'woff' | 'woff2' | 'opentype';
}
```

When a font URL/binary is supplied to `<MLTTProvider>`, the SDK dynamically registers the `@font-face` definition in the document head using the `FontFace` Web API or styled head tag injection.

---

## 6. Mapping Architecture

Mapping configurations adhere to the Phase 1 JSON schema:

```json
{
  "name": "ML-TTKarthika",
  "vendor": "GIST / C-DIT Standard",
  "version": "1.0",
  "mapping": {
    "ക": "I",
    "കേരളം": "tIcfw"
  }
}
```

This decoupled data model guarantees that adding support for new legacy fonts (e.g. `ML-TTRevathi`, `ML-TTAmbili`) requires only loading a new `.json` mapping file, with zero modifications to the core engine.

---

## 7. Client-Side Processing Architecture

We evaluate four processing models:

1. **DOM TreeWalker / MutationObserver**: Walks all rendered DOM text nodes and replaces Unicode text with ML-TT strings.  
   *Assessment*: High risk for Virtual DOM hydration mismatch, screen reader corruption, and high CPU usage.
2. **React Component Wrapper (`<MLText>`)**: Explicitly converts string children during component render and applies font CSS classes.  
   *Assessment*: **RECOMMENDED PRIMARY APPROACH**. Highly performant, memoizable, and SSR-safe.
3. **React Context Automatic Transformer**: Provider scans child elements via React tree traversal.  
   *Assessment*: Useful for subtree processing, but complex with nested custom components.
4. **Build-Time Transformation (Vite Plugin)**: Replaces static JSX strings at compile time.  
   *Assessment*: Ideal for static strings; reserved for `@madhu-mltt/vite`.

---

## 8. Dynamic Content Strategy

For dynamic content such as `useState`, `useQuery`, or array mapping (`items.map(...)`), `<MLText>` processes dynamic string children transparently:

```jsx
const [title, setTitle] = useState("കേരളം");

// Processed during component execution; memoized by string hash
<MLText>{title}</MLText>
```

Text string hashes are cached in an internal `LRUCache` to guarantee sub-millisecond re-render speeds.

---

## 9. SSR & Next.js Considerations

- **Server-Side Execution**: On the server (Node.js/SSR environment), `@madhu-mltt/core` transforms text strings without accessing browser APIs (`window`, `document`).
- **Hydration Safety**: `<MLText>` renders identical transformed text strings on both server and client, avoiding React hydration mismatch errors (`Text content does not match server-rendered HTML`).
- **Client Components**: `<MLTTProvider>` is marked with `'use client'` directive for Next.js App Router compatibility.

---

## 10. Accessibility (A11y) Analysis

Replacing DOM text nodes directly with ML-TT ASCII strings (`tIcfw`) causes screen readers (e.g., NVDA, JAWS, VoiceOver) to pronounce garbled English letters ("t-I-c-f-w").

### Recommended Accessible Architecture
`<MLText>` generates dual accessible markup:

```html
<span class="mltt-wrapper">
  <!-- Visually displayed with ML-TT font -->
  <span aria-hidden="true" class="mltt-font-text">tIcfw</span>
  
  <!-- Accessible to screen readers, copy/paste, and search -->
  <span class="sr-only">കേരളം</span>
</span>
```

This guarantees **100% accessibility compliance**, accurate screen reader pronunciation, correct text copying, and full browser text searching.

---

## 11. SEO Considerations

Search engine crawlers (Googlebot, Bingbot) inspect DOM text content and HTML source.
- Rendering raw ML-TT ASCII (`tIcfw`) corrupts SEO indexing.
- Utilizing the dual accessible markup structure preserves the canonical Unicode Malayalam string (`കേരളം`) in the HTML stream, ensuring search engines index standard Malayalam content.

---

## 12. Performance Considerations

- **LRU String Caching**: Transformed strings are cached in a fixed-size `LRUCache` (e.g., 5,000 entries).
- **Sub-Millisecond Processing**: Cached lookup takes `< 0.01 ms`.
- **Zero Re-Scan Overhead**: Component-level memoization (`React.memo`) prevents repeated conversion passes during unrelated state updates.

---

## 13. Security Considerations

- **No `dangerouslySetInnerHTML`**: String children are transformed as plain text node values.
- **XSS Prevention**: Input text is never evaluated as code or injected as unsanitized HTML markup.

---

## 14. Error Handling

- **Development Mode**: Logs descriptive console warnings for missing mappings or missing font URLs.
- **Production Mode**: Gracefully falls back to rendering standard Unicode Malayalam without breaking the UI layout.

---

## 15. Testing Strategy for Phase 2

1. **Unit Tests**: Test `@madhu-mltt/react` Provider, Context, and `<MLText>` rendering.
2. **Integration Tests**: Verify SSR hydration with React Testing Library.
3. **Accessibility Tests**: Test screen reader tree output with `axe-core`.
4. **Browser Visual Tests**: Validate font rendering in Playwright/Puppeteer.

---

## 16. Future Vite Integration (`@madhu-mltt/vite`)

Future build-time plugin will parse JSX AST (Abstract Syntax Tree) during static production builds, pre-converting static Malayalam text literals at compile time for zero runtime overhead.

---

## 17. Open Questions

1. Should `<MLText>` support an `accessible={false}` prop for legacy high-performance low-memory canvas rendering?
2. Should font loading support automatic Google Fonts fallback for standard Unicode rendering?

---

## 18. Recommended Implementation Plan for Phase 2 / Work 2

1. **Package Setup**: Create `packages/core` and `packages/react` package directories.
2. **Provider & Context**: Implement `<MLTTProvider>` and `useMLTT` hook.
3. **MLText Component**: Implement `<MLText>` with accessible dual-span markup.
4. **Caching & LRU**: Add string memoization cache layer.
5. **Testing Suite**: Create unit and React rendering tests.
