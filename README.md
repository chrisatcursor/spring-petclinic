# Spring PetClinic — React SPA

This repository hosts the React + TypeScript single-page application that
replaced the original Spring Boot + Thymeleaf user interface of the
PetClinic sample. The SPA consumes the standalone JSON API published by the
[`chrisatcursor/spring-petclinic-rest`](https://github.com/chrisatcursor/spring-petclinic-rest)
project; this repository no longer ships any Java code.

```
┌────────────────────────┐         ┌──────────────────────────────┐
│  Vite dev server :8080 │ ──HTTP─►│ spring-petclinic-rest :9966  │
│  React SPA (frontend/) │  /api   │ JSON API + H2 in-memory DB   │
└────────────────────────┘         └──────────────────────────────┘
```

The Vite dev server serves the SPA on `http://localhost:8080` and proxies
`/petclinic/*` to the REST backend on `http://localhost:9966`, so the browser
and the API appear same-origin (no CORS plumbing required).

## Layout

```
frontend/                Vite + React + TypeScript SPA (UI implementation)
e2e/                     Playwright end-to-end specs (the migration contract)
playwright.config.ts     Playwright runner — boots REST backend + Vite together
package.json             Root Playwright wiring (npm test → e2e suite)
docs/                    UAT plan and supplementary docs
scripts/                 Manual UAT walkthrough harness
```

## Prerequisites

| Tool | Version | Purpose |
| ---- | ------- | ------- |
| Node | ≥ 18 (recommended ≥ 22) | Vite dev server, Playwright |
| Java | 17+ (21 recommended) | Build/run the REST backend |
| `spring-petclinic-rest` checkout | latest `master` | Provides `/petclinic/api` |

Clone the REST backend next to this repo (or anywhere — point Playwright at it
via `PETCLINIC_REST_DIR`):

```bash
git clone https://github.com/chrisatcursor/spring-petclinic-rest.git ../spring-petclinic-rest
```

## Running the app locally

In one terminal, start the REST API:

```bash
cd ../spring-petclinic-rest
./mvnw spring-boot:run
# → http://localhost:9966/petclinic/api/owners
```

In another terminal, install frontend deps and start the SPA:

```bash
npm ci --prefix frontend
npm run dev --prefix frontend
# → http://localhost:8080
```

Then browse to <http://localhost:8080>. Sample data is loaded automatically by
the REST backend on every restart.

## Running the test suite

The Playwright suite in `e2e/` is the migration contract — it must pass
verbatim against the React SPA.

```bash
# install Playwright once
npm install
npx playwright install --with-deps

# point Playwright at the REST backend checkout (optional;
# defaults to ../spring-petclinic-rest)
export PETCLINIC_REST_DIR=/path/to/spring-petclinic-rest

# run the full suite — Playwright will start the REST backend and the
# Vite dev server on demand (or reuse already-running instances).
npx playwright test
```

`playwright.config.ts` declares both `webServer` entries with
`reuseExistingServer: true`, so it is also fine to start the REST backend and
the SPA manually first and then run `npx playwright test`.

## Manual user acceptance testing

A scripted walkthrough that exercises every documented user flow lives at
`scripts/uat-manual-walkthrough.mjs`; the matching checklist is in
[`docs/UAT-REACT-MIGRATION.md`](docs/UAT-REACT-MIGRATION.md). Both expect the
SPA on `http://localhost:8080` and the REST backend on
`http://localhost:9966`.

```bash
node scripts/uat-manual-walkthrough.mjs
```

## Production-style build

```bash
npm run build --prefix frontend     # outputs frontend/dist/
npm run preview --prefix frontend   # serves dist/ on :8080
```

When deploying, point a static-file server (or CDN) at `frontend/dist/` and
make sure unmatched routes (`/owners/1`, `/vets.html`, …) fall back to
`index.html` so React Router can resolve them. The REST API must still be
reachable from the browser at `/petclinic/api` (configure your reverse proxy
accordingly).

## License

Released under the [Apache License 2.0](LICENSE.txt).
