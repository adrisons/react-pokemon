# Design Guidelines

Strict, opinionated rules for every UI change in this repo. **Treat each rule as blocking in code review.** When a rule and an existing file disagree, the rule wins — migrate the file the next time you touch it.

This document is the **single source of truth** for visual, structural, and stylistic decisions. It echoes and extends [CLAUDE.md](../CLAUDE.md) — when both speak, both must be satisfied.

---

## 1. Scope

Applies to everything under:

- `src/features/**`
- `src/shared/ui/**`
- `src/layouts/**`
- `src/app/**` (router-driven shells)
- `src/index.css` (tokens, layers, keyframes)

Out of scope: pure logic (`src/core/**`), hooks without DOM, tests, fixtures.

**Rollout:** all **new** components and any **modified** file must comply. Drive-by refactors of untouched files are not required but welcome.

---

## 2. Stack invariants (echoed from CLAUDE.md)

| Concern | Mandated |
|---|---|
| Styling | Tailwind v4 utilities — no bespoke `.css` files, **no inline `style`** (see §9) |
| UI primitives | shadcn in `src/shared/ui/components/ui/` — add via `pnpm dlx shadcn add <component>` |
| Class merge / variants / icons | `cn()` (clsx + tailwind-merge), `cva()` for variants, `lucide-react` only |
| Domain state | Zustand, one store per feature — no Redux, no React Context for global state |
| HTTP | `cachedFetch` from `src/core/api/httpCache.ts` — never direct `fetch()` |
| Layout | Vertical slices in `src/features/`; cross-cutting in `src/shared/` or `src/core/` |
| Imports | `@shared`, `@features`, `@core`, `@app`, `@layouts` — avoid long relative paths |

**Cascade when adding UI:** existing shadcn primitive → Tailwind utilities + `cn()` → extend with `cva()` if variants → `lucide-react` for icons.

---

## 3. Tokens & theming

The only place tokens are declared is the `@theme` block in [`src/index.css`](../src/index.css).

**Rules**

- ❌ Do not add tokens to `:root` (the legacy `--white`, `--gray-*`, `--yellow`, `--blue` block is frozen and will be removed; never reference it from new code).
- ❌ Do not hardcode hex / rgb / hsl in TSX, CSS, or inline `style`.
- ✅ Consume tokens via Tailwind utility (`bg-dark-800`, `text-accent-gold`) or `var(--token)` inside CSS layers.
- ✅ Adding a new shade or scale step? Define it in `@theme` first, then use it.

**✅ Do**

```tsx
<div className="bg-dark-800 border border-dark-600 text-accent-gold">…</div>
```

**❌ Don't** ([`PokemonCard.tsx:78`](../src/features/pokemon-list/components/PokemonCard/PokemonCard.tsx#L78))

