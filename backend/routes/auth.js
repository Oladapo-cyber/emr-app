import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  changePassword,
} from "../controllers/authController.js";
import { authenticate, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/refresh-token", refreshToken); //Refresh token route

// Protected routes
router.post("/register", authenticate, adminOnly, register); // Only admin can create accounts
router.get("/profile", authenticate, getProfile);
router.post("/logout", authenticate, logout);
router.put("/change-password", authenticate, changePassword);

export default router;
