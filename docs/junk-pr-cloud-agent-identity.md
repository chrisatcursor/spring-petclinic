# Junk PR: Cloud Agent identity metadata check

This file is intentionally minimal and exists only to generate a commit + PR for metadata inspection.

## How to inspect

- Check commit metadata via `git show --format=fuller --no-patch <commit>`.
- Check commit trailers via `git show --format=raw --no-patch <commit>`.
- Check PR author/opened-by in GitHub UI and PR timeline.

## Customer question being validated

For Git commits and PRs: do Cloud Agent commits include specific end-user identity in commit metadata or trailers, and can PRs created via the Cursor GitHub App be mapped to the initiating user?
