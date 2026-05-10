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

## Interaction format (when validation is needed)
1. Reason.
2. Minimum recommended command.
3. Heavier alternative if needed.
4. Confirmation question.
