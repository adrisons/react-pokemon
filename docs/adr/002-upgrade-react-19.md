# ADR-002: Upgrade to React 19

**Status:** Accepted
**Date:** 2026-05-07
**Commit:** `55c387c`

## Context

The project was pinned to an older version of React and its ecosystem (react-router-dom, @testing-library/react, react-test-renderer). The broader modernization effort — migrating to Vite, pnpm, TypeScript, and removing Webpack — required moving to dependency versions that are actively maintained and mutually compatible.

Staying on an older React version would have meant:
- Incompatibility with `@testing-library/react` v16+, which aligns with React 19's concurrent rendering model.
- Missing official TypeScript types (`@types/react` v19) required once the TypeScript migration started.
- Continued dependency on legacy patterns (e.g., `ReactDOM.render` instead of `createRoot`) that are removed in React 19.

## Decision

Upgrade React and the entire React ecosystem to versions aligned with **React 19**:

| Package | Role |
|---------|------|
| `react` + `react-dom` | `^19.0.0` |
| `react-router-dom` | `^6.28.0` |
| `@testing-library/react` | `^16.x` |
| `react-test-renderer` | `^19.0.0` |
| `@types/react` + `@types/react-dom` | `^19.x` |

The entry point was updated from `ReactDOM.render()` to `createRoot()` as required by React 19.

## Consequences

- `@testing-library/react` v16 no longer wraps interactions in `act()` automatically in the same way as earlier versions; some test patterns needed updating and snapshots were regenerated.
- No breaking API changes were introduced in the application code itself — the component model (hooks, JSX) is backward compatible.
- `createRoot` is now the only supported rendering API; the legacy `render` API is gone.
- Future React features (Server Components, the `use()` hook, `useOptimistic`, etc.) are available if needed.
