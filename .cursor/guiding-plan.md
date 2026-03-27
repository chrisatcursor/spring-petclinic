# Demo 5: Spring PetClinic — Backend + Frontend Migration with E2E Validation

## The Story (Quick Refresher)

This demo tells the most common enterprise modernization story in two acts:

**Act 1 — Backend:** "We have a monolithic Spring Boot app with server-rendered Thymeleaf templates. We already migrated the backend to a standalone REST API." (This is `spring-petclinic-rest`, which you've already forked. It has the same domain — owners, pets, vets, visits — exposed as JSON endpoints with Swagger, Spring Security, and JUnit tests.)

**Act 2 — Frontend:** "Now we're replacing the legacy Thymeleaf UI with a modern React SPA that talks to that REST API. We wrote Playwright E2E tests against the old Thymeleaf UI first, and the React version has to pass those same tests."

The punchline: **framework-agnostic E2E tests are the migration harness.** The tests don't care whether Thymeleaf or React rendered the page — they click, type, and assert on what the user sees. If the React app passes the same Playwright suite that the Thymeleaf app passed, the migration is proven correct.

This is also a great story to pair with Demos 2 and 3, since they share the same `spring-petclinic-rest` repo. You can show the audience: "We took this REST API, migrated it to Kotlin (Demo 2), rewrote it in Go (Demo 3), and also built a modern React frontend for it (Demo 5) — all validated by tests."

## How This Fits the Full Demo Portfolio

| Demo | Source | Target | Repo |
|------|--------|--------|------|
| 1 | JS → TypeScript | Language modernization | `ChrisatCursor/node-express-boilerplate` |
| 2 | Java → Kotlin | JVM language evolution | `ChrisatCursor/spring-petclinic-rest` |
| 3 | Java → Go | Cross-language rewrite | `ChrisatCursor/spring-petclinic-rest` |
| 4 | Go → Java/Quarkus | Cross-language rewrite | `ChrisatCursor/golang-gin-realworld-example-app` |
| **5a** | **Thymeleaf → REST API** | **Backend modernization** | **`ChrisatCursor/spring-petclinic` (canonical)** |
| **5b** | **Thymeleaf → React SPA** | **Frontend modernization + E2E validation** | **`ChrisatCursor/spring-petclinic` + `spring-petclinic-rest` as backend** |

## Repos Involved

**`ChrisatCursor/spring-petclinic`** (fork of `spring-projects/spring-petclinic`)

The canonical PetClinic with Thymeleaf server-rendered UI. This is where:

- Playwright E2E tests get written against the legacy UI
- The React SPA frontend gets built
- The Thymeleaf-to-REST-API backend work happens (if we do it fresh here, rather than pointing to the existing REST fork)

**`ChrisatCursor/spring-petclinic-rest`** (already forked)

The REST API variant with full JSON endpoints, Swagger, Spring Security, JUnit tests, and Postman/Newman collections. The React SPA will consume this API. This repo is already set up from the earlier demo scaffolding.

## Track A: Backend — Thymeleaf Controllers → REST API

### What We're Migrating

The canonical PetClinic serves HTML via Spring MVC `@Controller` classes that return Thymeleaf view names. The data flows through model attributes (`model.addAttribute(...)`) into `.html` templates. There are no JSON endpoints.

Track A adds a REST API layer to this same application — `@RestController` endpoints that return JSON — so the React SPA has something to talk to.

### Why Not Just Use `spring-petclinic-rest`?

You can, and you will for the React frontend. But there's demo value in showing the agent *creating* the REST API from the existing Thymeleaf controllers. It demonstrates that the agent can read server-rendered controller logic and extract a clean JSON API from it. This is the work that enterprise teams actually do when they can't start from a separate REST project.

If you'd rather skip this and just use `spring-petclinic-rest` as-is, that's fine — jump straight to Track B.

### Migration Scope (Track A)

- For each existing `@Controller` method that returns a Thymeleaf view, create a corresponding `@RestController` endpoint that returns JSON
- Reuse the existing service layer — don't duplicate business logic
- Add proper DTOs (don't expose JPA entities directly in JSON responses)
- Add Swagger/OpenAPI annotations
- Preserve the existing Thymeleaf controllers (they continue to work — this is additive, not destructive)
- Write JUnit tests for the new REST endpoints

### Where the Hard Parts Are

- **Form handling:** Thymeleaf controllers accept `@ModelAttribute` form submissions. REST endpoints need `@RequestBody` JSON. The agent needs to understand the difference and create proper request DTOs.
- **Validation:** Thymeleaf uses server-side Bean Validation with error attributes bound back to the template. REST endpoints need to return validation errors as structured JSON (e.g., a 400 response with field-level error messages).
- **Navigation/redirect logic:** Thymeleaf controllers use `redirect:/owners/{id}` after form submission. REST endpoints just return the created/updated resource. The agent shouldn't try to replicate redirect semantics in JSON responses.

### Branches (Track A)

- `migration/rest-api-grind` — single agent adds the full REST API layer
- `migration/rest-api-linear` — batched by domain (owners, pets, vets, visits)

## Track B: Frontend — Thymeleaf UI → React SPA with Playwright E2E Validation

### What We're Migrating

Replace the Thymeleaf server-rendered HTML with a React SPA (Vite + React + TypeScript) that talks to the REST API backend (either the one created in Track A, or the existing `spring-petclinic-rest`).

### The Critical Innovation: E2E Tests as the Migration Harness

Before any React work begins, we write Playwright E2E tests against the Thymeleaf UI. These tests exercise every user flow: searching for owners, adding pets, scheduling visits, viewing vets. They use framework-agnostic selectors (visible text, labels, roles, `data-testid` attributes).

Then the React SPA must pass those exact same tests without modification. If a test fails, we fix the React code, never the test.

### Migration Scope (Track B)

**Phase 1: Write Playwright E2E Tests Against Thymeleaf**

- Set up Playwright in the project
- Write tests covering every user-facing flow (see test plan below)
- Add `data-testid` attributes to Thymeleaf templates where stable selectors are needed
- Run tests, confirm all pass against Thymeleaf — this is the baseline
- Commit to `e2e-tests` branch, merge to main

**Phase 2: Build React SPA**

- Scaffold a React + TypeScript project (Vite) in a `frontend/` directory
- Configure API proxy to the Spring Boot backend (port 9966 for `spring-petclinic-rest`, or 8080 if using Track A's REST endpoints)
- Build React components for each page, preserving all `data-testid` attributes, visible text, URL paths, and form behavior
- Run Playwright tests after each page is built to validate incrementally

### Playwright Test Plan

**Rules for writing framework-agnostic E2E tests:**

- Select elements by visible text, labels, roles, and `data-testid` — NEVER by framework-specific selectors
- Assert on user-visible outcomes: text on screen, URL changes, form results
- Don't assert on DOM structure that would change between Thymeleaf and React
- Use Playwright's accessibility-first locators: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`

**Test files:**

- `e2e/home.spec.ts` — Home page loads, welcome message, navigation links work.
- `e2e/owners-search.spec.ts` — Owner search: empty search returns all owners; search by last name returns filtered results; no results shows appropriate message
- `e2e/owners-crud.spec.ts` — Owner lifecycle: view owner detail; add new owner; edit owner
- `e2e/pets.spec.ts` — Pet management: add pet; edit pet
- `e2e/visits.spec.ts` — Visit scheduling: add visit; visit appears on owner detail
- `e2e/vets.spec.ts` — Veterinarians: page loads, displays vet list with specialties
- `e2e/navigation.spec.ts` — Cross-cutting: nav links; invalid URLs; back/forward

### `data-testid` Strategy

Add `data-testid` attributes to key elements in Thymeleaf templates before writing tests. The React components will use the same `data-testid` values. This creates a stable contract between the tests and both UIs.

## Scaffolding to Create

### 1. Playwright Setup

- `npm init` / `package.json`, `@playwright/test`, `playwright.config.ts`, `e2e/` directory
- Scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:headed`
- `webServer`: `./mvnw spring-boot:run`, `baseURL` `http://localhost:8080` for Thymeleaf baseline

### 2. Skill File

`.cursor/skills/react-migration/SKILL.md` — inventory, `data-testid` contract, React layout, proxy, REST reference, URL contract.

### 3. Guardrail Rules

- `.cursor/rules/e2e-contract.mdc`
- `.cursor/rules/no-thymeleaf.mdc` (React migration scope)

### 4. Subagents

`.cursor/agents/` — inventory, test-gen, migrate, modernize, verify, security-scan.

### 5. PR Composition

`.cursor/skills/pr-composition/SKILL.md`

## Setup Steps (for the scaffolding agent)

1. Fork `spring-projects/spring-petclinic` into Chris at Cursor (if not already done).
2. Clone **only** the fork; do not add `upstream` to the original; never push or open PRs to `spring-projects/spring-petclinic`.
3. Add `.cursor/rules/upstream-protection.mdc`.
4. Verify: `./mvnw verify`, `./mvnw spring-boot:run`, UI at localhost:8080.
5. Install Playwright and create config (no spec files yet in pure scaffolding phase if requested).
6. Create branches: `e2e-tests`, `migration/rest-api-grind`, `migration/rest-api-linear`, `migration/react-grind`, `migration/react-linear`.
7. Create skill file, guardrail rules, subagent definitions; commit to `main`.

## Verification Checklist

- [ ] Fork exists under Chris at Cursor
- [ ] No fetch/push/PR to original; fork-only remotes
- [ ] `.cursor/rules/upstream-protection.mdc` committed
- [ ] Playwright installed, `playwright.config.ts`, `e2e/` exists
- [ ] `./mvnw verify` passes
- [ ] App starts at localhost:8080
- [ ] Branches created and pushed
- [ ] Skills, rules, agents committed
- [ ] `spring-petclinic-rest` confirmed as React backend target

**Do NOT** write E2E tests or start migration work in scaffolding-only phases.

## Feedback Loop

After each batch (or grind attempt), update rules, skill file, subagent prompts, and plans based on learnings.
