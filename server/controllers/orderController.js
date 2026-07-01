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

export const trackOrder = async (req, res) => {
  try {
    const { orderId, email } = req.body;

    if (!orderId || !email) {
      return res.status(400).json({ message: "Order ID and Email are required" });
    }

    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Order ID format" });
    }

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("products.product", "name image price type");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.user || order.user.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return res.status(404).json({ message: "Order not found or email mismatch" });
    }

    return res.json(order);
  } catch (error) {
    console.error("Track order error:", error);
    return res.status(500).json({ message: "Unable to track order" });
  }
};

export const updateOrderStatus = async (req,res) =>{
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    order.status = status;

    if (status === "Delivered") {
        order.deliveredAt = new Date();
    }

    await order.save();

    res.json(order);
  
}