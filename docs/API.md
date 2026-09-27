# API

- `GET /api/health` returns `{ "status": "ok" }`.
- `POST /api/check` accepts `{ "claim": "..." }`, requires a Bearer token, and returns a mock check with `checkId`, `claim`, `assessment`, `evidence`, and `sources` fields. `POST /api/checks` remains available as a protected compatibility alias.
- `POST /api/auth/login` and `POST /api/auth/signup` are reserved for authentication implementation.
