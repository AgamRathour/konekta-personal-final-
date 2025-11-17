import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, "../data/users.json");

// Initialize mock database
const initMockDb = () => {
  const dataDir = path.join(__dirname, "../data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify([], null, 2));
  }
};

const readMockDb = () => {
  try {
    const data = fs.readFileSync(dbFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeMockDb = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

initMockDb();

// Check if MongoDB is connected
const isMongoDbConnected = async () => {
  try {
    const client = User.collection.conn;
    return client && client.readyState === 1;
  } catch {
    return false;
  }
};

// Use MongoDB if connected, otherwise use mock DB
const useDb = async () => {
  const isConnected = await isMongoDbConnected();
  return isConnected ? "mongodb" : "mock";
};

// Sign Up - Create new user
export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const dbType = await useDb();

    if (dbType === "mongodb") {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = await User.create({
        firstName,
        lastName,
        email,
        isNewUser: true,
        authProvider: "email",
      });

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isNewUser: user.isNewUser,
        },
      });
    } else {
      // Use mock DB
      const users = readMockDb();
      if (users.find((u) => u.email === email)) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        username: null,
        fullName: null,
        bio: null,
        profilePic: null,
        interests: [],
        isNewUser: true,
        createdAt: new Date(),
      };

      users.push(newUser);
      writeMockDb(users);

      return res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Login - Get user by email
export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const dbType = await useDb();

    if (dbType === "mongodb") {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          fullName: user.fullName,
          bio: user.bio,
          profilePic: user.profilePic,
          interests: user.interests || [],
          isNewUser: user.isNewUser,
        },
      });
    } else {
      // Use mock DB
      const users = readMockDb();
      const user = users.find((u) => u.email === email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        message: "Login successful",
        user,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Get user by email
export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const dbType = await useDb();

    if (dbType === "mongodb") {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          fullName: user.fullName,
          bio: user.bio,
          profilePic: user.profilePic,
          interests: user.interests || [],
          isNewUser: user.isNewUser,
        },
      });
    } else {
      // Use mock DB
      const users = readMockDb();
      const user = users.find((u) => u.email === email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ user });
    }
  } catch (err) {
    next(err);
  }
};

// Update user (interests, profile, username)
export const updateUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { username, fullName, bio, profilePic, interests, isNewUser } =
      req.body;

    const dbType = await useDb();

    if (dbType === "mongodb") {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields if provided
      if (username) user.username = username;
      if (fullName) user.fullName = fullName;
      if (bio) user.bio = bio;
      if (profilePic) user.profilePic = profilePic;
      if (interests) user.interests = interests;
      if (isNewUser !== undefined) user.isNewUser = isNewUser;

      user.updatedAt = new Date();
      await user.save();

      return res.json({
        message: "User updated successfully",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          fullName: user.fullName,
          bio: user.bio,
          profilePic: user.profilePic,
          interests: user.interests || [],
          isNewUser: user.isNewUser,
        },
      });
    } else {
      // Use mock DB
      const users = readMockDb();
      const userIndex = users.findIndex((u) => u.email === email);

      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = users[userIndex];
      if (username) user.username = username;
      if (fullName) user.fullName = fullName;
      if (bio) user.bio = bio;
      if (profilePic) user.profilePic = profilePic;
      if (interests) user.interests = interests;
      if (isNewUser !== undefined) user.isNewUser = isNewUser;
      user.updatedAt = new Date();

      users[userIndex] = user;
      writeMockDb(users);

      return res.json({
        message: "User updated successfully",
        user,
      });
    }
  } catch (err) {
    next(err);
  }
};
