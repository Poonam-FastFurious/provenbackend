// import axios from "axios";
// import crypto from "crypto";
// import { Order } from "../models/Order.model.js";
// import { Payment } from "../models/Payments.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import mongoose from "mongoose";
// const payUConfig = {
//   key: "your_payu_key",
//   salt: "your_payu_salt",
// };

// // Function to create a payment order
// export const createPayment = async (req, res) => {
//   const {
//     orderId,
//     amount,
//     currency,
//     paymentMethod,
//     userId,
//     firstName,
//     email,
//     phone,
//   } = req.body;

//   try {
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     const txnid = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//     const productinfo = "Order Payment";

//     const hashString = `${payUConfig.key}|${txnid}|${amount}|${productinfo}|${firstName}|${email}|||||||||||${payUConfig.salt}`;
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");

//     const paymentData = {
//       key: payUConfig.key,
//       txnid,
//       amount,
//       productinfo,
//       firstname: firstName,
//       email,
//       phone,
//       surl: "https://your-success-url.com",
//       furl: "https://your-failure-url.com",
//       hash,
//     };

//     console.log("Payment Data:", paymentData);

//     const response = await axios.post(
//       "https://test.payu.in/_payment",
//       paymentData
//     );

//     console.log("PayU Response:", response.data);

//     res.status(201).json({
//       paymentData: paymentData,
//       actionUrl: response.data.actionUrl,
//     });
//   } catch (error) {
//     console.error("Payment creation failed:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   const { txnid, status, hash } = req.body;

//   try {
//     const payment = await Payment.findOne({ paymentID: txnid });
//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }

//     const hashString = `${payUConfig.salt}|${status}|||||||||||${req.body.email}|${req.body.firstname}|Order Payment|${req.body.amount}|${txnid}|${payUConfig.key}`;
//     const expectedHash = crypto
//       .createHash("sha512")
//       .update(hashString)
//       .digest("hex");

//     if (expectedHash === hash) {
//       payment.status = status === "success" ? "paid" : "failed";
//       await payment.save();

//       return res
//         .status(200)
//         .json({ status: "Payment verified successfully", payment });
//     } else {
//       return res.status(400).json({ status: "Invalid hash", payment: null });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const getPaymentDetails = async (req, res) => {
//   const { paymentId } = req.params;

//   try {
//     const payment = await Payment.findOne({ paymentID: paymentId }).populate(
//       "order"
//     );
//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }

//     res.status(200).json({ payment });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getAllPayments = asyncHandler(async (req, res) => {
//   const payments = await Payment.find()
//     .populate("order")
//     .populate("user", "fullName email");
//   return res.json({
//     success: true,
//     data: payments,
//     message: "All payments retrieved successfully",
//   });
// });

// export const paymentSuccess = async (req, res) => {
//   // Implement logic to handle payment success
//   res.send("Payment successful");
// };

// export const paymentFailure = async (req, res) => {
//   // Implement logic to handle payment failure
//   res.send("Payment failed");
// };
