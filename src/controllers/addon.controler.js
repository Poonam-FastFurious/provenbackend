
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Addon } from "../models/addons.modal.js";

// Controller function to create a new addon
export const createAddon = asyncHandler(async (req, res) => {
      if (!req.body) {
            throw new ApiError(400, "Request body is missing or empty");
      }

      const { name, price, status } = req.body;

      if (![name, price].every((field) => field?.trim())) {
            throw new ApiError(400, "Name and price are required");
      }

      const existingAddon = await Addon.findOne({ name });
      if (existingAddon) {
            throw new ApiError(409, "Addon with the same name already exists");
      }

      const addon = new Addon({
            name,
            price,
            status
      });
      await addon.save();

      return res.status(201).json(new ApiResponse(200, addon, "Addon created successfully"));
});


export const updateAddon = asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { name, price, status } = req.body;

      const addon = await Addon.findByIdAndUpdate(id, { name, price, status }, { new: true });

      if (!addon) {
            throw new ApiError(404, "Addon not found");
      }

      return res.json(new ApiResponse(200, addon, "Addon updated successfully"));
});

// Controller function to delete an existing addon
export const deleteAddon = asyncHandler(async (req, res) => {
      const { id } = req.params;

      const addon = await Addon.findByIdAndDelete(id);

      if (!addon) {
            throw new ApiError(404, "Addon not found");
      }

      return res.json(new ApiResponse(200, {}, "Addon deleted successfully"));
});

// Controller function to get all addons
export const getAllAddon = asyncHandler(async (req, res) => {
      const addons = await Addon.find();
      return res.json(new ApiResponse(200, addons, "All addons retrieved successfully"));
});