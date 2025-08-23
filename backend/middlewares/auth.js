import jwtHelper from '../utils/jwtHelper.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = jwtHelper.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwtHelper.verifyAccessToken(token);
    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate('department', 'name');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    req.user = user;
    next();
    
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

/**
 * Authorization middleware - checks if user has required role(s)
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

/**
 * Admin only access middleware
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.'
    });
  }
  next();
};