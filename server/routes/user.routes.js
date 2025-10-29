import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getMe, updateMe, uploadDocument, deleteDocument, getSavedSchemes, saveScheme, removeSavedScheme } from "../controllers/user.controller.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/me", authRequired, getMe);
router.put("/me", authRequired, updateMe);
router.post("/me/documents", authRequired, upload.single("file"), uploadDocument);
router.delete("/me/documents/:docId", authRequired, deleteDocument);
router.get("/me/saved-schemes", authRequired, getSavedSchemes);
router.post("/me/saved-schemes/:schemeId", authRequired, saveScheme);
router.delete("/me/saved-schemes/:schemeId", authRequired, removeSavedScheme);

export default router;


