# PetsCare – Groq.ai Integration Guide

This document describes **how Groq.ai is integrated** into PetsCare: setup, which features use it, API flow, and fallback to Google Gemini.

---

## Table of Contents

1. [Overview](#overview)
2. [Why Groq in PetsCare](#why-groq-in-petscare)
3. [Setup (Get API Key)](#setup-get-api-key)
4. [Backend Configuration](#backend-configuration)
5. [Where Groq Is Used](#where-groq-is-used)
6. [API Flow (Request → Groq → Response)](#api-flow-request--groq--response)
7. [Fallback to Gemini](#fallback-to-gemini)
8. [Frontend Integration](#frontend-integration)
9. [Security and Best Practices](#security-and-best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

- **Groq** is used as the **primary** AI provider for PetsCare’s AI features (FAQ chat, summarization, pet recommendations, “Ask about this service”).
- The backend calls Groq’s **OpenAI-compatible** chat API at `https://api.groq.com/openai/v1/chat/completions`.
- If `GROQ_API_KEY` is not set, the backend falls back to **Google Gemini** for the same features (optional).
- All AI logic lives in **one place**: `backend/controllers/aiController.js`. The frontend never sees API keys; it only calls your backend routes under `/api/ai/*`.

---

## Why Groq in PetsCare

| Aspect | Groq | Notes |
|--------|------|--------|
| **Cost** | Free tier, no credit card | Good for development and small/medium apps |
| **API** | OpenAI-compatible chat | Same `messages` + `system` pattern; easy to use |
| **Models** | e.g. Llama 3.3 70B, Llama 3.1 8B, Mixtral | Backend tries models in order if one fails |
| **Latency** | Often very fast | Suited for real-time chat and short answers |

PetsCare uses Groq **first**; Gemini is only used when Groq is not configured or fails.

---

## Setup (Get API Key)

1. Go to **https://console.groq.com**.
2. Sign up (free, no credit card required).
3. In the left menu: **API Keys** → **Create API Key** → copy the key (starts with `gsk_...`).
4. In your **project root** (same folder as `backend/`), open or create **`.env`** and add:
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxx_your_key_here
   ```
5. Restart the backend server.

**Optional (for better FAQ answers):**

```env
CLINIC_ADDRESS=123 Pet Care Lane, Your City, State 12345
CLINIC_HOURS=Mon–Fri 9am–6pm, Sat 9am–2pm
```

These are injected into the FAQ system prompt so the bot can answer “Where is the clinic?” and “What are the hours?” accurately.

---

## Backend Configuration

- **File:** `backend/controllers/aiController.js`
- **Endpoint used:** `https://api.groq.com/openai/v1/chat/completions`
- **Models tried in order (free tier):**
  - `llama-3.3-70b-versatile`
  - `llama-3.1-8b-instant`
  - `mixtral-8x7b-32768`

If one model returns 404 or fails, the controller tries the next. Request body uses:

- `model`: one of the above
- `messages`: `[{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }]`
- `max_tokens`: 512
- `temperature`: 0.4

The **system prompt** is built per feature (FAQ, summarization, pet recommendations, ask-about-service). For FAQ, it includes `CLINIC_ADDRESS` and `CLINIC_HOURS` from `process.env`.

---

## Where Groq Is Used

All four AI features in PetsCare use Groq when `GROQ_API_KEY` is set.

| Feature | Backend route | Purpose |
|---------|----------------|---------|
| **FAQ chat** | `POST /api/ai/chat` | “How do I book?”, “Cancel appointment?”, “Where is the clinic?”, etc. |
| **Summarize notes** | `POST /api/ai/summarize-notes` | Doctor/Admin: turn raw visit notes into a short, pet-owner-friendly summary |
| **Pet recommendations** | `POST /api/ai/pet-recommendations` | Vaccination and preventive care by pet type, age, and optional breed |
| **Ask about service** | `POST /api/ai/ask-about-service` | Answer a question about a specific service using only its title/description |

For each of these, the controller:

1. Checks for `process.env.GROQ_API_KEY`.
2. If present, calls **`callGroq(apiKey, systemPrompt, userMessage)`** (or the appropriate prompt).
3. If Groq fails or key is missing, it can fall back to **Gemini** (if `GEMINI_API_KEY` is set).

---

## API Flow (Request → Groq → Response)

Example: **FAQ chat**.

1. **Frontend** (e.g. `AiChatWidget`) sends:
   ```http
   POST /api/ai/chat
   Content-Type: application/json
   { "message": "How do I book an appointment?" }
   ```
2. **Backend** (`aiController.chat`):
   - Validates `message`.
   - Builds system prompt (booking, cancel, clinic address/hours, etc.) using `getSystemPrompt()`.
   - Calls `callGroq(GROQ_API_KEY, systemPrompt, message)`.
3. **callGroq**:
   - Loops over `GROQ_MODELS`.
   - For each model: `POST https://api.groq.com/openai/v1/chat/completions` with `Authorization: Bearer <GROQ_API_KEY>`.
   - On success: returns `{ text }` from `data.choices[0].message.content`.
   - On 404: try next model; on other error: throw.
4. **Backend** responds to frontend:
   ```json
   { "success": true, "data": { "reply": "To book an appointment..." } }
   ```
   Or on error: 400/503/429/500 with `success: false` and a `message`.

Same pattern applies to the other three features, with different system prompts and request bodies (e.g. `petType`, `age`, `breed` for pet recommendations; `serviceId` + `question` for ask-about-service; `notes` for summarize-notes).

---

## Fallback to Gemini

- If **`GROQ_API_KEY` is not set**, the backend uses **`GEMINI_API_KEY`** (if set) for all four features.
- If **Groq returns an error** (e.g. rate limit, 5xx), the code can also fall back to Gemini where implemented (e.g. in `chat`, `summarizeNotes`, `petRecommendations`, `askAboutService`).
- Gemini is called via REST (`generativelanguage.googleapis.com`), not the Groq endpoint. Models tried: `gemini-2.0-flash`, `gemini-1.5-flash`, etc. (see `GEMINI_MODELS` in `aiController.js`).

So: **Groq = primary; Gemini = optional fallback.** For “Groq-only” setup, just set `GROQ_API_KEY` and leave `GEMINI_API_KEY` unset.

---

## Frontend Integration

The frontend **never** sends a Groq (or Gemini) key. It only talks to your backend.

| Frontend file | What it does |
|---------------|--------------|
| `src/api/ai.js` | `sendAiChat(message)`, `summarizeVisitNotes(notes, getState)`, `getPetRecommendations(petType, age, breed)`, `askAboutService(serviceId, question)` – all call `/api/ai/*`. |
| `src/components/AiChatWidget.jsx` | Uses `sendAiChat` for the FAQ chat. |
| `src/pages/ServiceDetail.jsx` | Uses `askAboutService` for “Ask about this service”. |
| Pet owner / doctor flows | Use `summarizeVisitNotes` (and optional voice) and, where applicable, pet recommendations. |

So **integrating Groq** = setting `GROQ_API_KEY` on the backend and restarting. No frontend code change required.

---

## Security and Best Practices

- **Never** put `GROQ_API_KEY` in frontend code or in a public repo. Keep it only in backend `.env`.
- **Do not** commit `.env`. Use `.env.example` (without real keys) for documentation.
- All AI requests: **Browser → Your backend → Groq (or Gemini) → Your backend → Browser**. The key stays on the server.
- Optionally restrict who can call expensive or sensitive AI routes (e.g. `summarize-notes` is already protected by `protect` and `doctorOrAdmin`).

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| “AI not configured” | Ensure `GROQ_API_KEY` (or `GEMINI_API_KEY`) is in `.env` at **project root** and backend was restarted. |
| “Groq returned no text” | All models failed or returned empty content. Check Groq status; try again; ensure prompt/params are valid. |
| 429 / rate limit | You’re over Groq’s free-tier limits. Wait and retry, or add Gemini as fallback. |
| FAQ says “Check our contact page” for address | Set `CLINIC_ADDRESS` and `CLINIC_HOURS` in `.env` so the system prompt has real data. |
| CORS or network errors | Backend must allow frontend origin (`FRONTEND_URL`). Frontend must use correct `VITE_API_URL` so requests hit your backend, not Groq directly. |

For a **quick test**: open the app, click the green “?” (AiChatWidget), and ask “How do I book?”. If the backend and Groq are configured correctly, you get a short FAQ-style answer.

---

## Summary

- **Groq** is the primary AI provider for PetsCare’s FAQ, summarization, pet recommendations, and ask-about-service.
- Set **`GROQ_API_KEY`** in `.env` at project root and restart the backend.
- Optional: **`CLINIC_ADDRESS`**, **`CLINIC_HOURS`** for better FAQ answers.
- All logic is in **`backend/controllers/aiController.js`**; frontend uses **`src/api/ai.js`** and never touches Groq directly.
- **Gemini** is an optional fallback when Groq is not set or fails.

For step-by-step setup with screenshots and key creation, see also [AI_SETUP.md](./AI_SETUP.md).
