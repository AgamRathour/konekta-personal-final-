import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Email Authentication - Simple Flow
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// User Routes
router.get("/users/:email", authController.getUserByEmail);
router.put("/users/:email", authController.updateUser);

export default router;
