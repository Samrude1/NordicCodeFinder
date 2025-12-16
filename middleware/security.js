// middleware/security.js

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

/**
 * Security middleware for Express 2025
 * - Helmet + CSP
 * - Rate limiting
 * - CORS
 *
 * XSS / NoSQL protection handled in controllers.
 */
const securityMiddleware = (app) => {
  // -------------------- 1. Security Headers --------------------
  app.use(helmet());

  // Helmet Content Security Policy (CSP)
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:"],
      },
    })
  );

  // -------------------- 2. Rate Limiting --------------------
  // Default: 100 requests per 15 min per IP for all API routes
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      error:
        "Too many requests from this IP, please try again after 15 minutes",
    },
  });
  app.use("/api", apiLimiter);

  // Optional: separate stricter limiter for login route
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // Increased for testing
    message: {
      success: false,
      error: "Too many login attempts, try again after 15 minutes",
    },
  });
  app.use("/api/v1/auth/login", loginLimiter);

  // -------------------- 3. CORS --------------------
  app.use(
    cors({
      origin: ["http://localhost:3000"], // lisää frontend URLit tänne
      credentials: true,
    })
  );

  // -------------------------------------------
  // Huom: XSS ja NoSQL käsitellään kontrollerissa!
  // Ei xss-clean tai hpp middlewarea → ei getter-only virheitä
  // -------------------------------------------
};

module.exports = securityMiddleware;
