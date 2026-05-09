# Architecture Decision Records

This directory contains the Architecture Decision Records (ADRs) for the react-pokemon project.

ADRs document significant technical decisions made during the project lifecycle — what was decided, why, and what trade-offs were accepted. They follow the [Michael Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

## Format

Each ADR file is named `NNN-short-title.md` and contains:

- **Status** — Accepted / Superseded / Deprecated
- **Date** — When the decision was made
- **Context** — The forces at play that motivated the decision
- **Decision** — What was decided
- **Consequences** — What becomes easier, harder, or different as a result

## Index

| ADR | Title | Date | Status |
|-----|-------|------|--------|
| [ADR-001](001-migrate-yarn-to-pnpm.md) | Migrate from Yarn to pnpm | 2026-05-07 | Accepted |
| [ADR-002](002-upgrade-react-19.md) | Upgrade to React 19 | 2026-05-07 | Accepted |
| [ADR-003](003-feature-based-architecture.md) | Feature-based Architecture | 2026-05-07 | Accepted |
| [ADR-004](004-migrate-to-typescript.md) | Migrate to TypeScript | 2026-05-08 | Accepted |
| [ADR-005](005-adopt-tailwind-v4-and-shadcn.md) | Adopt Tailwind CSS v4 and shadcn/ui | 2026-05-08 | Accepted |
| [ADR-006](006-remove-redux-adopt-url-state.md) | Remove Redux, adopt URL-based Pagination State | 2026-05-08 | Accepted |
| [ADR-007](007-storybook-integration.md) | Storybook Integration | 2026-05-08 | Accepted |
| [ADR-008](008-client-side-pokemon-search.md) | Client-side Pokémon Search with Debounce | 2026-05-08 | Accepted |
| [ADR-009](009-code-splitting-react-lazy.md) | Code Splitting with React.lazy and Suspense | 2026-05-08 | Accepted |
| [ADR-010](010-in-memory-http-cache.md) | In-memory HTTP Cache with Deduplication | 2026-05-08 | Accepted |
| [ADR-011](011-zustand-domain-cache.md) | Zustand as Domain-layer Cache for Quasi-static Data | 2026-05-09 | Accepted |
