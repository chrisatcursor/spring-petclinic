# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Spring PetClinic is a Spring Boot 4.0.3 web application with a Thymeleaf UI, an H2 in-memory database (default), and Playwright E2E tests. A React frontend migration is planned but does not yet exist on `main`.

### Running the application

```bash
./mvnw spring-boot:run
```

App starts on `http://localhost:8080`. With H2 (default profile), no external DB is needed. First startup downloads Maven dependencies (~30s); subsequent starts are faster (~4s).

### Running tests

- **Unit/integration tests:** `./mvnw test`
- **E2E tests (Playwright):** `npm run test:e2e` (requires the app running on port 8080; the Playwright config has a `webServer` block that auto-starts it if not already running)
- **Lint/format validation:** `./mvnw validate` (runs Spring Java Format + Checkstyle nohttp)

### Key gotchas

- The Maven `validate` phase runs both `spring-javaformat:validate` and `checkstyle:check`. Run `./mvnw spring-javaformat:apply` to auto-fix formatting before committing.
- MySQL integration tests (`MySqlIntegrationTests`) require Docker/Testcontainers and are skipped when Docker is unavailable.
- Playwright is configured with `reuseExistingServer: true`, so start the Spring Boot app separately if you want faster E2E iteration.
- The app uses Spring Boot Devtools for hot reload in dev mode; however, dependency changes (pom.xml) require a full restart.
