# User Acceptance Testing — Thymeleaf → React SPA Migration

**Branch:** `migration/react-grind`
**Application under test:** Vite + React SPA on `http://localhost:8080`
**API backend:** `spring-petclinic-rest` at `http://localhost:9966/petclinic/api`
**Automated acceptance:** Playwright suite in `e2e/`

## Objectives

Confirm the React SPA preserves Thymeleaf behavior for every user-facing flow:
URLs, visible copy, form validation, flash messages, `data-testid` hooks,
navigation, and persisted domain operations through the REST API backend.

## Preconditions

| Requirement | Command / check |
| ----------- | --------------- |
| Node ≥ 18 | `node -v` |
| Frontend deps | `npm ci --prefix frontend` |
| REST API | Start `spring-petclinic-rest` on port 9966 and confirm `/petclinic/api/owners` responds with 10 owners |
| Vite dev server | `npm run dev --prefix frontend` → `http://localhost:8080` |
| Automated gate | `npx playwright test` from repo root |

The REST backend resets its in-memory H2 database on every startup, so
restart it (Ctrl-C → `./mvnw spring-boot:run`) before each repeat UAT/test
sweep that you want to start from a clean slate.

## Manual walkthrough matrix

| ID | Area | Steps | Expected result |
| -- | ---- | ----- | --------------- |
| UAT-01 | Home | Open `/` | "Welcome" heading; pets image visible |
| UAT-02 | Navigation | Use nav: Home, Find Owners, Vets, Error | URLs: `/`, `/owners/find`, `/vets.html`, `/oups` |
| UAT-03 | Error demo | Open `/oups` | "Something happened..." error page |
| UAT-04 | 404 | Open `/nonexistent` | Error page with "The requested page was not found." |
| UAT-05 | Owner search | `/owners/find` → empty search | `/owners` list with 5 rows |
| UAT-06 | Owner search | Search "Davis" | 2 owners (Betty, Harold) |
| UAT-07 | Owner search | Search "Franklin" | Redirect to `/owners/1` detail |
| UAT-08 | Owner search | Search "Zzzzz" | "has not been found" message |
| UAT-09 | Owner detail | `/owners/1` | George Franklin, address, phone, Leo pet |
| UAT-10 | Owner create | `/owners/new` → valid form → submit | Redirect to new owner; "New Owner Created" flash |
| UAT-11 | Owner edit | `/owners/1/edit` → change phone | "Owner Values Updated"; new phone on detail |
| UAT-12 | Owner validation | Blank `/owners/new` submit | Form stays; `.has-error` visible |
| UAT-13 | Owner validation | Invalid phone on new owner | "must be a 10-digit number" error |
| UAT-14 | Pet add | Owner 1 → Add Pet → valid pet | "New Pet has been Added"; pet on detail |
| UAT-15 | Pet duplicate | Add pet named "Leo" | "is already in use"; form remains |
| UAT-16 | Pet date | Future birth date | "invalid date"; form remains |
| UAT-17 | Pet edit | Edit first pet → rename | "Pet details has been edited" |
| UAT-18 | Visit add | Owner 6 → Samantha → Add Visit | "Your visit has been booked" |
| UAT-19 | Visit list | Add visit with description | Description visible on owner detail |
| UAT-20 | Vets list | `/vets.html` | Table with 5 vets; specialties shown |
| UAT-21 | Vets pagination | Click page "2" | URL contains `page=2`; 1 vet row |
| UAT-22 | Browser history | Nav to owners → Back → Forward | History matches Thymeleaf behavior |

## Automated UAT harness

`scripts/uat-manual-walkthrough.mjs` exercises the full matrix headlessly
through Playwright's `chromium`. Run it after the SPA + REST backend are up:

```bash
node scripts/uat-manual-walkthrough.mjs
```

It exits non-zero on the first failing check and prints a `console.table` of
results when it succeeds.

## Execution record (latest run)

| Check | Result |
| ----- | ------ |
| Playwright full suite (`npx playwright test`) | ✅ 29/29 passing — see `/opt/cursor/artifacts/playwright-final.txt` |
| Manual UAT harness (`node scripts/uat-manual-walkthrough.mjs`) | ✅ all 22 IDs PASS — see `/opt/cursor/artifacts/uat-manual-output.txt` |
| Frontend production build (`npm run build --prefix frontend`) | ✅ — see `/opt/cursor/artifacts/frontend-build.txt` |
| Visual evidence (`node scripts/uat-screenshots.mjs`) | ✅ 13 screenshots — see `/opt/cursor/artifacts/uat-screenshots/` |
| Manual click-through recording | ✅ `/opt/cursor/artifacts/petclinic-react-spa-walkthrough.mp4` (≈15 min, 18 MB) |
| Production build artifact | ✅ `/opt/cursor/artifacts/petclinic-frontend-dist.tar.gz` (419 KB) |

The REST backend stores everything in an in-memory H2 database that resets on
JVM restart. Re-run `./mvnw spring-boot:run` against the `spring-petclinic-rest`
checkout before each test sweep that needs to start from clean reference data
(otherwise the `edits an existing owner` / `edits a pet` Playwright cases
mutate the records that subsequent runs rely on).
