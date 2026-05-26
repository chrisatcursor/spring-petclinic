# End-to-end testing

Playwright tests in `e2e/` define the **acceptance contract** for the PetClinic UI. They were written against the Thymeleaf application and must pass unchanged when the React SPA replaces the server-rendered UI.

## Philosophy

- Tests assert **what users see**: headings, labels, URLs, table content.
- Prefer accessibility locators: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`.
- Use `getByTestId` where stable hooks exist in templates (and must be mirrored in React).
- **Never** change a failing E2E test to accommodate React—fix the React implementation.

This contract is enforced in `.cursor/rules/e2e-contract.mdc`.

## Setup

```bash
npm install
npx playwright install --with-deps chromium
```

## Running tests

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Headless run (default) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:headed` | Visible browser |

`playwright.config.ts` configures:

- **baseURL:** `http://localhost:8080`
- **webServer:** `./mvnw spring-boot:run` (reuses an existing server if one is already up)
- **timeout:** 30s per test
- **artifacts:** screenshots on failure; trace on first retry

To run against an already-running app, start Spring Boot first—the config sets `reuseExistingServer: true`.

## Test suite

| File | Coverage |
|------|----------|
| `e2e/home.spec.ts` | Welcome page, navigation links |
| `e2e/owners-search.spec.ts` | Owner search (empty, filter, no results) |
| `e2e/owners-crud.spec.ts` | View, create, edit owners |
| `e2e/pets.spec.ts` | Add and edit pets |
| `e2e/visits.spec.ts` | Schedule visits on owner detail |
| `e2e/vets.spec.ts` | Veterinarian list and specialties |
| `e2e/navigation.spec.ts` | Nav links, invalid URLs, history |

## `data-testid` contract

Key templates include stable test IDs (examples):

| Element | Typical `data-testid` |
|---------|------------------------|
| Nav links | `nav-home`, `nav-owners`, `nav-vets` |
| Owner forms / lists | See templates under `owners/` |
| Pet / visit forms | See `pets/` templates |

When adding new IDs in Thymeleaf for E2E stability, use the **same values** in React components. Document new IDs in pull requests.

## Selector guidelines

**Do:**

```typescript
await page.getByRole('heading', { name: 'Welcome' });
await page.getByLabel('Last Name');
await page.getByTestId('nav-owners').click();
```

**Avoid:**

- CSS classes tied to Bootstrap layout only
- XPath that depends on Thymeleaf-specific DOM nesting
- Framework-internal attributes (`th:*`, React internal props)

## Branch workflow

| Branch | E2E role |
|--------|----------|
| `e2e-tests` | Baseline tests + Thymeleaf `data-testid` additions |
| `main` | Merged baseline; all tests green on Thymeleaf |
| `migration/react-grind` / `migration/react-linear` | React SPA must pass same `e2e/` suite |

On React migration branches, rules in `.cursor/rules/no-thymeleaf.mdc` forbid new Thymeleaf pages; UI work goes in `frontend/`.

## Debugging failures

1. Run a single file: `npx playwright test e2e/home.spec.ts`
2. Use UI mode: `npm run test:e2e:ui`
3. Inspect failure screenshots under `test-results/`
4. Confirm the app is on port 8080 and seed data loaded (H2 default)

## CI integration

E2E is primarily run locally or in agent workflows today. The Gradle CI workflow builds Java tests; extend CI with a Playwright job when you need gatekeeping on every PR.
