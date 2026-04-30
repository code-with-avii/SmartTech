import { generateAccessToken, generateRefreshToken } from "./controllers-users.js";

export async function googleAssignToken(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    req.user.refreshToken = refreshToken;
    await req.user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expiresIn: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });

    const userPayload = {
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    };

    const frontendUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/google-callback` : "http://localhost:5173/google-callback";
    res.redirect(
      `${frontendUrl}?accessToken=${accessToken}&user=${encodeURIComponent(JSON.stringify(userPayload))}`
    );
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
