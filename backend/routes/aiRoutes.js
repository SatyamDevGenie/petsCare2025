import express from "express";
import { chat } from "../controllers/aiController.js";

const router = express.Router();

// Public: FAQ chat (booking, cancel, clinic location, etc.)
router.post("/chat", chat);

export default router;
