import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/Cart.model.js";

import { User } from "../models/User.model.js"; // Import the User model
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/NewProduct.modal.js";

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User not authenticated");
  }


  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Find the user's cart
  let cart = await Cart.findOne({ user: req.user._id });

  // If the user doesn't have a cart, create a new one
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
      total: 0,
      status: "active",
    });
  }

  // Check if the product is already in the cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex !== -1) {
    // If the product is already in the cart, update the quantity
    cart.items[existingItemIndex].quantity += quantity || 1;
  } else {
    // If the product is not in the cart, add it as a new item
    cart.items.push({
      product: productId,
      quantity: quantity || 1,
      price: product.oneTimePrice,
    });
  }

  // Ensure all items have a valid price
  cart.items.forEach((item) => {
    if (!item.price) {
      item.price = product.price;
    }
  });

  // Calculate the total price of the cart
  cart.total = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  // Save the cart
  await cart.save();

  // Omit quantity from the response cart object
  const responseCart = {
    ...cart.toObject(),
    items: cart.items.map((item) => ({
      product: item.product,
      price: item.price,
    })),
  };

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    cart: responseCart,
    username: req.user.fullName,
  });
});

const getCart = asyncHandler(async (req, res) => {
  console.log("getCart route hit");
  if (!req.user || !req.user._id) {
    console.log("User not authenticated");
    throw new ApiError(401, "User not authenticated");
  }

  // Find the user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select: "productTitle price description image", // Add 'image' field to select
  });

  if (!cart) {
    console.log("Cart not found");
    res.status(404).json({
      success: false,
      message: "Cart not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    cart,
    username: req.user.fullName, // Include the full name in the response
  });
});
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User not authenticated");
  }

  // Find the user's cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find the index of the item to remove
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // Remove the item from the cart
  cart.items.splice(itemIndex, 1);

  // Recalculate the total price of the cart
  cart.total = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  // Save the cart
  await cart.save();

  // Omit quantity from the response cart object
  const responseCart = {
    ...cart.toObject(),
    items: cart.items.map((item) => ({
      product: item.product,
      price: item.price,
    })),
  };

  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    cart: responseCart,
    username: req.user.fullName,
  });
});

export { addToCart, getCart, removeFromCart };