```tsx
style={{ background: `linear-gradient(135deg, ${typeColor}15 0%, #13131f 45%, #0d0d14 100%)` }}
```

---

## 4. Typographic scale (semantic)

Stop using arbitrary `text-[0.65rem]` / `text-[0.8rem]` / `text-[0.85rem]`. Declare semantic font sizes in `@theme` and use them by name. Required scale:

| Token | Use |
|---|---|
| `text-display` | Hero / landing title (1 per page max) |
| `text-h1` | Page title |
| `text-h2` | Major section heading |
| `text-h3` | Sub-section heading |
| `text-body` | Default paragraph copy |
| `text-label` | Inline labels, badges, chips |
| `text-caption` | Metadata, helper text |
| `text-mono` | IDs, numeric stats (uses `font-pixel`) |

**Rules**

- ❌ No `text-[0.xxrem]` arbitrary values.
- ❌ Don't reuse `h2` styling for `h3` content (visual weight must match level).
- ✅ Variant tokens belong in `@theme` as `--text-*` + matching utility.

**❌ Don't** ([`EvolutionChain.tsx:25`](../src/features/pokemon-detail/components/EvolutionChain/EvolutionChain.tsx#L25))

```tsx
<h2 className="text-[1rem] uppercase tracking-[0.14em] …">Evolution Chain</h2>
```

---

## 5. Spacing scale

Use the 4-base Tailwind scale: `1, 2, 3, 4, 6, 8, 12, 16, 24`. **Forbidden:**

- ❌ Decimal increments (`gap-1.5`, `gap-2.5`, `p-2.5`) — pick the adjacent integer.
- ❌ Off-scale values (`mb-10`, `mt-7`) — use `mb-8` / `mb-12`.
- ❌ Stacked margins between siblings (`mt-12` + parent `mt-8`) — pick one, prefer parent-driven `space-y-*` / `gap-*`.
- ❌ Arbitrary `gap-[0.4rem]`, `p-[0.85rem]` — promote to a scale step.

**❌ Don't** ([`Pagination.tsx:11`](../src/shared/ui/components/Pagination/Pagination.tsx#L11) + caller wrapper)

```tsx
<div className="mt-10 …"> {/* off-scale, also stacked with caller's mt-8 */}
```

**✅ Do**

```tsx
<section className="space-y-8"> { /* pagination has no margin of its own */ } </section>
```

---

## 6. Semantic hierarchy

Every page must have:

- Exactly **one `<h1>`**.
- Heading cascade `h1 → h2 → h3` with **no skipped levels**.
- A single `<main>`; navigation in `<header>` / `<nav>` inside `MainLayout`.
- Sections wrapped in `<section aria-labelledby="…">` (or `<article>` for self-contained content) anchored to the heading id.

**Page-by-page contract**

- **List** ([`PokemonListPageView.tsx`](../src/features/pokemon-list/pages/PokemonListPageView.tsx)): `h1` = "Browse the Collection". Recently Viewed, Grid, and Pagination are siblings inside `<main>`. Search is a `<search>` landmark.
- **Detail** ([`PokemonDetailPage.tsx`](../src/features/pokemon-detail/pages/PokemonDetailPage.tsx)): `h1` = Pokémon name. Base Stats / Abilities / Evolution Chain are `h2` (not `h3`). Sub-blocks inside a section can use `h3`.
- **Compare** (`ComparePage.tsx`): `h1` = "Compare". Each Pokémon column is a `<section>` with `aria-label`. Insights and stats are `h2` siblings.

**❌ Don't** ([`EvolutionChain.tsx:25`](../src/features/pokemon-detail/components/EvolutionChain/EvolutionChain.tsx#L25)) — `h2` used while the parent page section uses `h3`, breaking the cascade.

---

## 7. Required UI states

Any view that fetches or derives async data must render **all four** of these explicitly:

| State | Treatment |
|---|---|
| `loading` | `Loading` (or `Skeleton` with `animate-shimmer`) — never blank. |
| `error` | Distinct color & icon (red-tinted border + alert role). **Not** `text-muted`. |
| `empty` | Friendly message + suggested action if any. |
| `idle` / `initial` | When user hasn't acted yet (e.g. empty search) — neutral, no error styling. |

Error and empty must be visually distinct. Use `role="alert"` for errors.

**✅ Reference** — [`PokemonListPageView.tsx:48-63`](../src/features/pokemon-list/pages/PokemonListPageView.tsx#L48-L63) (error) and `:112-122` (empty) get this right; replicate the pattern.

---

## 8. Components & variants

**Buttons**

- All buttons go through [`src/shared/ui/components/ui/button.tsx`](../src/shared/ui/components/ui/button.tsx) with `cva`.
- Required variants: `primary` (gold gradient), `secondary` (dark + gold border), `ghost`, `link`.
- Required sizes: `sm | md | lg | icon`.
- ❌ No hand-rolled `btnClass` strings ([`Pagination.tsx:6`](../src/shared/ui/components/Pagination/Pagination.tsx#L6)).
- ❌ No per-call long `className` chains that re-implement an existing variant ([`PokemonCard.tsx:192`](../src/features/pokemon-list/components/PokemonCard/PokemonCard.tsx#L192), [`PokemonDetailPage.tsx:36`](../src/features/pokemon-detail/pages/PokemonDetailPage.tsx#L36)).

**Badges**

- Use [`src/shared/ui/components/ui/badge.tsx`](../src/shared/ui/components/ui/badge.tsx) with a `type` variant for Pokémon types.
- Type color enters via the `--type-color` CSS var (see §9), never as inline `borderLeftWidth` or inline `background`.

**Cards**

- Use shadcn `Card` slot-based primitives. Do not recreate the shell.

**Icons**

- `lucide-react` only. Sizes from the scale: `size-3 | size-4 | size-5 | size-6`.
- ❌ No emojis as icons in interactive controls (`⚔`, `→`, `←` etc.) — replace with `lucide-react` when refactoring.

---

## 9. Inline `style` — the single allowed escape hatch

**Rule:** `style={{ … }}` is forbidden, **except** to inject CSS custom properties consumed by Tailwind classes or by `src/index.css` layers.

✅ Allowed (CSS variable injection only)

```tsx
<div
  style={{ "--type-color": typeColor, "--mouse-x": `${x}%` }}
  className="bg-[var(--type-color)] [box-shadow:0_0_24px_var(--type-color)]"
/>
```

❌ Forbidden (every example below is a current violation to fix on next touch)

```tsx
// PokemonCard.tsx:73-80 — gradients and shadows as inline style
style={{ background: `linear-gradient(135deg, ${typeColor}80 …)` }}
style={{ boxShadow: "inset 0 1px 0 rgba(255,215,0,0.15) …" }}

// PokemonCard.tsx:114-119 — width / filter on <img>
style={{ width: '75%', height: '75%', filter: `drop-shadow(0 4px 12px ${typeColor}50)` }}

// PokemonCard.tsx:171, 178-181 — stat color via style
style={{ color: STAT_COLORS[stat.name] }}
style={{ width: `${pct}%`, backgroundColor: STAT_COLORS[stat.name] }}

// EvolutionChain.tsx:48-59 — conditional border / background / shadow
style={{ border: isCurrent ? "2px solid …" : "2px solid …", background: … }}

// PokemonDetailPage.tsx:97-101 — stat bar gradient + shadow
style={{ backgroundColor: STAT_COLORS[stat.name], boxShadow: `0 0 8px …` }}
```

**Migration recipe**

1. Move the dynamic value into a CSS variable (`style={{ "--stat-color": STAT_COLORS[stat.name] }}`).
2. Consume it via Tailwind: `bg-[var(--stat-color)]`, `text-[var(--stat-color)]`, `shadow-[0_0_8px_var(--stat-color)]`, or via a class in `@layer components` if reused.
3. Express conditional state with `cn()` and classes, not with a ternary inside `style`.

**No bespoke `.css` files.** If you genuinely need a new component layer (3D transforms, mouse-tracked gradients), extend `src/index.css` under `@layer components` with a brief comment justifying why utilities cannot express it.

---

## 10. `cn()` everywhere conditional

- ✅ `cn("base classes", isActive && "ring-2 ring-accent-gold", disabled && "opacity-50")`
- ❌ Template-literal concatenation: ``` `${btnClass} ${active ? "x" : "y"}` ``` ([`Pagination.tsx:15`](../src/shared/ui/components/Pagination/Pagination.tsx#L15) pattern).
- ❌ String `+` concatenation of classes.

Never ship a `!important` override (`!bg-…`) without a `// why` comment — they are escape hatches, not patterns.

---

## 11. Accessibility minimums (blocking)

- **Focus**: every interactive element has `focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900` (or equivalent baked into the shadcn variant). No exceptions.
- **Contrast**: body text ≥ 4.5:1. `text-text-muted` (`#6868aa` on `#0d0d14` ≈ 3.2:1) is allowed **only** for non-critical metadata. Error messages, form labels, disabled states must use a higher-contrast color.
- **Alt text**: meaningful or `alt=""` for purely decorative. Never `alt="image"`.
- **Touch targets**: ≥ 40×40 px for any tap target.
- **ARIA**: composite controls use proper roles (`role="alert"`, `aria-labelledby`, `aria-pressed`, etc.). Never invent ARIA — use the spec.
- **Keyboard**: every flow must be navigable without a mouse. Hover-only affordances are forbidden.

---

## 12. Motion

- Use only the keyframes & `--animate-*` tokens defined in [`src/index.css`](../src/index.css). Add new ones to `@theme` if necessary; never declare keyframes locally.
- Respect reduced motion: prefix non-essential animations with `motion-safe:` (e.g. `motion-safe:animate-card-entry`).
- Hover micro-interactions (`hover:-translate-y-px`) require `motion-safe:`.
- Don't animate properties that trigger layout (`width`, `height`, `top`, `left`) — animate `transform` and `opacity`.

---

## 13. Selectors & tests

(Echoes CLAUDE.md.)

- `data-testid` only — never `data-test`.
- Place `data-testid` on the component **root** and on **directly interactive targets** (buttons, inputs, links). Don't bury it on internal `<span>`s.
- When changing props / markup, update co-located `*.test.tsx`, `*.stories.tsx`, and (if a covered flow changes) `src/__tests__/e2e/`.
- Snapshots: delete stale `*.snap`, never hand-edit; let the next test run regenerate.

---

## 14. HTTP & domain boundary

(Echoes CLAUDE.md.)

- The external API base URL lives only in [`src/core/api/httpClient.ts`](../src/core/api/httpClient.ts).
- Feature API modules call `get()` / `invalidateGet()` with relative paths.
- Hooks and components never reference raw API URLs and never call `fetch` directly.

---

## 15. PR checklist

Reviewers must verify every box before approving a UI-touching PR.

- [ ] No new `style={{ … }}` except CSS variable injection (`"--*": value`).
- [ ] No new hex/rgb/hsl outside `@theme`.
- [ ] No arbitrary `text-[...]` or off-scale spacing.
- [ ] Buttons / badges use shadcn primitives with `cva` variants.
- [ ] Page has exactly one `<h1>`; headings cascade without gaps.
- [ ] All async views render `loading` / `error` / `empty` / `idle` distinctly.
- [ ] Every interactive element has a visible focus ring.
- [ ] Animations use `@theme` tokens and `motion-safe:`.
- [ ] `data-testid` placed on root + interactive targets; tests & stories updated.
- [ ] No raw API URLs in components/hooks; no direct `fetch`.
- [ ] No new `.css` file; if `@layer components` was extended, a one-line comment justifies it.

---

## Appendix A — Quick reference of current violations

These files violate the rules today. Fix when next modified.

| File | Rule(s) | Note |
|---|---|---|
| [`PokemonCard.tsx`](../src/features/pokemon-list/components/PokemonCard/PokemonCard.tsx) | §3, §8, §9, §11 | Inline gradients, bespoke button, `h-100 h-96` dead class on line 85 |
| [`Pagination.tsx`](../src/shared/ui/components/Pagination/Pagination.tsx) | §5, §8, §10 | `btnClass` template, off-scale `mt-10` |
| [`EvolutionChain.tsx`](../src/features/pokemon-detail/components/EvolutionChain/EvolutionChain.tsx) | §4, §6, §9 | `h2` breaks cascade, conditional inline `style` |
| [`PokemonDetailPage.tsx`](../src/features/pokemon-detail/pages/PokemonDetailPage.tsx) | §3, §4, §8, §9 | Inline shadow/color on stat bars, hand-rolled buttons, arbitrary `text-[…]` sizes |

When in doubt, **don't extend the violation** — wrap the file in a refactor and bring it up to spec.
