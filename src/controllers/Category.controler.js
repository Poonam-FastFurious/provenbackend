import connectDB from "../db/index.js";
import { Category } from "../models/Category.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const createCategory = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { categoriesTitle, link, status } = req.body;

    if (![categoriesTitle, link].every((field) => field?.trim())) {
      throw new ApiError(400, "Categories title and link are required");
    }

    const existingCategory = await Category.findOne({
      $or: [{ categoriesTitle }, { link }],
    });
    if (existingCategory) {
      throw new ApiError(
        409,
        "Category with the same title or link already exists"
      );
    }

    const imageLocalPath = req.files?.image[0].path;
    let imageUrl;
    if (imageLocalPath) {
      const image = await uploadOnCloudinary(imageLocalPath);
      if (!image) {
        throw new ApiError(400, "Failed to upload image");
      }
      imageUrl = image.url;
    }

    const category = await Category.create({
      categoriesTitle,
      link,
      image: imageUrl,
      status,
    });

    const { _id: _, ...createdCategory } = category.toObject();

    return res
      .status(201)
      .json(
        new ApiResponse(200, createdCategory, "Category created successfully")
      );
  } catch (error) {
    console.error("Error during category creation:", error);

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
const updateCategoryById = async (req, res) => {
  try {
    const categoryId = req.query.categoryId; // Extract category ID from query parameter

    if (!categoryId) {
      throw new ApiError(400, "Category ID is missing");
    }

    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { categoriesTitle, link, status } = req.body;

    if (![categoriesTitle, link].every((field) => field?.trim())) {
      throw new ApiError(400, "Categories title and link are required");
    }

    const existingCategory = await Category.findOne({
      $and: [
        { _id: { $ne: categoryId } }, // Exclude current category
        { $or: [{ categoriesTitle }, { link }] },
      ],
    });
    if (existingCategory) {
      throw new ApiError(
        409,
        "Category with the same title or link already exists"
      );
    }

    const imageLocalPath = req.files?.image[0].path;
    let imageUrl;
    if (imageLocalPath) {
      const image = await uploadOnCloudinary(imageLocalPath);
      if (!image) {
        throw new ApiError(400, "Failed to upload image");
      }
      imageUrl = image.url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId, // Use category ID from query parameter
      {
        categoriesTitle,
        link,
        image: imageUrl,
        status,
      },
      { new: true }
    );

    if (!updatedCategory) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedCategory.toObject(),
          "Category updated successfully"
        )
      );
  } catch (error) {
    console.error("Error during category update:", error);

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

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.query;

  // Check if category exists
  const category = await Category.findById(id);
  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  // Delete the category
  await Category.findByIdAndDelete(id);

  return res.json({
    success: true,
    message: "Category deleted successfully",
  });
});
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  return res.json({
    success: true,
    data: categories,
  });
});

export { createCategory, deleteCategory, updateCategoryById, getAllCategories };
