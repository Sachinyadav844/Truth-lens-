# API

- `GET /api/health` returns `{ "status": "ok" }`.
- `POST /api/checks` accepts `{ "claim": "..." }` and returns a check record with source placeholders.
- `POST /api/auth/login` and `POST /api/auth/signup` are reserved for authentication implementation.
