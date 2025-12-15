import { Router } from "express";
import { chat, getSuggestions, healthCheck } from "../controllers/chatbot.controller.js";

const router = Router();

// Chatbot routes (no authentication required for better accessibility)
router.post("/chat", chat);
router.get("/suggestions", getSuggestions);
router.get("/health", healthCheck);

export default router;
