import express, { Router } from "express";
import { Signup,Login, LogoutUser, RefreshUser } from "../controllers/controllers-users.js";
import verifyAccessToken from "../middleware/authmiddleware.js"

const authrouter= express.Router();

authrouter.post("/signup",Signup);
authrouter.post("/login",Login);
authrouter.post("/logout",verifyAccessToken,LogoutUser)
authrouter.post("/refresh",RefreshUser)


export default authrouter;