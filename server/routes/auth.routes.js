import { Router } from "express";
import { login, me, register, requestPasswordReset, resetPassword } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authRequired, me);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;


