# API

All endpoints are served by the Express backend. Protected routes require `Authorization: Bearer <token>`.

- `GET /api/health` returns `{ "status": "ok", "database": "connected" }` or HTTP 503 with `{ "status": "degraded", "database": "unavailable" }`.
- `POST /api/auth/signup` accepts `{ "email", "password" }`, returns HTTP 201 with `{ "token", "user": { "id", "email" } }`, and returns HTTP 409 for an existing account.
- `POST /api/auth/login` accepts `{ "email", "password" }` and returns `{ "token", "user": { "id", "email" } }`.
- `POST /api/check` accepts `{ "content": "..." }` or `{ "claim": "..." }`; returns `{ "checkId", "claim", "subClaims", "status", "assessment", "evidence", "sources" }`.
- `GET /api/check/:id` returns the same saved check/result shape.
- `GET /api/check/history` returns `{ "checks": [...] }` for the authenticated user.
- `POST /api/checks` is a protected compatibility alias for creating a check; `GET /api/checks/:id` and `GET /api/checks/history` are also registered.

There are no `/api/signup`, `/api/login`, or `/api/history` routes in the current backend.
