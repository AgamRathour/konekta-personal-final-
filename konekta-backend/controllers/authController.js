import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  sendVerificationEmail,
  sendOTPEmail,
  sendWelcomeEmail,
} from "../utils/mailer.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Signup
export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth } =
      req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      authProvider: "email",
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (err) {
      console.error("Email send error:", err.message);
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "Signup successful. Check your email to verify.",
      user: { id: user._id, email: user.email, firstName, lastName },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth Callback
export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;
    const token = generateToken(user._id);
    const isNewUser = !user.lastLogin || user.createdAt === user.updatedAt;

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&isNewUser=${isNewUser}`;
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

// Get Current User
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp");
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Send OTP
export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, firstName: "User" });
    }

    const otp = user.generateOTP();
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (err) {
      console.error("Email send error:", err.message);
    }

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// Verify Email Token
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};
