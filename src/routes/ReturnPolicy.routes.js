import { Router } from "express";
import { addReturnPolicy } from "../controllers/ReturmPolicy.controler.js";


const router = Router();

router.route("/add").post(addReturnPolicy);


export default router;