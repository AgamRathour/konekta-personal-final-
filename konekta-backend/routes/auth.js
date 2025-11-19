import express from "express";
import * as authController from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/users/:email", authController.getUserByEmail);

// Protected routes (require JWT token)
router.get("/me", auth, authController.getCurrentUser);
router.put("/me", auth, authController.updateUser);

export default router;
