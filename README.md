<a href="https://adrisons.github.io/react-pokemon/" target="_blank">🚀 Deploy</a>

<div align="center">
<h1>Pokemon React App</h1>
</div>

<div align="center">
  <a href="#scripts">Scripts</a>&nbsp;&nbsp;&nbsp;
  <a href="#architecture">Architecture</a>&nbsp;&nbsp;&nbsp;
  <a href="#technical-details">Technical Details</a>&nbsp;&nbsp;&nbsp;
  <a href="#adr">ADR</a>
</div>

---

<div align="center">
<strong>Pokemon React App</strong> is a web app built with React 19 that uses
<a href="https://pokeapi.co">pokeapi.co</a> to display a Pokémon list and detail pages, including evolution chains and abilities.
</div>

---

## Scripts

Uses [`pnpm`](https://pnpm.io/) as the package manager. Requires Node `>=22`.

Run `pnpm install` before running any script.

| Command | Description |
|---|---|
| `pnpm start` | Runs the dev server at `http://localhost:5173` |
| `pnpm build` | Builds for production into `dist/` |
| `pnpm test` | Runs unit tests with Vitest |
| `pnpm test:storybook` | Runs Storybook interaction tests with Playwright |
| `pnpm coverage` | Runs unit tests with coverage report |
| `pnpm preview` | Previews the production build locally |
| `pnpm storybook` | Starts Storybook dev server |
| `pnpm build-storybook` | Builds Storybook for static deployment |
| `pnpm analyze` | Analyzes bundle size with source-map-explorer |

Deploy happens automatically via GitHub Actions on every push to `master`.

---

## Architecture

This project follows a **Hybrid Architecture** (Feature-based + Layered), which balances feature autonomy with shared infrastructure.

### Folder Structure

```
src/
├── app/                          # Global app config
│   ├── App.tsx                   # Root component
│   ├── router.tsx                # Routes (lazy-loaded pages)
│   ├── providers.tsx             # Global providers (Router)
│   └── index.ts
│
├── shared/                       # 100% reusable, business-agnostic code
│   ├── ui/
│   │   └── components/
│   │       ├── Badge/            # Type badge component
│   │       ├── Loading/          # Spinning pokeball loader
│   │       ├── Pagination/       # Previous / Next buttons
│   │       └── ui/               # shadcn/ui primitives
│   ├── constants/
│   │   └── typeColors.ts         # Pokémon type → color map
│   ├── hooks/                    # Generic reusable hooks
│   ├── lib/                      # Utilities (cn, etc.)
│   └── assets/                   # Images (pokeball, logo)
│
├── core/                         # Shared business logic, React-agnostic
│   ├── api/
│   │   ├── httpClient.ts         # Centralized fetch wrapper
│   │   └── httpCache.ts          # In-memory cache with TTL & deduplication
│   └── domain/
│       ├── pokemon/              # Pokemon models, adapters, types
│       └── evolution/            # Evolution chain models, adapters, types
│
├── features/
│   ├── pokemon-list/             # Pokémon list feature
│   │   ├── api/                  # getPokemonList
│   │   ├── store/                # Zustand store (full list cache)
│   │   ├── hooks/
│   │   │   ├── usePokemonList.ts # Fetch list + pagination
│   │   │   └── usePokemonSearch.ts # Client-side search with debounce
│   │   ├── pages/
│   │   │   └── PokemonListPage.tsx
│   │   └── components/
│   │       ├── PokemonList/
│   │       └── PokemonCard/
│   │
│   └── pokemon-detail/           # Pokémon detail feature
│       ├── api/                  # getPokemonDetail, getEvolutionChain
│       ├── hooks/
│       │   ├── usePokemonDetail.ts
│       │   └── useEvolutionChain.ts
│       ├── pages/
│       │   └── PokemonDetailPage.tsx
│       └── components/
│           ├── PokemonPicture/
│           └── EvolutionChain/
│
├── layouts/
│   └── MainLayout.tsx            # Shared page layout shell
│
├── index.tsx                     # Entry point
└── index.css                     # Global styles + Tailwind theme
```

### Layer Definitions

| Layer | What it is | Import rule |
|---|---|---|
| `shared/` | Generic UI components, hooks, utils and constants with zero business logic | No external imports |
| `core/` | Business-agnostic logic: HTTP client, cache, domain models, adapters, validators | Can import `shared/` only |
| `features/` | Domain-specific modules (each is self-contained) | Can import `core/` and `shared/` |
| `app/` | App wiring: router, global providers | Imports from `features/`, `shared/`, `core/` |

### Import Flow (Golden Rule)

```
app/  →  features/  →  core/  →  shared/
```

Each layer only imports **downward** — never upward, never sideways between sibling features.

### Path Aliases

Configured in `vite.config.ts` and `tsconfig.json` for clean imports:

```ts
import { Badge } from '@shared/ui';
import { get } from '@core/api/httpClient';
import { usePokemonList } from '@features/pokemon-list/hooks';
```

---

## Technical Details

- **Framework:** React 19
- **Language:** TypeScript (strict mode, ES2024 target)
- **Build tool:** Vite 6
- **Routing:** React Router v6 (code-split pages via `React.lazy` + `Suspense`)
- **State management:** Zustand v5 (domain cache for the full Pokémon list)
- **Styling:** Tailwind CSS v4 (Vite plugin) + shadcn/ui primitives + Geist font
- **API:** [PokeAPI v2](https://pokeapi.co/api/v2/) with centralized HTTP client and in-memory cache
- **Testing:** Vitest 3 + React Testing Library + Storybook (Playwright for interaction tests)
- **Package manager:** pnpm

### Key Performance Features

- **In-memory HTTP cache** with TTL and in-flight request deduplication (`httpCache.ts`)
- **Zustand domain cache** for the near-static full Pokémon name list (1 h TTL, session-level reuse)
- **Client-side search** with 150 ms debounce over the cached full list
- **Route-level code splitting** with `React.lazy` + `Suspense`

---

## ADR

Architecture Decision Records are stored in [`docs/adr/`](docs/adr/README.md).

| # | Decision |
|---|---|
| [001](docs/adr/001-migrate-yarn-to-pnpm.md) | Migrate from Yarn to pnpm |
| [002](docs/adr/002-upgrade-react-19.md) | Upgrade to React 19 |
| [003](docs/adr/003-feature-based-architecture.md) | Feature-based architecture |
| [004](docs/adr/004-migrate-to-typescript.md) | Migrate to TypeScript |
| [005](docs/adr/005-adopt-tailwind-v4-and-shadcn.md) | Adopt Tailwind v4 + shadcn/ui |
| [006](docs/adr/006-remove-redux-adopt-url-state.md) | Remove Redux, adopt URL state |
| [007](docs/adr/007-storybook-integration.md) | Storybook integration |
| [008](docs/adr/008-client-side-pokemon-search.md) | Client-side Pokémon search |
| [009](docs/adr/009-code-splitting-react-lazy.md) | Code splitting with React.lazy |
| [010](docs/adr/010-in-memory-http-cache.md) | In-memory HTTP cache |
| [011](docs/adr/011-zustand-domain-cache.md) | Zustand domain cache |
