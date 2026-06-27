import express from "express";
import verifyAccessToken from "../middleware/authmiddleware.js";
import { getMyOrders, getOrderById } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/", verifyAccessToken, getMyOrders);
orderRouter.get("/:id", verifyAccessToken, getOrderById);

export default orderRouter;
