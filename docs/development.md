# Development guide

Day-to-day development for the PetClinic fork: builds, databases, styling, IDE tips, and CI.

## Build tools

This project supports **both Maven and Gradle**:

| Task | Maven | Gradle |
|------|-------|--------|
| Run app | `./mvnw spring-boot:run` | `./gradlew bootRun` |
| Full build + tests | `./mvnw verify` | `./gradlew build` |
| Package JAR | `./mvnw package` | `./gradlew bootJar` |
| Container image | `./mvnw spring-boot:build-image` | (use Maven for image build) |

CI (`.github/workflows/gradle-build.yml`) uses Gradle on Java 17.

## Database configuration

### Default: H2 in-memory

`application.properties` sets `database=h2`. Data is seeded from `src/main/resources/db/h2/`. The H2 console is available at [http://localhost:8080/h2-console](http://localhost:8080/h2-console); the JDBC URL is printed at startup.

### MySQL

```bash
docker run -e MYSQL_USER=petclinic -e MYSQL_PASSWORD=petclinic \
  -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=petclinic -p 3306:3306 mysql:9.6
```

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

Or use `docker compose up mysql` and activate the `mysql` profile.

### PostgreSQL

```bash
docker run -e POSTGRES_USER=petclinic -e POSTGRES_PASSWORD=petclinic \
  -e POSTGRES_DB=petclinic -p 5432:5432 postgres:18.3
```

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

Or `docker compose up postgres`.

## Test applications in the IDE

For fast feedback without a full `spring-boot:run`:

| Class | Purpose |
|-------|---------|
| `PetClinicIntegrationTests` | H2 + DevTools-friendly main |
| `MySqlTestApplication` | MySQL via Testcontainers |
| `PostgresIntegrationTests` | PostgreSQL via Docker Compose in tests |

Run these as Java applications or as JUnit tests from your IDE.

## Compiling CSS from SCSS

Styles are built from `src/main/scss/` (including Bootstrap). The committed `petclinic.css` under `static/resources/css/` is generated output.

After editing SCSS or upgrading Bootstrap:

```bash
./mvnw package -P css
```

There is no Gradle profile for CSS compilation; use Maven for this step.

## Code quality

- **Checkstyle** — `src/checkstyle/nohttp-checkstyle.xml` (no `http://` in source)
- **Spring Java Format** — enforced via Gradle/Maven plugins
- **EditorConfig** — `.editorconfig` for consistent editor settings

## IDE setup

### Prerequisites

- Java 17+ JDK
- Git
- Node.js (for Playwright only)

### IntelliJ IDEA

Open `pom.xml` as a Maven project. Generate CSS with `./mvnw generate-resources` if templates look unstyled. Run `PetClinicApplication` or the `PetClinicApplication` run configuration.

### VS Code / Cursor

Use the Java extension pack. Dev Container provides a preconfigured Java 21 environment.

### Eclipse / Spring Tools Suite

Import as Maven project; run `./mvnw generate-resources` before first launch.

## GitHub Actions

| Workflow | Trigger | Action |
|----------|---------|--------|
| `gradle-build.yml` | Push/PR to `main` | `./gradlew build` |
| `deploy-and-test-cluster.yml` | (cluster deploy) | Deployment pipeline |

## Related repositories

| Repository | Role |
|------------|------|
| [chrisatcursor/spring-petclinic](https://github.com/chrisatcursor/spring-petclinic) | This fork — Thymeleaf UI, E2E, migration scaffolding |
| [chrisatcursor/spring-petclinic-rest](https://github.com/chrisatcursor/spring-petclinic-rest) | Standalone REST API for React (port 9966) |
| [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) | Upstream canonical app (read-only reference) |

**Important:** Do not add an `upstream` remote to `spring-projects/spring-petclinic` or open PRs against it from this fork. See [Contributing](contributing.md).

## Configuration reference

| Concern | Location |
|---------|----------|
| Main class | `PetClinicApplication.java` |
| Properties | `src/main/resources/application*.properties` |
| Caching | `CacheConfiguration.java` |
| Thymeleaf mode | `spring.thymeleaf.mode=HTML` in `application.properties` |
