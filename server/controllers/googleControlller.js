import { generateAccessToken, generateRefreshToken } from "./controllers-users.js";

export async function googleAssignToken(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const { googleId, email, id, role } = req.user;
    const user = {
      userId: id,
      email: email,
      role: role,
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.redirect(
      `smarttech://auth?access_token=${token.access_token}&refresh_token=${token.refresh_token}`,
    );
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
