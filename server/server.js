import express from "express";
import cors from "cors";
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
dotenv.config();


import Product from "./models/product.js";
import Category from "./models/category.js";
import Order from "./models/order.js";
import User from "./models/users.js";
import cookieParser from "cookie-parser";
import verifyAccessToken, { isAdmin } from "./middleware/authmiddleware.js";
import { handlePaymentWebhook } from "./controllers/paymentController.js";
import hpp from "hpp";


const app = express();
app.use(helmet())
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [

      "https://smart-tech-gold.vercel.app",
      process.env.CLIENT_URL
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit:100,
})
app.use(limiter);
app.use(mongoSanitize())
app.use(hpp())
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handlePaymentWebhook);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("E-commerce server running");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/products", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { price, name, image, description, category } = req.body;

    const product = await Product.create({
      price,
      name,
      image,
      description,
      category: category || null
    });

    return res.json({
      message: "Product Added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/products/:id", verifyAccessToken, isAdmin, async (req, res) => {
  const { price, name, image, description, category } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { price, name, image, description, category: category || null },
      { new: true }
    ).populate("category", "name");
    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/products/:id", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Categories APIs
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/categories", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category" });
  }
});

app.delete("/categories/:id", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
});

// Admin Stats
app.get("/api/admin/stats", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    // Calculate total revenue from Orders
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("-password -refreshToken");
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email");

    res.json({
      userCount,
      productCount,
      orderCount,
      revenue,
      recentUsers,
      recentOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Not allowed by CORS" });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
