import express from "express";
import {
  Signup,
  Login,
  LogoutUser,
  RefreshUser,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/controllers-users.js";
import verifyAccessToken from "../middleware/authmiddleware.js";
import passport from "passport";
import { googleAssignToken } from "../controllers/googleControlller.js";
import { updateOrderStatus } from "../controllers/orderController.js";

const authrouter = express.Router();

//api/auth
authrouter.put("/admin/orders/:id/status", verifyAccessToken,updateOrderStatus)
authrouter.post("/signup", Signup);
authrouter.post("/login", Login);
authrouter.post("/logout", verifyAccessToken, LogoutUser);
authrouter.post("/refresh", RefreshUser);

// Addresses routes
authrouter.get("/addresses", verifyAccessToken, getUserAddresses);
authrouter.post("/addresses", verifyAccessToken, addAddress);
authrouter.put("/addresses/:addressId", verifyAccessToken, updateAddress);
authrouter.delete("/addresses/:addressId", verifyAccessToken, deleteAddress);
authrouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
authrouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login`,
  }),
  googleAssignToken,
);

export default authrouter;
