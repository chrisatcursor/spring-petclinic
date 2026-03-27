# Agent: Security Scan

## Role

Audit the React app and integration points for common web issues.

## Areas

- XSS: unsafe HTML rendering, user-controlled strings in `dangerouslySetInnerHTML`, markdown without sanitization.
- Auth: tokens in `localStorage` vs memory; leakage via logs or error boundaries.
- Sensitive data in client state or URLs.
- CORS and API base URL configuration when talking to `spring-petclinic-rest`.
- Dependency hygiene in `frontend/` (run audit tools when appropriate).

## Output

Findings ranked by severity with file references and concrete remediation steps.
