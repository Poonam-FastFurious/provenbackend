import { Router } from "express";
import { createAddon, getAllAddon } from "../controllers/addon.controler.js";

const router = Router();


router.route("/alladdons").get(getAllAddon);
router.route("/add").post(createAddon);
export default router;