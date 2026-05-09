# ADR-005: Adopt Tailwind CSS v4 and shadcn/ui

**Status:** Accepted
**Date:** 2026-05-08
**Commit:** `637a6b3`

## Context

After the Sass-to-plain-CSS migration (an earlier interim step), styles were written as hand-crafted CSS files with CSS custom properties for design tokens. While this removed the `node-sass` build dependency, it did not solve the underlying scaling problem:

- Adding new components required writing bespoke CSS classes with no system-level consistency.
- Theming (colors, spacing, typography) was managed via CSS variables in `index.css`, but there was no enforcement that components actually used those variables.
- Reusable UI primitives (buttons, badges, cards) had to be built and maintained from scratch.
- No design system baseline meant UI consistency depended on developer discipline.

Two alternatives were considered:

| Option | Pros | Cons |
|--------|------|------|
| Continue with plain CSS | Zero tooling | Does not scale; no consistency enforcement |
| Material UI / Chakra | Rich component set | Runtime JS overhead; opinionated theming; hard to customize |
| **Tailwind CSS v4 + shadcn/ui** | Utility-first; zero runtime; fully ownable primitives | Learning curve; verbose JSX |

## Decision

Adopt **Tailwind CSS v4** as the styling system and **shadcn/ui** for UI primitives.

**Tailwind CSS v4** is integrated via the official Vite plugin (`@tailwindcss/vite`), which requires no PostCSS configuration file — Tailwind is processed as part of the Vite pipeline. This is a significant simplification over Tailwind v3.

**shadcn/ui** provides a code-generation CLI (`shadcn`) that scaffolds component source files (card, badge, button, etc.) directly into `src/shared/ui/components/ui/`. These files are owned by the project — they are not imported from a package at runtime. `components.json` stores the shadcn configuration (style, path aliases, base color).

Key dependencies added:
- `class-variance-authority` (CVA) — type-safe variant API for component variants
- `clsx` + `tailwind-merge` — utility for merging class names without conflicts
- `lucide-react` — icon set used by shadcn components

## Consequences

- All new UI should be built with Tailwind utility classes; bespoke CSS files are no longer the primary styling mechanism.
- shadcn components in `src/shared/ui/components/ui/` can be freely edited — they are not "owned" by shadcn after generation.
- The Tailwind v4 Vite plugin produces a single CSS output; there is no separate PostCSS build step.
- This ADR supersedes the earlier interim decision to use plain CSS custom properties for styling; the design-token approach (CSS variables) is now handled by Tailwind's theme configuration.
- `tw-animate-css` and `@base-ui/react` are included for animation utilities and accessible primitives respectively.
