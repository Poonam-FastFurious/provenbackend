import { Router } from "express";
import { addPrivacyPolicy } from "../controllers/Privacypolicy.controler.js";


const router = Router();
router.route("/add").post(addPrivacyPolicy);

export default router;
