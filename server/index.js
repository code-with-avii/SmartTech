import dotenv from "dotenv";
dotenv.config();
import app from "./server.js";
import connectDB from "./db/connectdb.js";
import authrouter from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import passport from "passport";
import "./controllers/passport.js";

app.use(passport.initialize());
app.use("/api/auth", authrouter);
app.use("/api/email", emailRoutes);
app.use("/api/payments", paymentRouter);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

export default app;
