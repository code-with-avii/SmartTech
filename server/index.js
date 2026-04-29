import dotenv from "dotenv";
dotenv.config();
import app from "./server.js";
import connectDB from "./db/connectdb.js";
import authrouter from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import passport from "passport";
import "./controllers/passport.js";

app.use("/api/auth", authrouter);
app.use("/api/email", emailRoutes);
app.use("/api/payments", paymentRouter);
app.use(passport.initialize());

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    }),
  )
  .catch((err) => {
    console.log(err);
  });
