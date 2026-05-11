# AI Agent Guide

**Assume:** build/tests/typecheck/lint do not pass until proven.

---

## Prompting (user — fewer tokens & fewer turns)

- **Goal first**, then acceptance criteria (“must / must not”) in bullets.
- **Scope with `@files` paths** or small excerpts; avoid pasting whole files unless the task is repo-wide.
- **One primary outcome per message**; group only tightly related edits in the same prompt.
- **Say what to skip**: “touch only X”, “no tests”, “docs later” — reduces unnecessary work and reply size.
- For follow-ups: **point to changed symbols or line anchors** (“extend `Foo` like we did for `Bar`”) instead of re-explaining context.

---

## Agent replies & edits

- Short answers; no repeated restatements of the user brief.
- Targeted edits, not whole-file dumps; cite code with fenced blocks trimmed with `…` where possible.
- Warn before unusually long replies or listing entire files verbatim.

---

## Language

- All **comments and documentation in repository code**: English.
- Explanatory chat text: **match the user’s language** unless they ask for English.

---

## Validation / shell (“heavy”)

Heavy = full `pnpm test`, `pnpm build`, project-wide typecheck/e2e, pre-commit hooks.

- Never run heavy commands without **why** + **explicit user confirmation**.
- Prefer **scoped** checks (single file/dir) unless bundling, global typings, or end-to-end integration requires more.
- On hook or command failure: show the failure + **exact** retry command; do **not** auto-retry heavy commands.

---

## Commits

1. List recommended checks (manual or agent); ask whether to run them or skip.
2. Wait for explicit confirmation before heavy runs.
3. After user confirms checks passed: `git add` + `git commit`.

---

## Tests & selectors

When changing components, hooks, utils, or APIs, update in sync:

| Area | Action |
|------|--------|
| Unit | Co-located `*.test.ts(x)` for changed behavior |
| Snapshots | Delete stale `*.snap`; regenerate on next test run — never hand-edit |
| Storybook | `*.stories.tsx` if props/variants/behavior changed |
| E2E | `src/__tests__/e2e/` if a covered user flow changed |

**Selectors:** `data-testid` only (not `data-test`). Root of component + direct interactive targets.

Flag explicitly if any of the above is intentionally unchanged.

---

## Stack (no overlapping libraries)

| Concern | Mandated |
|---------|----------|
| Styling | Tailwind v4 utilities — no bespoke CSS files, no inline `style` |
| UI primitives | shadcn in `src/shared/ui/components/ui/` — `pnpm dlx shadcn add <component>` |
| Class merge / variants / icons | `cn()` (clsx + tailwind-merge), `cva()` for variants, `lucide-react` only |
| Domain state | Zustand, one store per feature — no Redux; no React Context for global app state |
| HTTP | `cachedFetch` from `src/core/api/httpCache.ts` — no direct `fetch()` |
| Layout | Vertical slices in `src/features/`; cross-cutting in `src/shared/` or `src/core/` |
| Imports | Aliases `@shared`, `@features`, `@core`, `@app`, `@layouts` — avoid long relative paths |

**New or edited UI:** prefer existing shadcn primitive → Tailwind + `cn()` → CVA if variants → lucide for icons.

---

## When proposing commands

1. Reason (one line).  
2. Smallest command.  
3. Heavier option if needed.  
4. Ask for confirmation.
