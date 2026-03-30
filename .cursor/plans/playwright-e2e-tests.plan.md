# Playwright E2E Tests Against Thymeleaf Baseline

> **For agentic workers:** Use this plan to write the framework-agnostic Playwright E2E suite on the `e2e-tests` branch. Tests run against the Thymeleaf UI at `http://localhost:8080` and will later serve as the acceptance harness for the React SPA.

**Goal:** Create the E2E test suite described in the guiding plan. A full green run against Thymeleaf is the baseline. Later, the React SPA must pass the same tests without modification.

**Guiding principle:** Fix the app or the test contract, never weaken the test.

---

## Phase 0: Add `data-testid` attributes to Thymeleaf templates

Before writing specs, add stable `data-testid` attributes. These IDs form the contract that both Thymeleaf and React must honor.

### Contract table

| Template | Element | `data-testid` |
|----------|---------|---------------|
| `fragments/layout.html` | Home nav link | `nav-home` |
| `fragments/layout.html` | Find Owners nav link | `nav-owners` |
| `fragments/layout.html` | Vets nav link | `nav-vets` |
| `fragments/layout.html` | Error nav link | `nav-error` |
| `owners/findOwners.html` | search form | `search-owner-form` (mirrors existing `id`) |
| `owners/ownersList.html` | owners `<table>` | `owners-table` |
| `owners/ownersList.html` | each owner `<tr>` | `owner-row` |
| `owners/ownersList.html` | owner name `<a>` | `owner-name` |
| `owners/ownerDetails.html` | owner info table | `owner-information` |
| `owners/ownerDetails.html` | pets-and-visits section | `pets-and-visits` |
| `owners/ownerDetails.html` | visits table per pet | `visits-table` |
| `owners/ownerDetails.html` | Edit Owner link | `edit-owner-link` |
| `owners/ownerDetails.html` | Add New Pet link | `add-pet-link` |
| `owners/createOrUpdateOwnerForm.html` | form | `owner-form` |
| `pets/createOrUpdatePetForm.html` | form | `pet-form` |
| `pets/createOrUpdateVisitForm.html` | form | `visit-form` |
| `vets/vetList.html` | vets `<table>` | `vets-table` |
| `vets/vetList.html` | each vet `<tr>` | `vet-row` |

### Files to modify

- `src/main/resources/templates/fragments/layout.html` -- nav links
- `src/main/resources/templates/owners/findOwners.html` -- search form
- `src/main/resources/templates/owners/ownersList.html` -- table, rows, name links
- `src/main/resources/templates/owners/ownerDetails.html` -- info, pets/visits, action links
- `src/main/resources/templates/owners/createOrUpdateOwnerForm.html` -- form
- `src/main/resources/templates/pets/createOrUpdatePetForm.html` -- form
- `src/main/resources/templates/pets/createOrUpdateVisitForm.html` -- form
- `src/main/resources/templates/vets/vetList.html` -- table, rows

---

## Phase 1: Spec files

Each spec uses Playwright accessibility-first locators (`getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`, `getByTestId`) and never relies on Thymeleaf-specific DOM structure.

### 1. `e2e/home.spec.ts`

- [ ] Home page loads; heading "Welcome" visible
- [ ] PetClinic image present
- [ ] Nav links navigate: Home -> `/`, Find Owners -> `/owners/find`, Vets -> `/vets.html`

### 2. `e2e/owners-search.spec.ts`

- [ ] Empty search returns all owners; `owners-table` has multiple rows
- [ ] Search by "Davis" returns filtered results containing "Davis"
- [ ] Single-result search redirects to `/owners/{id}` detail page
- [ ] Search for "Zzzzz" shows "not found" error on the form

Seeded data: George Franklin, Betty Davis, Eduardo Rodriquez, Harold Davis, Peter McTavish, Jean Coleman, Jeff Black, Maria Escobito, David Schroeder, Carlos Estaban (from `data.sql` -- confirm exact spellings).

### 3. `e2e/owners-crud.spec.ts`

- [ ] View known owner detail: name, address, city, telephone; pets section visible
- [ ] Add new owner: fill all fields, submit, redirected to detail, flash "New Owner Created", searchable
- [ ] Edit owner: click Edit Owner, change telephone, submit, detail shows new value, flash "Owner Values Updated"
- [ ] Validation: submit blank form, inline errors appear
- [ ] Validation: non-numeric telephone -> "Telephone must be a 10-digit number"

### 4. `e2e/pets.spec.ts`

- [ ] Add pet: from owner detail, fill name/birthDate/type, submit, flash "New Pet has been Added", pet in detail
- [ ] Edit pet: click Edit Pet, change name, submit, flash "Pet details has been edited"
- [ ] Validation: duplicate pet name -> "already exists"
- [ ] Validation: future birth date -> "invalid date"

### 5. `e2e/visits.spec.ts`

- [ ] Add visit: fill date and description, submit, flash "Your visit has been booked"
- [ ] Visit appears on owner detail page with date and description

### 6. `e2e/vets.spec.ts`

- [ ] `/vets.html` loads; `vets-table` visible with rows
- [ ] At least one vet shows a specialty (not "none")
- [ ] At least one vet shows "none" for specialties
- [ ] Pagination: if page 2 link exists, click it, table still has rows

### 7. `e2e/navigation.spec.ts`

- [ ] All nav links navigate to correct URLs
- [ ] `/oups` shows "Something happened..."
- [ ] Unknown URL (`/nonexistent`) shows error page
- [ ] Browser back/forward: Home -> Owners -> back -> forward preserves history

---

## Phase 2: Green baseline and branch management

- [ ] Run `npm run test:e2e` (with `./mvnw spring-boot:run` at `:8080`)
- [ ] Iterate until all specs pass
- [ ] Commit `data-testid` template changes + all spec files to `e2e-tests` branch
- [ ] Push `e2e-tests` to origin

---

## Selector strategy

| Priority | Method | When |
|----------|--------|------|
| 1 | `getByRole` + name | Buttons, links, headings with accessible names |
| 2 | `getByLabel` | Form inputs with visible labels |
| 3 | `getByText` | Static visible text |
| 4 | `getByTestId` | Tables, rows, structural elements |
| 5 | `getByPlaceholder` | Inputs with placeholder text |

Never use CSS class selectors, `th:` attributes, or framework-generated IDs.

---

## Reference: visible English strings (messages.properties)

| Key | Text |
|-----|------|
| `welcome` | Welcome |
| `findOwner` | Find Owner |
| `addOwner` | Add Owner |
| `updateOwner` | Update Owner |
| `editOwner` | Edit Owner |
| `addNewPet` | Add New Pet |
| `editPet` | Edit Pet |
| `addVisit` | Add Visit |
| `somethingHappened` | Something happened... |
| `telephone.invalid` | Telephone must be a 10-digit number |
| `notFound` | has not been found |
| `error.404` | The requested page was not found. |

## Reference: flash messages from controllers

| Flow | Flash text |
|------|------------|
| New owner | New Owner Created |
| Edit owner | Owner Values Updated |
| New pet | New Pet has been Added |
| Edit pet | Pet details has been edited |
| New visit | Your visit has been booked |

---

## Non-goals

- No React frontend work
- No REST API creation
- No Java controller/service changes (only template `data-testid` additions)
- No CI pipeline (local only)
