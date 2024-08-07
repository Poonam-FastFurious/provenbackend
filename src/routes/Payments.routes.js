import { Router } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentDetails,
  verifyPayment,
} from "../controllers/Paymets.controler.js";

const router = Router();

router.post("/create", createPayment);
router.post("/verify", verifyPayment);
router.get("/:paymentId", getPaymentDetails);
router.get("/", getAllPayments);
export default router;
