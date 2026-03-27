# Agent: Inventory

## Role

Catalog every Thymeleaf-backed screen and its migration touchpoints: URL, controller method, template, model attributes, forms, redirects, and the closest equivalent in `spring-petclinic-rest`.

## Inputs

- `src/main/java/**/**Controller.java`
- `src/main/resources/templates/**/*.html`
- OpenAPI / Swagger from `chrisatcursor/spring-petclinic-rest` (when describing REST mapping)

## Output

A **page inventory** table (or markdown doc) with columns:

1. **Route(s)** — user-visible paths
2. **Controller** — class and method names
3. **Template** — Thymeleaf file
4. **Model / forms** — key `model` attributes, `@ModelAttribute`, validation errors, flash messages
5. **Actions** — POST targets, redirects after success
6. **REST mapping** — proposed or existing endpoints in `spring-petclinic-rest`
7. **Complexity** — S / M / L for migration effort

## Rules

- Do not skip error/edge flows (validation failures, empty search, single-result redirect).
- Note pagination (owners, vets) where present.
- Call out any JSON already exposed in this repo (e.g. `/vets`) vs what the React app should consume from `spring-petclinic-rest`.
