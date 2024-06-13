import { Router } from "express";

import { addtermscondition } from "../controllers/termscondition.controler.js";


const router = Router();
router.route("/add").post(addtermscondition);

export default router;
