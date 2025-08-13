import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  validateToken,
  getSessionInfo
} from '../controllers/authController.js';
import { 
  authenticate, 
  authorize, 
  validateRefreshToken 
} from '../middlewares/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', validateRefreshToken, refreshToken);

// Protected routes (authentication required)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/logout', authenticate, logout);
router.get('/validate', authenticate, validateToken);
router.get('/sessions', authenticate, getSessionInfo);

export default router;