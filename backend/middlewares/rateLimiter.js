import rateLimit from 'express-rate-limit';
import MongoStore from 'rate-limit-mongo';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

// Create store instances outside the limiter config
const authStore = new MongoStore({
  uri: process.env.MONGODB_URI,
  collectionName: 'authRateLimits', // NO HYPHENS
  expireTimeMs: 15 * 60 * 1000
});

const apiStore = new MongoStore({
  uri: process.env.MONGODB_URI,
  collectionName: 'apiRateLimits', // NO HYPHENS
  expireTimeMs: 15 * 60 * 1000
});

export const authLimiter = rateLimit({
  store: authStore, // Use pre-created instance
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  },
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});

export const apiLimiter = rateLimit({
  store: apiStore, // Use pre-created instance
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  handler: (req, res, next, options) => {
    logger.warn(`API rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});