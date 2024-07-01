import { Router } from "express";
import { createAddress, getAddresses, updateAddress } from "../controllers/Address.controler.js";
import { verifyJWT } from "../middlewares/auth.middlwares.js";



const router = Router();

router.route("/add").post(verifyJWT, createAddress);
router.route("/").get(verifyJWT, getAddresses);
router.route("/update").patch(verifyJWT, updateAddress);

export default router;