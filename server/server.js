import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import Product from "./models/product.js";
import Category from "./models/category.js";
import Order from "./models/order.js";
import User from "./models/users.js";
import cookieParser from "cookie-parser";
import verifyAccessToken, { isAdmin } from "./middleware/authmiddleware.js";
import { handlePaymentWebhook } from "./controllers/paymentController.js";
import { addProductReview } from "./controllers/reviewController.js";
import hpp from "hpp";
import { generalLimiter, productsLimiter } from "./middleware/rateLimiters.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://smart-tech-gold.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        process.env.CLIENT_URL,
      ];
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(generalLimiter);
app.use(hpp());
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handlePaymentWebhook,
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("E-commerce server running");
});

app.get("/products", productsLimiter, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search?.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: { $regex: term, $options: "i" } },
        { brand: { $regex: term, $options: "i" } },
        { type: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
      ];
    }

    // Determine limit: if a positive number is provided, use it; otherwise fetch all.
    const limitParam = req.query.limit;
    const limitNumber = Number(limitParam);
    const applyLimit = limitParam && limitNumber > 0;

    let query = Product.find(filter)
      .populate("category", "name")
      .select("name price image rating brand category variants discount featured type");
    if (applyLimit) {
      query = query.limit(limitNumber);
    }
    const products = await query.lean();
    return res.json(products);
  } catch (error) {
    console.error("Products Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/products/:id", productsLimiter, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/products/:id/reviews", productsLimiter, verifyAccessToken, addProductReview);

app.post("/products", productsLimiter, verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { price, name, image, description, category, type } = req.body;

    const product = await Product.create({
      price,
      name,
      image,
      description,
      category: category || null,
      type: type || "Mobile",
    });

    return res.json({
      message: "Product Added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/products/:id", productsLimiter, verifyAccessToken, isAdmin, async (req, res) => {
  const { price, name, image, description, category, type } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        price,
        name,
        image,
        description,
        category: category || null,
        type: type || "Mobile",
      },
      { new: true },
    ).populate("category", "name");
    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/products/:id", productsLimiter, verifyAccessToken, isAdmin, async (req, res) => {
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
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const monthlyRevenueData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthName = monthNames[d.getMonth()];
      
      const found = monthlyRevenueData.find(
        (r) => r._id.year === year && r._id.month === month
      );
      monthlyRevenue.push({
        label: monthName,
        revenue: found ? found.revenue : 0,
      });
    }

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password -refreshToken");
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.json({
      userCount,
      productCount,
      orderCount,
      revenue,
      recentUsers,
      recentOrders,
      monthlyRevenue,
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
