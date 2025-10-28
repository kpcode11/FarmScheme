import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getMe, updateMe, uploadDocument, deleteDocument } from "../controllers/user.controller.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/me", authRequired, getMe);
router.put("/me", authRequired, updateMe);
router.post("/me/documents", authRequired, upload.single("file"), uploadDocument);
router.delete("/me/documents/:docId", authRequired, deleteDocument);

export default router;


