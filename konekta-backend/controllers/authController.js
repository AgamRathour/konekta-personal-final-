import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

// Generate JWT Token
const generateToken = (userId) => {
  const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_change_this";
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Sign Up - Create new user with email and password
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    console.log(`✅ User created: ${email}`);

    return res.status(201).json({
      message: "Account created successfully. Please log in.",
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    next(err);
  }
};

// Login - Verify email and password, return JWT
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    console.log(`✅ User logged in: ${email}`);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    next(err);
  }
};

// Get current user (protected route)
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profileImage: user.profileImage,
        interests: user.interests,
      },
    });
  } catch (err) {
    console.error("❌ Get current user error:", err.message);
    next(err);
  }
};

// Update user profile
export const updateUser = async (req, res, next) => {
  try {
    const { username, fullName, bio, profileImage, interests } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (interests !== undefined) updateData.interests = interests;
    updateData.updatedAt = Date.now();

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    console.log(`✅ User updated: ${user.email}`);

    return res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profileImage: user.profileImage,
        interests: user.interests,
      },
    });
  } catch (err) {
    console.error("❌ Update user error:", err.message);
    next(err);
  }
};

// Get user by email (public endpoint)
export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase() }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profileImage: user.profileImage,
        interests: user.interests,
      },
    });
  } catch (err) {
    console.error("❌ Get user by email error:", err.message);
    next(err);
  }
};
