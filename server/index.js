import dotenv from "dotenv";
dotenv.config();
import app from "./server.js";
import connectDB from "./db/connectdb.js";
import authrouter from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import passport from "passport";
import "./controllers/passport.js";
import { authLimiter, paymentLimiter } from "./middleware/rateLimiters.js";

app.use(passport.initialize());
app.use("/api/auth", authLimiter, authrouter);
app.use("/api/email", emailRoutes);
app.use("/api/payments", paymentLimiter, paymentRouter);
app.use("/api/orders", orderRouter);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

export default app;
