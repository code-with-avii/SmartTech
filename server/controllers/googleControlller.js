import { generateAccessToken, generateRefreshToken } from "./controllers-users.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookieOptions.js";

export async function googleAssignToken(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    req.user.refreshToken = refreshToken;
    await req.user.save();

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    const userPayload = {
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    };

    const frontendUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/google-callback` : "http://localhost:5173/google-callback";
    res.redirect(
      `${frontendUrl}?user=${encodeURIComponent(JSON.stringify(userPayload))}`
    );
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
