# AI Agent Guide

**IMPORTANT:** Never assume build, tests, typecheck, or lint will pass.

## Language
- All code comments and documentation must be in **English**.

## Token efficiency
- Be concise. Avoid verbose explanations or redundant output.
- Prefer targeted edits over full-file rewrites.
- Never output large blobs of unchanged code.
- Warn before generating long output.

## Validation rules
- Never run expensive commands (`pnpm test`, `pnpm build`, `typecheck`, full e2e, pre-commit) without explaining why and getting explicit confirmation.
- Prefer file-scoped checks over full-suite runs.
- Prefer lint/typecheck of affected files over full project.
- Only run full build if bundling, global types, or final integration is affected.

## Commit flow
1. Summarize recommended checks for me to run manually.
2. Ask if I want to run them or authorize you to run them.
3. Wait for explicit confirmation before running anything heavy.
4. If I confirm checks passed, proceed with `git add` + `git commit`.

## Error handling
- On pre-commit hook failure: show what failed, suggest the exact command, wait for confirmation.
- Never auto-retry heavy commands after failure.

## Test selectors
- Always use `data-testid` (never `data-test` or other variants) for Playwright/testing-library selectors.
- Place `data-testid` on the outermost element of a component and on any interactive sub-elements that tests need to target directly.

## Testing files maintenance
When modifying a component, hook, utility, or API:
- **Unit tests**: update or add tests in the co-located `*.test.ts(x)` file covering the changed logic.
- **Snapshots**: if a snapshot exists for the changed component, delete the outdated `.snap` file so it is regenerated on the next test run (never hand-edit snapshots).
- **Storybook**: update the corresponding `*.stories.tsx` file to reflect any changed props, variants, or behavior.
- **E2E**: update `src/__tests__/e2e/` specs if the change affects a user-facing flow already covered there.

Do not skip any of the above; flag it explicitly if a test file is intentionally left unchanged.

## Interaction format (when validation is needed)
1. Reason.
2. Minimum recommended command.
3. Heavier alternative if needed.
4. Confirmation question.
