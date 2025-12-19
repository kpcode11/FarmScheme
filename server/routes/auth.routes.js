import { Router } from "express";
import { me, clerkWebhook } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// Clerk handles authentication on the frontend
// These routes are for API integration only

// Get current user info (requires Clerk authentication)
router.get("/me", authRequired, me);

// Webhook endpoint for Clerk events (optional - for syncing users with DB)
// You'll need to configure this webhook URL in your Clerk dashboard
router.post("/webhook", clerkWebhook);

// Legacy routes removed - Clerk handles these:
// - POST /register → Use Clerk's SignUp component
// - POST /login → Use Clerk's SignIn component
// - POST /forgot-password → Handled by Clerk automatically
// - POST /reset-password → Handled by Clerk automatically

export default router;


