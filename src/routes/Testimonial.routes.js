import { Router } from "express";
import { upload } from "../middlewares/FileUpload.middlwares.js";
import { createTestimonial } from "../controllers/Testimonial.controler.js";

const router = Router();
router.route("/add").post(
  upload.fields([
    {
      name: "photoUrl",
      maxCount: 1,
    },
  ]),
  createTestimonial
);

export default router;
