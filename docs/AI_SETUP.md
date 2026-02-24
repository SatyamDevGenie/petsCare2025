# PetsCare AI FAQ – Setup Guide

This guide explains how to enable the **AI FAQ chatbot** (answers “How do I book?”, “Cancel appointment?”, “Where is the clinic?”, etc.). You can use **Groq** (recommended, free, no card) or **Google Gemini**.

---

## Option A: Groq (recommended – free, no credit card)

1. Go to **https://console.groq.com**
2. Sign up (free, no credit card).
3. Open **API Keys** in the left menu → **Create API Key** → copy the key.
4. In your project root, open **`.env`** and add:
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxx_your_key_here
   ```
5. Restart the backend. Use the **green “?”** button (bottom-right) on the site to test the FAQ.

---

## Option B: Google Gemini (free)

## Step-by-step: How to generate the Gemini API key (free)

### 1. Open Google AI Studio

- Go to: **https://aistudio.google.com**
- Sign in with your **Google account**.

### 2. Create or select a project (optional)

- In the left sidebar you may see “Create project” or a project list.
- You can use the default project; no need to create one unless you want to separate usage.

### 3. Get an API key

- In the left menu, click **“Get API key”** (or **“API keys”** / **“Create API key”**).
- Click **“Create API key”**.
- Choose an existing Google Cloud project **or** “Create API key in new project” (Google will create a project for you).
- After a few seconds, your **API key** is shown (a long string starting with `AIza...`).
- **Copy the key** and store it somewhere safe. You can also copy it from the API keys list later.

### 4. (Optional) Check free tier limits

- In AI Studio you can see usage/limits.
- **Gemini 1.5 Flash** free tier is typically:
  - **60 requests per minute**
  - **1,500 requests per day**
  - **1 million tokens per minute**
- This is enough for a small/medium app’s FAQ chat.

### 5. Add the key to your backend

- Open the **backend** `.env` file in your project root (same folder as `backend/`):

  **Path:** `petsCare---Deployment/.env`

- Add this line (replace with your actual key):

  ```env
  GEMINI_API_KEY=AIzaSy...your_key_here
  ```

- **Optional** – So the AI can answer “Where is the clinic?” accurately, you can add:

  ```env
  CLINIC_ADDRESS=123 Pet Care Lane, Your City, State 12345
  CLINIC_HOURS=Mon–Fri 9am–6pm, Sat 9am–2pm
  ```

  If you don’t set these, the bot will say something like “Check our contact page” or “Contact the clinic for hours.”

### 6. Install backend dependency and run

From the **project root** (e.g. `petsCare---Deployment`):

```bash
npm install @google/generative-ai
```

Then start the backend (and frontend if needed):

```bash
npm run server
# or
npm run dev
```

### 7. Test the chatbot

- Open your app in the browser (e.g. `http://localhost:5173`).
- Click the **green help (?) button** at the bottom-right.
- Ask: **“How do I book?”** or **“Where is the clinic?”** or **“How can I cancel my appointment?”**
- You should get short, FAQ-style answers.

If you see *“AI assistant is not configured”*, the backend did not get `GEMINI_API_KEY` (check `.env` and restart the server).

---

## API key security

- **Never** commit `.env` or your API key to Git (add `.env` to `.gitignore`).
- The key is used **only on the backend**; the frontend never sees it.
- All FAQ requests go: **Browser → Your backend → Google Gemini → Your backend → Browser**.

---

## Summary checklist

| Step | Action |
|------|--------|
| 1 | Go to https://aistudio.google.com and sign in |
| 2 | Click “Get API key” / “Create API key” and copy the key |
| 3 | Add `GEMINI_API_KEY=your_key` to `.env` (and optionally `CLINIC_ADDRESS`, `CLINIC_HOURS`) |
| 4 | Run `npm install @google/generative-ai` in project root |
| 5 | Restart backend and test the help chat on the site |

After this, the AI FAQ that answers “How do I book?”, “Cancel appointment?”, and “Where is the clinic?” is fully set up and free within Gemini’s limits.
