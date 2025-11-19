import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5175",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// MongoDB Connection with Retry Logic
// ============================================
// QUICK LOCAL START (Windows):
// 1. Create data dir: mkdir C:\data\db
// 2. Run mongod: mongod --dbpath "C:\data\db"
// Or install MongoDB as a service and start it.
// If 'localhost' fails, use 127.0.0.1 in MONGO_URI to avoid IPv6 resolution issues.

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/konekta";

const connectWithRetry = async (retries = 5, delayMs = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoUri);
      console.log("✅ MongoDB connected");
      return true;
    } catch (err) {
      const attempt = i + 1;
      console.warn(`⚠️ MongoDB connection attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  console.error("❌ MongoDB failed to connect after retries. Continuing without DB (development).");
  return false;
};

// Initiate connection with retry
connectWithRetry().catch((err) => {
  console.error("Fatal error during connection:", err);
});

// Connection event handlers
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connection established");
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err && err.message);
});

// Graceful shutdown handler
const gracefulExit = async () => {
  console.log("\n🛑 Graceful shutdown initiated...");
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      console.log("🔒 MongoDB connection closed");
    }
    console.log("👋 Server shutting down");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown on termination signals
process.on("SIGINT", gracefulExit);
process.on("SIGTERM", gracefulExit);
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
  gracefulExit();
});

const server = app.listen(PORT, () => {
  console.log(`🔧 Server starting — NODE_ENV=${NODE_ENV}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5175"}`);
  console.log(`🔎 MongoDB URI: ${mongoUri}`);
});

server.on("error", (err) => {
  console.error("❌ Server error:", err.message);
  process.exit(1);
});
