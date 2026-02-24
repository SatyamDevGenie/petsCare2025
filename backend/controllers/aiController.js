import asyncHandler from "express-async-handler";

const GEMINI_REST_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

// Groq free-tier models (try in order)
const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];

// Gemini model IDs (fallback)
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-1.0-pro",
];

function getSystemPrompt() {
  const CLINIC_ADDRESS = process.env.CLINIC_ADDRESS || "Check our contact page or email for the clinic address.";
  const CLINIC_HOURS = process.env.CLINIC_HOURS || "Contact the clinic for current hours.";
  return `You are a helpful FAQ assistant for PetsCare, a pet care and veterinary appointment booking app. Answer only about:
- How to book an appointment (users sign up or sign in, go to Dashboard → Book Appointment, enter pet name and breed, choose a doctor and date/time).
- How to cancel or change an appointment (they can view "My Appointments" in the dashboard; for cancellation they should contact the clinic or check the app for cancel option).
- Where the clinic is: ${CLINIC_ADDRESS}
- Clinic hours: ${CLINIC_HOURS}
- General questions about services, doctors, and pets (e.g. "What services do you offer?" – suggest they visit the Services page; "Who are the doctors?" – Doctors page).
Keep answers short (2–4 sentences). If the question is not about PetsCare, booking, appointments, clinic location, or services, politely say you can only help with PetsCare-related questions. Do not give medical or veterinary advice; suggest they book an appointment or contact a vet.`;
}

/**
 * Groq API (free tier, no credit card). OpenAI-compatible chat endpoint.
 */
async function callGroq(apiKey, systemPrompt, userMessage) {
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch(GROQ_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          max_tokens: 512,
          temperature: 0.4,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 404) continue;
        const err = new Error(data?.error?.message || `Groq API ${res.status}`);
        err.status = res.status;
        throw err;
      }

      const text = data?.choices?.[0]?.message?.content;
      if (!text || !String(text).trim()) continue;
      return { text: String(text).trim() };
    } catch (err) {
      if (err?.status === 404) continue;
      throw err;
    }
  }
  throw new Error("Groq returned no text");
}

/**
 * Gemini REST API (no SDK).
 */
async function callGemini(apiKey, modelId, fullPrompt) {
  const url = `${GEMINI_REST_URL}/${modelId}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { maxOutputTokens: 512, temperature: 0.4 },
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error?.message || `Gemini API ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || !String(text).trim()) throw new Error("Gemini returned no text");
  return { text: String(text).trim() };
}

/**
 * @desc    Chat with AI FAQ assistant (booking, cancel, clinic location, etc.)
 * @route   POST /api/ai/chat
 * @access  Public
 * Uses Groq first (free, no card), then Gemini if GROQ_API_KEY not set.
 */
const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide a non-empty 'message' in the request body.",
    });
  }

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!groqKey && !geminiKey) {
    return res.status(503).json({
      success: false,
      message: "AI not configured. Add GROQ_API_KEY (recommended, free at console.groq.com) or GEMINI_API_KEY to .env",
    });
  }

  const systemPrompt = getSystemPrompt();
  const userMessage = message.trim();

  let lastError = null;

  if (groqKey) {
    try {
      const { text } = await callGroq(groqKey, systemPrompt, userMessage);
      return res.status(200).json({ success: true, data: { reply: text } });
    } catch (err) {
      lastError = err;
      console.error("Groq AI error:", err?.message || err);
    }
  }

  if (geminiKey) {
    const fullPrompt = `${systemPrompt}\n\nUser question: ${userMessage}`;
    for (const modelId of GEMINI_MODELS) {
      try {
        const { text } = await callGemini(geminiKey, modelId, fullPrompt);
        return res.status(200).json({ success: true, data: { reply: text } });
      } catch (err) {
        lastError = err;
        console.error(`Gemini (${modelId}) error:`, err?.message || err);
        if (err?.status === 404) continue;
        if (err?.status === 429 || err?.status === 403) break;
      }
    }
  }

  const msg = String(lastError?.message || lastError || "");
  if (msg.includes("API key") || msg.includes("invalid") || lastError?.status === 403) {
    return res.status(503).json({
      success: false,
      message: "AI key invalid. Get a free key at console.groq.com (Groq) or aistudio.google.com (Gemini).",
    });
  }
  if (lastError?.status === 429 || msg.includes("429") || msg.includes("quota") || msg.includes("rate")) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please wait a minute and try again.",
    });
  }
  return res.status(500).json({
    success: false,
    message: "AI assistant is temporarily unavailable. Try again in a moment.",
  });
});

export { chat };
