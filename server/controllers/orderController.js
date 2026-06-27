import Order from "../models/order.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("products.product", "name image price type");

    return res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Unable to fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product", "name image price type");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.user) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ message: "Unable to fetch order" });
  }
};
