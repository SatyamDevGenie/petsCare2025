import express from "express";
import { chat, summarizeNotes, petRecommendations, askAboutService } from "../controllers/aiController.js";
import { protect, doctorOrAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: FAQ chat (booking, cancel, clinic location, etc.)
router.post("/chat", chat);

// Public: vaccination & care recommendations by pet type and age
router.post("/pet-recommendations", petRecommendations);

// Public: ask a question about a specific service (e.g. what's included, how to prepare)
router.post("/ask-about-service", askAboutService);

// Doctor or Admin only: summarize visit notes for pet owner
router.post("/summarize-notes", protect, doctorOrAdmin, summarizeNotes);

export default router;
