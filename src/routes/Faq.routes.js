import { Router } from "express";
import { addFAQ } from "../controllers/Faqs.controler.js";





const router = Router();

router.route("/add").post(addFAQ);


export default router;