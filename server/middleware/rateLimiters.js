// server/middleware/rateLimiters.js
import rateLimit from "express-rate-limit";

// 🔒 Limit login/register attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per window
  message: {
    success: false,
    message: "Too many attempts. Try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// 🔐 Limit OTP verification / password reset attempts
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 OTP attempts
  message: {
    success: false,
    message: "Too many OTP verification attempts. Please wait a few minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 

// ⚙️ Optional: a general-purpose API limiter for non-sensitive routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
