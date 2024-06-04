import { Router } from "express";
import { getAllOrders, placeOrder } from "../controllers/Order.controler.js";

const router = Router();

router.route("/add").post(placeOrder);
router.route("/allorder").get(getAllOrders);

export default router;
