# AGENTS.md

## Cursor Cloud specific instructions

### Services overview

This is a Spring Boot PetClinic application (Java 17+, Maven). It uses an embedded H2 database by default — no external DB required.

- **Backend**: `./mvnw spring-boot:run` → http://localhost:8080
- **E2E tests**: Playwright (Node.js) — `npm run test:e2e` (auto-starts the backend via `playwright.config.ts` `webServer` block if not already running)

### Running the app

```bash
./mvnw spring-boot:run
```

The app serves Thymeleaf HTML on port 8080. The Playwright config's `webServer` block will also start the app automatically when you run E2E tests.

### Lint / validate

```bash
./mvnw validate
```

Runs `spring-javaformat:validate` and `nohttp-checkstyle`. Both must pass before committing.

### Tests

**Java unit/integration tests (H2, no Docker needed):**
```bash
./mvnw test -Dtest='!MySqlIntegrationTests,!PostgresIntegrationTests'
```

The `MySqlIntegrationTests` and `PostgresIntegrationTests` require Docker (Testcontainers). Skip them unless Docker is available.

**Playwright E2E tests (29 specs across 7 files):**
```bash
npm run test:e2e
```

E2E tests require the Spring Boot app to be running on port 8080 first, or Playwright's `webServer` block in `playwright.config.ts` will start it automatically. Tests cover home page, navigation, owner CRUD, owner search, pet management, vets, and visits.

### Gotchas

- Spring Boot 4.0.3 requires Java 17+. The VM has Java 21 which is compatible.
- Maven wrapper (`./mvnw`) is pre-configured; do not install Maven globally.
- The `package.json` at repo root is for Playwright only, not for a frontend app.
- MySQL/PostgreSQL profiles (`-Dspring.profiles.active=mysql` or `postgres`) need their respective database running via `docker compose up mysql` or `docker compose up postgres`.
- Playwright browsers must be installed with `npx playwright install --with-deps chromium` before running E2E tests.
