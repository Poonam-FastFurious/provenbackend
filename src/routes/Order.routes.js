import { Router } from "express";
import {
  getAllOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/Order.controler.js";

const router = Router();

router.route("/add").post(placeOrder);
router.route("/allorder").get(getAllOrders);

router.route("/updateorder").patch(updateOrderStatus);

export default router;
