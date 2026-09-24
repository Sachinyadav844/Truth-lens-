# Architecture

Truth-lens separates the UI, API orchestration, provider adapters, and analysis prompts. The frontend calls the backend through `frontend/src/services/api.js`; the backend coordinates source services before analysis.
