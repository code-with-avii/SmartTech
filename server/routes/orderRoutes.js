import express from "express";
import verifyAccessToken, { isAdmin } from "../middleware/authmiddleware.js";
import { getMyOrders, getOrderById, trackOrder, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/", verifyAccessToken, getMyOrders);
orderRouter.get("/admin/orders", verifyAccessToken, isAdmin, getAllOrders);
orderRouter.get("/:id", verifyAccessToken, getOrderById);
orderRouter.put("/:id/status", verifyAccessToken, isAdmin, updateOrderStatus);
orderRouter.post("/track", trackOrder);

export default orderRouter;
