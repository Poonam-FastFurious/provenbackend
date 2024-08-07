import { Router } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentDetails,
  verifyPayment,
} from "../controllers/Paymoneypayments.controler.js";

const router = Router();

router.post("/create", createPayment);
router.post("/verify", verifyPayment);
router.get("/:paymentId", getPaymentDetails);
router.get("/", getAllPayments);
router.get("/payment-details/:paymentId", getPaymentDetails);
export default router;
