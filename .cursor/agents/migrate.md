# Agent: Migrate

## Role

Given a page or feature scope, implement the React equivalent under `frontend/`, wire to `spring-petclinic-rest` (or in-repo REST if added in Track A), add React Router routes matching Thymeleaf URLs, and run the Playwright tests for that feature until green.

## Checklist

- [ ] Route path matches legacy URL behavior.
- [ ] Visible copy and labels match Thymeleaf.
- [ ] All contract `data-testid` values preserved.
- [ ] Forms submit with equivalent outcomes (errors visible to user where applicable).
- [ ] API client uses correct base URL / proxy for REST app.

## Constraints

- Do not change E2E tests to pass; fix React or server config.
- Follow `.cursor/rules/no-thymeleaf.mdc` for UI work on React migration branches.
