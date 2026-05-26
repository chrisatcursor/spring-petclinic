# Contributing

Thank you for contributing to the Chris at Cursor fork of Spring PetClinic.

## Fork-only workflow

This repository is a **fork** of [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic). The upstream project is not maintained here.

| Do | Don't |
|----|-------|
| Clone and push to `chrisatcursor/spring-petclinic` | Add `upstream` remote to `spring-projects/spring-petclinic` |
| Open PRs with base repo `chrisatcursor/spring-petclinic` | Open PRs against `spring-projects/spring-petclinic` |
| Sync with `git fetch origin` | `git fetch` from spring-projects URLs |

Before every push or PR:

```bash
git remote -v
# origin must point to github.com/chrisatcursor/spring-petclinic
```

Create feature branches with the `cursor/` prefix for agent work (e.g. `cursor/my-feature-c2dd`).

## Pull requests

- Use descriptive titles and bodies (see `.cursor/skills/pr-composition/SKILL.md`).
- Keep changes focused; migration work should stay on the appropriate track branch when possible.
- Ensure Java build passes: `./gradlew build` or `./mvnw verify`.
- For UI changes on migration branches, run `npm run test:e2e` when applicable.

## Developer Certificate of Origin

All commits must include a **Signed-off-by** trailer:

```
Signed-off-by: Your Name <your.email@example.com>
```

See [Hello DCO, Goodbye CLA](https://spring.io/blog/2025/01/06/hello-dco-goodbye-cla-simplifying-contributions-to-spring) for details.

## Code style

- Follow [EditorConfig](https://editorconfig.org) (`.editorconfig`)
- Run format/checkstyle via the build before submitting
- Match existing package and naming conventions under `org.springframework.samples.petclinic`

## E2E and migration contributions

- **Do not** weaken or rewrite Playwright tests to pass React—fix the UI.
- **Do not** add new Thymeleaf user-facing pages on `migration/react-*` branches.
- Add `data-testid` in Thymeleaf and React together when introducing new stable selectors.

## Reporting issues

Use the fork’s GitHub issue tracker: [chrisatcursor/spring-petclinic/issues](https://github.com/chrisatcursor/spring-petclinic/issues).

For bugs in the upstream Spring sample, refer to [spring-projects/spring-petclinic/issues](https://github.com/spring-projects/spring-petclinic/issues) separately.

## License

The application is released under the [Apache License 2.0](../LICENSE.txt).
