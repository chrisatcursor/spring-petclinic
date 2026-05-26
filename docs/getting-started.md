# Getting started

This guide covers running the PetClinic fork locally. You need **Java 17 or newer** (full JDK).

## Clone the fork

```bash
git clone https://github.com/chrisatcursor/spring-petclinic.git
cd spring-petclinic
```

Use the Chris at Cursor fork URL above—not `spring-projects/spring-petclinic`—when contributing to this demo repository.

## Run the application

### Maven

```bash
./mvnw spring-boot:run
```

### Gradle

```bash
./gradlew bootRun
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Verify the build

```bash
./mvnw verify
# or
./gradlew build
```

## Run E2E tests

Install Node dependencies and Playwright browsers once:

```bash
npm install
npx playwright install --with-deps chromium
```

Run the full suite (starts Spring Boot automatically if not already running):

```bash
npm run test:e2e
```

See [E2E testing](e2e-testing.md) for UI mode, headed runs, and troubleshooting.

## Dev container

Open the repository in a [Dev Container](https://containers.dev/) (VS Code or GitHub Codespaces). Configuration is in `.devcontainer/devcontainer.json` (Java 21, Docker-in-Docker, GitHub CLI).

## Optional: persistent database

By default, H2 loads schema and sample data at startup. For MySQL or PostgreSQL:

1. Start a database (Docker Compose or manual):

   ```bash
   docker compose up mysql
   # or
   docker compose up postgres
   ```

2. Run with the matching profile:

   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
   ```

Setup notes: `src/main/resources/db/mysql/petclinic_db_setup_mysql.txt` and `src/main/resources/db/postgres/petclinic_db_setup_postgres.txt`.

## Next steps

- [Architecture](architecture.md) — how the app is structured
- [Development](development.md) — IDE, CSS, test applications
- [Migration](migration.md) — REST and React tracks
