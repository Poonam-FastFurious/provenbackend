
import { PrivacyPolicy } from "../models/Privacypolicy.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";; // Define your error handling mechanism

// Controller to add a new privacy policy
const addPrivacyPolicy = asyncHandler(async (req, res) => {
      // Get privacy policy details from request body
      const { version, effectiveDate, sections } = req.body;

      // Validation - Check if required fields are not empty
      if (![version, effectiveDate, sections].every(field => field !== undefined)) {
            throw new ApiError(400, "Version, effectiveDate, and sections are required");
      }

      try {
            // Create the privacy policy object
            const privacyPolicy = await PrivacyPolicy.create({
                  version,
                  effectiveDate,
                  sections,
            });

            // Check for privacy policy creation
            if (!privacyPolicy) {
                  throw new ApiError(500, "Something went wrong while creating the privacy policy");
            }

            // Return success response
            res.status(201).json({
                  success: true,
                  data: privacyPolicy,
                  message: "Privacy policy created successfully",
            });
      } catch (error) {
            // Handle errors
            if (error.code === 11000) { // MongoDB duplicate key error
                  return res.status(409).json({
                        success: false,
                        message: "Privacy policy with the same version already exists",
                  });
            }
            res.status(500).json({
                  success: false,
                  message: error.message || "Internal Server Error",
            });
      }
});
const getAllPrivacyPolicies = asyncHandler(async (req, res) => {
      try {
            // Fetch all privacy policies from the database
            const privacyPolicies = await PrivacyPolicy.find();

            // Check if any privacy policies exist
            if (!privacyPolicies || privacyPolicies.length === 0) {
                  throw new ApiError(404, "No privacy policies found");
            }

            // Return success response with privacy policies data
            res.status(200).json({
                  success: true,
                  data: privacyPolicies,
                  message: "Privacy policies retrieved successfully",
            });
      } catch (error) {
            // Handle errors
            res.status(500).json({
                  success: false,
                  message: error.message || "Internal Server Error",
            });
      }
});

export { addPrivacyPolicy, getAllPrivacyPolicies }