# Truth-lens

Truth-lens is a full-stack claim verification workspace. The repository contains a React/Vite frontend and an Express backend, with service boundaries ready for evidence gathering and AI-assisted analysis.

## Structure

- `frontend/` - React user interface
- `backend/` - Express API
- `backend/prompts/` - reusable analysis prompts
- `docs/` - architecture, API, decisions, and demo notes

## Setup

```bash
npm run install:all
npm run dev
```

The frontend runs on port 5173 and the API runs on port 4000 by default.

## Environment

Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`.

Backend variables:

- Required: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and `OPENALEX_API_KEY`.
- Optional NewsAPI provider: `NEWS_API_KEY`.
- Optional data.gov.in government fallback: `DATA_GOV_API_URL` and `DATA_GOV_API_KEY`. The PIB RSS feed is attempted first.
- Optional settings: `PORT` (defaults to 4000), `CLIENT_ORIGIN`, `GEMINI_MODEL`, and `GEMINI_TIMEOUT_MS`.

The Gemini API key is sent in the `x-goog-api-key` request header. If Gemini is not configured or fails, the API returns retrieved sources with an unknown assessment and no generated evidence.

## API Contract

- `GET /api/health` returns the service and database status; it returns HTTP 503 while MongoDB is unavailable.
- `POST /api/auth/signup` accepts `{ "email": "...", "password": "..." }` and returns `{ "token", "user": { "id", "email" } }`.
- `POST /api/auth/login` accepts the same body and returns the same token/user shape.
- `POST /api/check` requires a Bearer token, accepts `{ "content": "..." }` (or `{ "claim": "..." }`), and returns `{ "checkId", "claim", "subClaims", "status", "assessment", "evidence", "sources" }`.
- `GET /api/check/:id` and `GET /api/check/history` require a Bearer token. History returns `{ "checks": [...] }`.

There is no `/api/signup`, `/api/login`, or `/api/history` route in the current backend; use the `/api/auth/*` and `/api/check/history` paths above.
