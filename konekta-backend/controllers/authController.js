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

// Generate temporary password
const generateTempPassword = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Sign Up - Create new user with temporary password
export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !dateOfBirth) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const users = readMockDb();
    
    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      tempPassword, // Send this to user
      isPasswordSet: false,
      username: null,
      fullName: `${firstName} ${lastName}`,
      bio: null,
      profilePic: null,
      interests: [],
      isNewUser: true,
      createdAt: new Date(),
    };

    users.push(newUser);
    writeMockDb(users);

    return res.status(201).json({
      message: "User created successfully. Use temporary password to login.",
      tempPassword, // Return to frontend to show to user
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        dateOfBirth: newUser.dateOfBirth,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Login - Verify email and password
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const users = readMockDb();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // Check if password matches (either temp password or permanent password)
    const isPasswordValid = password === user.tempPassword || password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If temp password was used, don't update yet (let user set permanent in onboarding)
    // If permanent password, user is returning
    
    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profilePic: user.profilePic,
        interests: user.interests || [],
        isNewUser: user.isNewUser,
        isPasswordSet: user.isPasswordSet,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get user by email
export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const users = readMockDb();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profilePic: user.profilePic,
        interests: user.interests || [],
        isNewUser: user.isNewUser,
        isPasswordSet: user.isPasswordSet,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Set permanent password (after first login with temp password)
export const setPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const users = readMockDb();
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[userIndex].password = password;
    users[userIndex].isPasswordSet = true;
    users[userIndex].updatedAt = new Date();

    writeMockDb(users);

    return res.json({
      message: "Password set successfully",
      user: users[userIndex],
    });
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
  } catch (err) {
    next(err);
  }
};
