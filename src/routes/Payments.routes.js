import { Router } from "express";
import {
  createPayment,
  getPaymentDetails,
  verifyPayment,
} from "../controllers/Paymets.controler.js";

const router = Router();

router.post("/create", createPayment);
router.post("/verify", verifyPayment);
router.get("/:paymentId", getPaymentDetails);
export default router;
