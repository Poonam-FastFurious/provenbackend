// controllers/testimonial.controller.js

import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Testimonial } from "../models/Testimonial.modal.js";

const createTestimonial = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { name, message, rating, email } = req.body;

    if (![name, message, email].every((field) => field?.trim()) || !rating) {
      throw new ApiError(400, "Name, message, rating, and email are required");
    }

    const existingTestimonial = await Testimonial.findOne({ email });
    if (existingTestimonial) {
      throw new ApiError(409, "Testimonial from this email already exists");
    }

    const imageLocalPath = req.files?.photo?.[0]?.path;
    let photoUrl;
    if (imageLocalPath) {
      const image = await uploadOnCloudinary(imageLocalPath);
      if (!image) {
        throw new ApiError(400, "Failed to upload image");
      }
      photoUrl = image.url;
    }

    const testimonial = await Testimonial.create({
      name,
      message,
      rating,
      email,
      photoUrl,
    });

    const { _id: _, ...createdTestimonial } = testimonial.toObject();

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdTestimonial,
          "Testimonial created successfully"
        )
      );
  } catch (error) {
    console.error("Error during testimonial creation:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { createTestimonial };
