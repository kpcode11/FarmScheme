import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getMe, updateMe } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authRequired, getMe);
router.put("/me", authRequired, updateMe);

export default router;


