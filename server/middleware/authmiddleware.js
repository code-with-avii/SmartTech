import jwt from "jsonwebtoken";

const verifyAccessToken = (req, res, next) => {
  let token = req.cookies.accessToken;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ message: "Access token missing. Please login again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Access token invalid or expired. Please login again." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

export default verifyAccessToken;