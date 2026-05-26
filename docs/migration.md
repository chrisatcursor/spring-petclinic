# Migration guide

This fork supports a two-track modernization of Spring PetClinic, documented in detail in `.cursor/guiding-plan.md`. Summary below.

## Overview

| Track | Goal | Branch examples |
|-------|------|-----------------|
| **A — REST API** | Add JSON `@RestController` endpoints alongside Thymeleaf | `migration/rest-api-grind`, `migration/rest-api-linear` |
| **B — React SPA** | Replace Thymeleaf with Vite + React; pass same Playwright tests | `migration/react-grind`, `migration/react-linear` |

**E2E baseline branch:** `e2e-tests` — Playwright suite and `data-testid` on Thymeleaf before React work.

## Track A: Thymeleaf → REST API

### What changes

- New `@RestController` classes return JSON DTOs (not raw JPA entities).
- Existing `@Controller` + Thymeleaf flows **remain** (additive migration).
- Reuse the current service layer—no duplicated business logic.
- Add OpenAPI/Swagger annotations and JUnit tests for REST endpoints.

### Hard parts

| Thymeleaf pattern | REST equivalent |
|-------------------|-----------------|
| `@ModelAttribute` forms | `@RequestBody` + request DTOs |
| Validation errors in model | `400` with field-level JSON errors |
| `redirect:/owners/{id}` | Return created/updated resource in response body |

### Alternative

Use the existing [spring-petclinic-rest](https://github.com/chrisatcursor/spring-petclinic-rest) repository instead of building REST in this repo. Track A is valuable when demonstrating extraction from legacy MVC controllers.

## Track B: Thymeleaf → React SPA

### Phases

1. **E2E baseline** — Playwright tests pass on Thymeleaf (`e2e-tests` → `main`).
2. **React build** — Scaffold `frontend/` (Vite + TypeScript), proxy API to REST backend.
3. **Incremental pages** — Match URLs, visible text, forms, and `data-testid` from Thymeleaf.
4. **Validation** — Run `npm run test:e2e` after each page; fix React only.

### URL contract

React Router paths must match browser URLs from Thymeleaf:

| Route | Feature |
|-------|---------|
| `/` | Home |
| `/owners/find` | Owner search |
| `/owners`, `/owners/new`, `/owners/{id}`, `/owners/{id}/edit` | Owner flows |
| `/owners/{ownerId}/pets/new`, `.../edit` | Pets |
| `/owners/{ownerId}/pets/{petId}/visits/new` | Visits |
| `/vets.html` | Veterinarians |

Full inventory: `.cursor/skills/react-migration/SKILL.md`.

### Backend for React

Default demo target: **spring-petclinic-rest**

- Port: **9966**
- Context path: **`/petclinic`**
- Swagger UI for API discovery

Configure the Vite dev server proxy to match that service’s base URL.

### Guardrails

| Rule file | Purpose |
|-----------|---------|
| `.cursor/rules/e2e-contract.mdc` | Do not modify E2E tests for React |
| `.cursor/rules/no-thymeleaf.mdc` | No new Thymeleaf on React migration branches |
| `.cursor/rules/upstream-protection.mdc` | Fork-only git and PR targets |

## Agent scaffolding

| Asset | Location |
|-------|----------|
| React migration skill | `.cursor/skills/react-migration/SKILL.md` |
| PR composition skill | `.cursor/skills/pr-composition/SKILL.md` |
| Subagents | `.cursor/agents/` (verify, test-gen, modernize, …) |
| Guiding plan | `.cursor/guiding-plan.md` |

## Verification checklist

Before declaring a migration phase complete:

- [ ] `./mvnw verify` (or `./gradlew build`) passes
- [ ] `npm run test:e2e` passes
- [ ] URL paths and visible copy match Thymeleaf baseline
- [ ] `data-testid` values preserved in React
- [ ] PRs target `chrisatcursor/spring-petclinic` only
