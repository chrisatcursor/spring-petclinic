# AGENTS.md

## Cursor Cloud specific instructions

This is the canonical Spring PetClinic (Spring Boot + Thymeleaf server-rendered UI) on the
`main` branch, plus a Playwright E2E suite in `e2e/`. The React SPA lives only on
`migration/*` branches (see `.cursor/guiding-plan.md`); it is not present on `main`.

### Services

- **PetClinic web app** — Spring Boot (Maven). Serves the Thymeleaf UI at
  `http://localhost:8080/`. Uses an in-memory **H2** database by default (seeded at
  startup), so no external database or Docker is required to run or test it.

### Run / build / lint / test (standard commands, already documented in `README.md`)

- Run (dev): `./mvnw spring-boot:run` then open `http://localhost:8080/`.
- Lint + unit tests + build jar: `./mvnw verify` (binds `spring-javaformat` + `checkstyle`
  during `validate`; tests run via Surefire). `spring-boot-devtools` is on the classpath, so
  `spring-boot:run` hot-reloads on recompiled classes.

### Non-obvious gotchas

- **`MySqlIntegrationTests` and `PostgresIntegrationTests` auto-skip without Docker.** Both
  guard with `assumeTrue(DockerClientFactory.instance().isDockerAvailable())`, so `./mvnw verify`
  reports 2 skipped tests and still passes (no Docker needed). To exercise them, start the DB
  via `docker compose up mysql|postgres` and run with the matching Spring profile.
- **Playwright's bundled-browser CDN (`cdn.playwright.dev`) is blocked by egress**, so
  `npx playwright install chromium` fails in this environment. A system Google Chrome is
  preinstalled (`/usr/bin/google-chrome-stable`). Run the E2E suite against it with the
  `chrome` channel, e.g. `npx playwright test --project ... ` after adding `use: { channel: 'chrome' }`,
  or run with a throwaway config that sets `channel: 'chrome'`. The committed
  `playwright.config.ts` targets the bundled chromium, which will not download here.
- The Playwright `webServer` block boots the app with `./mvnw spring-boot:run` and uses
  `reuseExistingServer: true`, so an already-running `:8080` app is reused by the E2E run.
