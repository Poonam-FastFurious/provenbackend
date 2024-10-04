import { Router } from "express";
import {
  createLocation,
  getAllLocations,
} from "../controllers/Storelocation.controler.js";

const router = Router();
router.route("/add").post(createLocation);
router.route("/").get(getAllLocations);

export default router;
