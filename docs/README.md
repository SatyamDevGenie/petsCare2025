# PetsCare – Documentation Index

This folder contains **full documentation** for the PetsCare project (backend, frontend, and Groq.ai integration). Use this as the entry point.

---

## Documentation Files

| Document | Description |
|----------|-------------|
| **[BACKEND.md](./BACKEND.md)** | Backend: tech stack, project structure, environment variables, database, **all API routes**, models, middleware, Socket.io, and how to run the server. |
| **[FRONTEND.md](./FRONTEND.md)** | Frontend: tech stack, project structure, routing, Redux state, API layer, theming (dark/light/classic), main components, pages, Socket.io client, and how to run the app. |
| **[GROQ_AI_INTEGRATION.md](./GROQ_AI_INTEGRATION.md)** | **How Groq.ai is integrated** in PetsCare: setup, API key, which features use Groq, request/response flow, fallback to Gemini, frontend usage, security, and troubleshooting. |
| **[AI_SETUP.md](./AI_SETUP.md)** | Step-by-step AI setup: enabling the FAQ chatbot with **Groq** (recommended) or **Google Gemini**, including key creation and optional clinic address/hours. |

---

## Quick Links by Topic

- **Backend API** → [BACKEND.md – API Routes](./BACKEND.md#api-routes)
- **Frontend pages and routes** → [FRONTEND.md – Routing](./FRONTEND.md#routing)
- **Groq.ai setup** → [GROQ_AI_INTEGRATION.md – Setup](./GROQ_AI_INTEGRATION.md#setup-get-api-key) and [AI_SETUP.md](./AI_SETUP.md)
- **Where Groq is used** → [GROQ_AI_INTEGRATION.md – Where Groq Is Used](./GROQ_AI_INTEGRATION.md#where-groq-is-used)
- **Environment variables** → [BACKEND.md – Environment Variables](./BACKEND.md#environment-variables)

---

## Project Root

All paths in these docs are relative to the **project root** `petsCare2025/`, which contains:

- `backend/` – Node.js + Express API and Socket.io
- `frontend/` – React + Vite app
- `.env` – Local env vars (copy from `.env.example`; do not commit)
- `docs/` – This documentation

Running backend and frontend from the root (or from their respective folders) is described in [BACKEND.md](./BACKEND.md#running-the-backend) and [FRONTEND.md](./FRONTEND.md#running-the-frontend).
