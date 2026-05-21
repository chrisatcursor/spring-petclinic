# User Acceptance Testing — Thymeleaf to React SPA Migration

**Branch:** `migration/react-grind`  
**Application under test:** Spring Boot serving the React SPA on `http://localhost:8080`  
**API backend:** `spring-petclinic-rest` at `http://localhost:9966/petclinic/api`  
**Automated acceptance:** Playwright suite in `e2e/`

## Objectives

Confirm the React SPA preserves Thymeleaf behavior for all user-facing flows:
URLs, visible copy, form validation, flash messages, `data-testid` hooks,
navigation, and persisted domain operations through the REST API backend.

## Preconditions

| Requirement | Command / check |
|-------------|-----------------|
| Node 18+ | `node -v` |
| Frontend deps | `npm ci --prefix frontend` |
| REST API | Start `spring-petclinic-rest` on port 9966 and confirm `/petclinic/api/owners` responds |
| Spring Boot SPA | `./mvnw spring-boot:run` → `http://localhost:8080` |
| Automated gate | `npx playwright test` from repo root |

## Manual walkthrough matrix

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

## Recording requirements

The final acceptance pass records the manual walkthrough against
`http://localhost:8080` with `spring-petclinic-rest` running. Store the
recording as an artifact with a unique filename and record the filename in the
execution record below.

## Execution record

**Date:** 2026-05-21  
**Tester:** Cloud Agent with browser-based manual walkthrough  
**REST backend:** `spring-petclinic-rest` running on port 9966  
**SPA target:** Spring Boot serving built React assets on port 8080

| Check | Result |
|-------|--------|
| Frontend lint | PASS — `npm run lint --prefix frontend` |
| Frontend production build | PASS — `npm run build --prefix frontend` |
| Spring Boot Maven tests | PASS — `./mvnw test` |
| Spring Boot Gradle tests | PASS — `./gradlew test` |
| Playwright full suite | PASS — `npx playwright test` → 29 passed |
| Manual walkthrough recording | PASS — `/opt/cursor/artifacts/react-spa-uat-walkthrough.mp4` |

Manual UAT covered every matrix row above: navigation, owner search, owner
create/edit and validation, pet duplicate/future-date validation, pet create
and edit, visit creation, vets pagination, `/oups`, `/nonexistent`, and browser
back/forward behavior.
