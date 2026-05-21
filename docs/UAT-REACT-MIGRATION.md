# User Acceptance Testing — Thymeleaf to React SPA Migration

**Branch:** `migration/react-grind`  
**Application under test:** Vite React SPA (`frontend/`) on `http://localhost:4173`  
**API backend (optional):** `spring-petclinic-rest` at `http://localhost:9966/petclinic/api`  
**Automated acceptance:** Playwright suite in `e2e/` (29 tests)

## Objectives

Confirm the React SPA preserves Thymeleaf behavior for all user-facing flows: URLs, visible copy, form validation, flash messages, `data-testid` hooks, and navigation.

## Preconditions

| Requirement | Command / check |
|-------------|-----------------|
| Node 18+ | `node -v` |
| Frontend deps | `npm ci --prefix frontend` |
| Dev server | `npm run dev --prefix frontend` → `http://localhost:4173` |
| REST API (recommended) | Start `spring-petclinic-rest` on port 9966; without it the SPA uses seeded in-memory fallback data |
| E2E (automated gate) | `npx playwright test` from repo root |

## Test matrix

| ID | Area | Steps | Expected result |
|----|------|-------|-----------------|
| UAT-01 | Home | Open `/` | “Welcome” heading; pets image visible |
| UAT-02 | Navigation | Use nav: Home, Find Owners, Vets, Error | URLs: `/`, `/owners/find`, `/vets.html`, `/oups` |
| UAT-03 | Error demo | Open `/oups` | “Something happened...” error page |
| UAT-04 | 404 | Open `/nonexistent` | Error page with “not found” message |
| UAT-05 | Owner search | `/owners/find` → empty search | `/owners` list with 5 rows |
| UAT-06 | Owner search | Search “Davis” | 2 owners (Betty, Harold) |
| UAT-07 | Owner search | Search “Franklin” | Redirect to `/owners/1` detail |
| UAT-08 | Owner search | Search “Zzzzz” | “has not been found” message |
| UAT-09 | Owner detail | `/owners/1` | George Franklin, address, phone, Leo pet |
| UAT-10 | Owner create | `/owners/new` → valid form → submit | Redirect to new owner; “New Owner Created” |
| UAT-11 | Owner edit | `/owners/1/edit` → change phone | “Owner Values Updated”; new phone on detail |
| UAT-12 | Owner validation | Blank `/owners/new` submit | Form stays; `.has-error` visible |
| UAT-13 | Owner validation | Invalid phone on new owner | “10-digit number” error |
| UAT-14 | Pet add | Owner 1 → Add Pet → valid pet | “New Pet has been Added”; pet on detail |
| UAT-15 | Pet duplicate | Add pet named “Leo” | “is already in use”; form remains |
| UAT-16 | Pet date | Future birth date | “invalid date”; form remains |
| UAT-17 | Pet edit | Edit first pet → rename | “Pet details has been edited” |
| UAT-18 | Visit add | Owner 6 → Samantha → Add Visit | “Your visit has been booked” |
| UAT-19 | Visit list | Add visit with description | Description visible on owner detail |
| UAT-20 | Vets list | `/vets.html` | Table with 5 vets; specialties shown |
| UAT-21 | Vets pagination | Click page “2” | URL `page=2`; 1 vet row |
| UAT-22 | Browser history | Nav to owners → Back → Forward | History matches Thymeleaf behavior |

## Execution record

**Date:** 2026-05-21  
**Tester:** Cloud Agent (automated manual harness + Playwright)  
**Environment:** Linux; REST API on 9966 **not running** (SPA used in-memory fallback after proxy failure)

### Automated acceptance (Playwright)

```
npx playwright test
29 passed (4.8s)
```

All E2E specs cover UAT-01 through UAT-21 behaviorally.

### Manual walkthrough (Playwright harness)

Script: `scripts/uat-manual-walkthrough.mjs`  
Result: **PASS** — all 22 UAT IDs exercised without assertion failures.

| ID | Result | Notes |
|----|--------|-------|
| UAT-01 | PASS | Welcome + pets.png |
| UAT-02 | PASS | All nav targets |
| UAT-03 | PASS | /oups error heading |
| UAT-04 | PASS | 404 copy |
| UAT-05–08 | PASS | Search flows |
| UAT-09 | PASS | Owner 1 detail |
| UAT-10–13 | PASS | Create/edit/validation |
| UAT-14–17 | PASS | Pet CRUD + errors |
| UAT-18–19 | PASS | Visit booking |
| UAT-20–21 | PASS | Vets + pagination |
| UAT-22 | PASS | back/forward URLs |

### Sign-off

- **Automated E2E:** PASS (29/29)  
- **Manual UAT matrix:** PASS (22/22)  
- **Recommendation:** Approve merge to `main` after optional verification with `spring-petclinic-rest` running on 9966.
