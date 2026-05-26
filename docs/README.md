# Spring PetClinic — Documentation

This folder documents the [Chris at Cursor fork](https://github.com/chrisatcursor/spring-petclinic) of Spring PetClinic. The fork extends the upstream sample with Playwright end-to-end tests, Cursor agent scaffolding, and planned Thymeleaf → REST / React migration tracks.

## Documentation index

| Guide | Description |
|-------|-------------|
| [Getting started](getting-started.md) | Prerequisites, clone, run, and verify the application |
| [Architecture](architecture.md) | System design, layers, domain model, and diagrams |
| [Development](development.md) | Databases, CSS, IDE setup, build tools, and CI |
| [E2E testing](e2e-testing.md) | Playwright setup, test plan, and selector contract |
| [Migration](migration.md) | REST API and React SPA migration tracks |
| [Contributing](contributing.md) | Fork workflow, branches, and pull request guidelines |

## Quick links

- **Application:** [http://localhost:8080](http://localhost:8080) after `./mvnw spring-boot:run` or `./gradlew bootRun`
- **Related REST backend:** [chrisatcursor/spring-petclinic-rest](https://github.com/chrisatcursor/spring-petclinic-rest) (port 9966, for React integration)
- **Upstream reference:** [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic)

## Repository layout

```
spring-petclinic/
├── src/main/java/          # Spring Boot application (controllers, domain, services)
├── src/main/resources/     # Thymeleaf templates, static assets, DB scripts, i18n
├── src/test/java/            # JUnit integration and unit tests
├── e2e/                    # Playwright end-to-end tests
├── docs/                   # This documentation
├── .cursor/                # Agent skills, rules, and migration plans
├── build.gradle            # Gradle build (primary in CI)
├── pom.xml                 # Maven build (alternative)
├── package.json            # Playwright npm scripts
└── playwright.config.ts    # E2E test configuration
```
