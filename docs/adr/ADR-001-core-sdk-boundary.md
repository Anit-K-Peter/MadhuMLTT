# ADR-001: Core and SDK Package Boundary Separation

## Context
Madhu ML TT encompasses both a pure text conversion engine and future framework-specific developer SDKs (such as React and Vite integrations).

## Decision
We establish a strict monorepo package boundary:
1. `@madhu-mltt/core`: Framework-independent, zero-dependency conversion engine running in standard Node.js, Web Workers, or browsers.
2. `@madhu-mltt/react`: React integration layer containing Context Provider, Hooks, and Component wrappers.
3. `@madhu-mltt/vite`: Build-time plugin for pre-rendering or static asset generation.

## Rationale
- Prevents bundling React or DOM APIs into backend Node.js microservices or CLI utilities.
- Guarantees `core` can be unit tested without virtual DOM overhead.
- Allows independent versioning and lightweight package distribution.

## Status
Approved.
