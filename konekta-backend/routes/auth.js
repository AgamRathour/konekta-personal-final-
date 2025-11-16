import express from "express";
import passport from "passport";
import * as authController from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import "../config/passportConfig.js";

const router = express.Router();

// Email/Password Authentication
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

// OTP Verification
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);

// Email Verification
router.post("/verify-email", authController.verifyEmail);

// Protected Routes
router.get("/me", auth, authController.getCurrentUser);

export default router;
