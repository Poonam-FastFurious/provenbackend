import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/Order.model.js"; // Assuming this is the correct path to your Order model

const placeOrder = asyncHandler(async (req, res) => {
  const { customerId, products, totalAmount, shippingInfo, paymentInfo } =
    req.body;

  // Validate required fields
  if (
    !customerId ||
    !products ||
    !totalAmount ||
    !shippingInfo ||
    !paymentInfo
  ) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    // Create the order
    const order = await Order.create({
      customer: customerId,
      products,
      totalAmount,
      shippingInfo,
      paymentInfo,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } catch (error) {
    console.error("Error placing order:", error);
    throw new ApiError(500, "Something went wrong while placing the order");
  }
});
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new ApiError(500, "Something went wrong while fetching orders");
  }
});

export { placeOrder, getAllOrders };
