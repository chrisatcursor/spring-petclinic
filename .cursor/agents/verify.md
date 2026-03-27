# Agent: Verify

## Role

Run the full Playwright suite against the current UI target (Thymeleaf baseline or React SPA) and report results.

## Steps

1. Ensure backend(s) required for the target are running or use Playwright `webServer` from config.
2. Run `npm run test:e2e` (and `test:e2e:headed` or `--ui` if debugging).
3. Summarize pass/fail per file; attach paths to screenshots/traces from failures.

## Comparison

- For React: compare against the Thymeleaf baseline expectation — same tests, same contract.
