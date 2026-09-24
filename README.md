# Truth-lens

Truth-lens is a full-stack claim verification workspace. The repository contains a React/Vite frontend and an Express backend, with service boundaries ready for evidence gathering and AI-assisted analysis.

## Structure

- `frontend/` - React user interface
- `backend/` - Express API
- `ai/prompts/` - reusable analysis prompts
- `docs/` - architecture, API, decisions, and demo notes

## Setup

```bash
npm run install:all
npm run dev
```

The frontend runs on port 5173 and the API runs on port 4000 by default.

## Environment

Copy `frontend/.env.example` and `backend/.env.example` to local `.env` files and fill in provider credentials as integrations are added.
