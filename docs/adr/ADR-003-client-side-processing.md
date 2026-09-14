# ADR-003: Targeted Component Wrapping vs. Global DOM Mutation

## Context
Rendering legacy ML-TT Malayalam text requires transforming Unicode input into ML-TT encoded character streams. Two primary runtime mechanisms exist:
1. Global DOM Mutation Observer (scanning and mutating all text nodes).
2. Explicit React Component Wrappers (`<MLText>`) and Context Provider (`<MLTT>`).

## Decision
We select **Controlled Component Wrappers (`<MLText>`) and Context Provider (`<MLTT>`)** as the primary SDK architecture, while reserving DOM TreeWalker / MutationObserver strictly as an opt-in legacy compatibility mode.

## Rationale
- **Accessibility & Copy/Paste**: Directly mutating DOM text nodes replaces Unicode Malayalam with gibberish English ASCII (`tIcfw`), breaking screen readers, text selection, copy/paste, and search indexing.
- **React Hydration & VDOM Reconciliation**: Mutating DOM text nodes outside React's Virtual DOM causes hydration mismatch warnings and state reconciliation bugs in Next.js/SSR applications.
- **Performance**: Component-level memoization avoids continuous full-DOM MutationObserver tree walks during high-frequency React state updates.

## Status
Approved.
