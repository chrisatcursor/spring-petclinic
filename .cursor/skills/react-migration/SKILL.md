---
name: react-migration
description: Maps Thymeleaf PetClinic UI to a Vite React SPA, REST backend, and Playwright E2E contract. Use when migrating pages, wiring APIs, or preserving routes and data-testid values.
---

# React Migration (PetClinic)

## Repos

- **This repo** (`chrisatcursor/spring-petclinic`): Thymeleaf UI, future `frontend/` SPA, Playwright `e2e/`.
- **Backend for React** (`chrisatcursor/spring-petclinic-rest`): canonical REST API, Swagger, port **9966**, context path **`/petclinic`** (confirm in that repo’s docs when integrating).

## Thymeleaf page inventory

| URL route | Controller | Template | Notes |
|-----------|------------|----------|--------|
| `/` | `WelcomeController` | `welcome.html` | Home |
| `/oups` | `CrashController` | (throws → `error.html`) | Demo error |
| `/owners/find` | `OwnerController` | `findOwners.html` | Search form |
| `/owners` | `OwnerController` | `findOwners.html` or `owners/ownersList.html` | Search results (pagination); may redirect to one owner |
| `/owners/new` GET/POST | `OwnerController` | `owners/createOrUpdateOwnerForm.html` | Create owner |
| `/owners/{ownerId}` | `OwnerController` | `owners/ownerDetails.html` | Owner + pets + visits |
| `/owners/{ownerId}/edit` GET/POST | `OwnerController` | `owners/createOrUpdateOwnerForm.html` | Update owner |
| `/owners/{ownerId}/pets/new` GET/POST | `PetController` | `pets/createOrUpdatePetForm.html` | Add pet |
| `/owners/{ownerId}/pets/{petId}/edit` GET/POST | `PetController` | `pets/createOrUpdatePetForm.html` | Edit pet |
| `/owners/{ownerId}/pets/{petId}/visits/new` GET/POST | `VisitController` | `pets/createOrUpdateVisitForm.html` | Add visit |
| `/vets.html` | `VetController` | `vets/vetList.html` | HTML vet list (paginated) |
| `/vets` | `VetController` | — | **Existing JSON** `Vets` (not the primary React backend; use **spring-petclinic-rest** for the demo API) |

Shared fragments: `fragments/layout.html`, `fragments/inputField.html`, `fragments/selectField.html`.

## URL routing contract

React Router paths must match Thymeleaf paths users see in the browser (including `/owners/new`, `/owners/{id}/edit`, pet and visit paths under `/owners/...`).

## `data-testid` contract

- Add stable `data-testid` in Thymeleaf **before** or alongside E2E work; mirror **identical** values in React.
- Document new IDs in PRs and in rules if patterns repeat (tables, rows, forms).
- Do not change IDs to “make tests pass”; fix the UI.

## React project layout (target)

- `frontend/` — Vite + React + TypeScript.
- Dev server proxies API calls to the REST app (default demo: `spring-petclinic-rest` on port **9966**, base path `/petclinic` — adjust proxy to match that service’s OpenAPI/Swagger).

## REST API reference

Use **Swagger / OpenAPI** from the running `spring-petclinic-rest` instance (e.g. Swagger UI and `v3/api-docs` under the app’s context path). Map resources to owners, pets, vets, visits consistent with PetClinic domain.

## Playwright

- Tests live in `e2e/`. Baseline: Thymeleaf on `http://localhost:8080` (Spring Boot in this repo).
- After React cutover, tests still target the same **base URL** behavior and visible contract; implementation detail is React, not Thymeleaf.

## Security reminders

- No `dangerouslySetInnerHTML` with untrusted content; prefer JSX text or sanitized markdown if ever needed.
- Handle auth tokens and CORS per REST app configuration when integrating.
