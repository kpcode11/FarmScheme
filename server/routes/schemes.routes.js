import { Router } from "express";
import { getAllschemes } from "../controllers/schemes.js";
import { getStateSchemes } from "../controllers/schemes.js";
import { getCentralSchemes } from "../controllers/schemes.js";
import { getSchemeById } from "../controllers/schemes.js";

const router = Router();

router.route("/").get(getAllschemes);
router.route("/page/:page/limit/:limit").get(getAllschemes);
router.route("/state").get(getStateSchemes);
router.route("/state/page/:page/limit/:limit").get(getStateSchemes);
router.route("/central").get(getCentralSchemes);
router.route("/central/page/:page/limit/:limit").get(getCentralSchemes);
router.route('/:id').get(getSchemeById);

export default router;
