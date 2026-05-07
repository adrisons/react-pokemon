<a href="https://adrisons.github.io/react-pokemon/" target="_blank">🚀 Deploy</a>

<div align="center">
<h1>Pokemon React App</h1>
</div>

<div align="center">
  <a href="#scripts">Scripts</a>&nbsp;&nbsp;&nbsp;
  <a href="#architecture">Architecture</a>&nbsp;&nbsp;&nbsp;
  <a href="#technical-details">Technical Details</a>&nbsp;&nbsp;&nbsp;
</div>

---

<div align="center">
<strong>Pokemon React App</strong> is a web app built with React that uses
<a href="https://pokeapi.co">pokeapi.co</a> to display a Pokémon list and detail pages.
</div>

---

## Scripts

Uses [`pnpm`](https://pnpm.io/) as the package manager.

Run `pnpm install` before running any script.

| Command | Description |
|---|---|
| `pnpm start` | Runs the dev server at `http://localhost:5173` |
| `pnpm build` | Builds for production into `dist/` |
| `pnpm test` | Runs all tests with Vitest |
| `pnpm preview` | Previews the production build locally |

Deploy happens automatically via GitHub Actions on every push to `master`.

---

## Architecture

This project follows a **Hybrid Architecture** (Feature-based + Layered), which balances feature autonomy with shared infrastructure.

### Folder Structure

```
src/
├── app/                          # Global app config
│   ├── App.jsx                   # Root component
│   ├── router.jsx                # All routes
│   ├── store.js                  # Redux store (global)
│   ├── providers.jsx             # Global providers (Redux, Router)
│   └── index.js
│
├── shared/                       # 100% reusable, business-agnostic code
│   ├── ui/
│   │   └── components/
│   │       ├── Badge/            # Type badge component
│   │       ├── Loading/          # Spinning pokeball loader
│   │       └── Pagination/       # Previous / Next buttons
│   ├── constants/
│   │   └── typeColors.js         # Pokémon type → color map
│   ├── hooks/                    # Generic reusable hooks
│   ├── utils/                    # Pure utility functions
│   ├── styles/
│   │   └── colors.css            # CSS custom properties
│   └── assets/                   # Images (pokeball, logo)
│
├── core/                         # Shared business logic, React-agnostic
│   ├── api/
│   │   └── httpClient.js         # Centralized fetch wrapper
│   └── domain/
│       ├── models/               # JSDoc type definitions
│       ├── adapters/             # Data transformers (API → Domain)
│       │   └── pokemonAdapter.js # getPokemonImageUrl, getPokemonIdFromUrl
│       └── validators/           # Data validation functions
│
├── features/
│   └── pokemon/                  # Self-contained Pokémon feature
│       ├── api/
│       │   └── pokemonApi.js     # getPokemonList, getPokemonDetail
│       ├── store/                # Redux slice (actions, reducer, selectors)
│       ├── hooks/
│       │   ├── usePokemonList.js # Fetch list + pagination logic
│       │   └── usePokemonDetail.js
│       ├── pages/
│       │   ├── PokemonListPage.jsx
│       │   └── PokemonDetailPage.jsx
│       ├── components/
│       │   ├── Navbar/
│       │   ├── PokemonList/
│       │   └── PokemonPicture/
│       ├── constants/
│       └── index.js              # Barrel export
│
├── layouts/
│   └── MainLayout.jsx            # Shared page layout shell
│
├── index.jsx                     # Entry point
└── index.css                     # Global styles
```

### Layer Definitions

| Layer | What it is | Import rule |
|---|---|---|
| `shared/` | Generic UI components, hooks, utils and constants with zero business logic | No external imports |
| `core/` | Business-agnostic logic: HTTP client, domain models, adapters, validators | Can import `shared/` only |
| `features/` | Domain-specific modules (each is self-contained) | Can import `core/` and `shared/` |
| `app/` | App wiring: router, global store, providers | Imports from `features/`, `shared/`, `core/` |

### Import Flow (Golden Rule)

```
app/  →  features/  →  core/  →  shared/
```

Each layer only imports **downward** — never upward, never sideways between sibling features.

### Path Aliases

Configured in `vite.config.js` for clean imports:

```js
import { Badge } from '@shared/ui';
import { getPokemonImageUrl } from '@core/domain/adapters';
import { usePokemonList } from '@features/pokemon/hooks';
```

---

## Technical Details

- **Framework:** React 19
- **Build tool:** Vite 6
- **Routing:** React Router v6
- **State management:** Redux (actions/reducer/selectors) + `reselect`
- **API:** [PokeAPI v2](https://pokeapi.co/api/v2/pokemon/)
- **Testing:** Vitest + React Testing Library + react-test-renderer (snapshots)
- **Styling:** Plain CSS with CSS custom properties (no preprocessor)
- **Package manager:** pnpm
