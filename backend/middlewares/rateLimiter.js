import rateLimit from 'express-rate-limit';
import MongoStore from 'rate-limit-mongo';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Auth routes limiter (login, register, password reset)
export const authLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'auth-rate-limits',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  },
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});

// General API routes limiter
export const apiLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'api-rate-limits',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  handler: (req, res, next, options) => {
    logger.warn(`API rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});