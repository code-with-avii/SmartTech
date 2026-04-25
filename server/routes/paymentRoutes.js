import express from "express";
import verifyAccessToken from "../middleware/authmiddleware.js";
import { createOrder, getPaymentStatus, verifyPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", verifyAccessToken, createOrder);
paymentRouter.post("/verify-payment", verifyAccessToken, verifyPayment);
paymentRouter.get("/status/:orderId", verifyAccessToken, getPaymentStatus);

export default paymentRouter;
