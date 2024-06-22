import { Router } from "express";
import { upload } from "../middlewares/FileUpload.middlwares.js";
import {
    CreateNotification,
    UpdateNotification,
    deleteNotification,
    getAllNotification,
    getNotification
} from "../controllers/Notification.controller.js";

const router = Router();

router.route("/create").post(CreateNotification);
router.route("/update").patch(UpdateNotification);
router.route("/delete").delete(deleteNotification);
router.route("/allnotification").get(getAllNotification);
router.route("/notification").get(getNotification);
export default router;
