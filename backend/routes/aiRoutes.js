import express from "express";
import { chat, summarizeNotes } from "../controllers/aiController.js";
import { protect, doctorOrAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: FAQ chat (booking, cancel, clinic location, etc.)
router.post("/chat", chat);

// Doctor or Admin only: summarize visit notes for pet owner
router.post("/summarize-notes", protect, doctorOrAdmin, summarizeNotes);

export default router;
