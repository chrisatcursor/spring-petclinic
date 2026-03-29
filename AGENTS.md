# AGENTS.md

## Cursor Cloud specific instructions

### Services

| Service | Command | Port | Notes |
|---|---|---|---|
| Spring Boot backend | `./mvnw spring-boot:run` | 8080 | Serves Thymeleaf UI + REST API. Uses embedded H2 (no external DB needed). |
| Playwright E2E | `npm run test:e2e` | — | Runs against `http://localhost:8080`. Config auto-starts backend if not running (`webServer` in `playwright.config.ts`). |

### Quick reference

- **Lint / format check**: `./mvnw validate` (runs Spring Java Format + Checkstyle in the `validate` phase)
- **Unit / integration tests**: `./mvnw test` (57 tests; 2 Testcontainers-based tests skip without Docker)
- **Build**: `./mvnw package -DskipTests`
- **Run (dev)**: `./mvnw spring-boot:run` — app at `http://localhost:8080`
- **E2E tests**: `npm run test:e2e` (currently passes with no tests; `e2e/` has only `.gitkeep`)
- **Skip slow checks during dev iteration**: add `-Dspring-javaformat.skip=true -Dcheckstyle.skip=true` to Maven commands

### Gotchas

- Spring Boot 4.0.3 requires Java 17+. The VM has OpenJDK 21 which is compatible.
- Some Maven tests use Testcontainers (MySQL) and Docker Compose (Postgres). Without Docker these tests are skipped automatically — this is expected and not a failure.
- The `playwright.config.ts` `webServer.command` uses `./mvnw spring-boot:run` and will start the backend automatically if not already running. Set `reuseExistingServer: true` so a pre-started server is reused.
- The Playwright setup installs only Chromium (`npx playwright install --with-deps chromium`). Other browsers are not needed.
- The `e2e/` directory currently contains only `.gitkeep` — tests pass via the `--pass-with-no-tests` flag.
