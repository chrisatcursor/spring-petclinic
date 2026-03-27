---
name: pr-composition
description: Standardizes pull request titles and bodies for PetClinic demo work. Use when opening or drafting PRs for this repository.
---

# PR Composition Skill

Use this skill when composing pull requests for migration batches or demo scaffolding updates. Follow this format for consistency.

## Target repository

- **Always** target `chrisatcursor/spring-petclinic` (Chris at Cursor fork).
- **Never** target `spring-projects/spring-petclinic`.

When using GitHub CLI:

```bash
gh pr create --repo chrisatcursor/spring-petclinic
```

## PR title format

```
[Batch N] <brief description>
```

Examples:

- `[Scaffolding] Add Playwright harness and Cursor rules`
- `[E2E] Add data-testid attributes for owner search`
- `[React] Owner list page with REST integration`

## PR body template

```markdown
## Summary

<1–3 sentences>

## Scope

- <what changed>

## Migration / demo notes

- <decisions, constraints, links to skills or plan>

## Test results

- **Maven**: `./mvnw verify` — <pass/fail, test count if noted>
- **E2E** (if applicable): `npm run test:e2e` — <pass/fail>

## Human review flags

- [ ] <security, data handling, or behavior-sensitive areas>
- [ ] <anything that might affect URL or E2E contract>

If none: **No items flagged for human review.**
```

## Rules

- Confirm `git remote -v` shows the fork before push.
- If tests fail, say so explicitly; do not merge broken PRs for demo tracks.
