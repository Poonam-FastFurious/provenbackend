import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { StoreLocation } from "../models/Storelocation.model.js";

// Create a new location (state, city, and address)
const createLocation = asyncHandler(async (req, res) => {
  // Get location details from the frontend
  const { state, cityName, Name, phone, addressDetails } = req.body;

  // Validation - Check if required fields are not empty
  if ([state, cityName, Name, phone, addressDetails].some((field) => !field)) {
    throw new ApiError(
      400,
      "All fields (state, cityName, Name, phone, addressDetails) are required."
    );
  }

  // Validate phone number length (assuming 10 digits)
  if (phone.length !== 10) {
    throw new ApiError(400, "Phone number must be 10 digits.");
  }

  // Check if the state exists, if not, create a new state with the city and address
  let location = await StoreLocation.findOne({ state });

  if (!location) {
    location = new StoreLocation({
      state,
      cities: [
        {
          name: cityName,
          addresses: [
            {
              name: Name,
              phone,
              address: addressDetails,
            },
          ],
        },
      ],
    });
  } else {
    // If the state exists, check if the city exists
    const city = location.cities.find((city) => city.name === cityName);

    if (!city) {
      // If city does not exist, create a new city with the address
      location.cities.push({
        name: cityName,
        addresses: [
          {
            name: Name,
            phone,
            address: addressDetails,
          },
        ],
      });
    } else {
      // If the city exists, add the new address
      city.addresses.push({
        name: Name,
        phone,
        address: addressDetails,
      });
    }
  }

  // Save the location (either new or updated)
  const savedLocation = await location.save(); // Save the document instance

  if (!savedLocation) {
    throw new ApiError(500, "Something went wrong while saving the location");
  }

  return res.status(201).json({
    success: true,
    data: savedLocation,
    message: "Location created successfully",
  });
});
const getAllLocations = asyncHandler(async (req, res) => {
  // Fetch all store locations from the database
  const locations = await StoreLocation.find();

  if (!locations || locations.length === 0) {
    throw new ApiError(404, "No locations found.");
  }

  return res.status(200).json({
    success: true,
    data: locations,
    message: "Locations retrieved successfully",
  });
});
export { createLocation, getAllLocations };
