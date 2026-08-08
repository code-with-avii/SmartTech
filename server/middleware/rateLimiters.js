import rateLimit from "express-rate-limit";

// Very strict rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: { message: "Too many password reset attempts, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15,
  message: { message: "Too many authentication attempts, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Controlled rate limiter for payments
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30,
  message: { message: "Too many payment attempts, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Higher rate limiter for products
export const productsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200,
  message: { message: "Too many product requests, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Moderate rate limiter for general API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: { message: "Too many requests, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
