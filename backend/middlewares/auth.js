import jwtHelper from '../utils/jwtHelper.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { ROLES } from '../config/constants.js';

// Role hierarchy and permissions
const roleHierarchy = {
  [ROLES.ADMIN]: ['all'],
  [ROLES.DOCTOR]: ['view_patients', 'edit_patients', 'view_medical_records', 'edit_medical_records', 'manage_appointments'],
  [ROLES.NURSE]: ['view_patients', 'edit_patients', 'view_medical_records', 'edit_medical_records'],
  [ROLES.RECEPTIONIST]: ['view_patients', 'view_appointments', 'manage_appointments'],
  [ROLES.LAB_TECH]: ['view_patients', 'view_medical_records', 'edit_lab_results']
};

// Authentication middleware
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

// Role validation helper
const isValidRole = (role) => Object.values(ROLES).includes(role);

// Permission check helper
const hasPermission = (userRole, requiredPermission) => {
  const permissions = roleHierarchy[userRole] || [];
  return permissions.includes('all') || permissions.includes(requiredPermission);
};

// Role-based authorization middleware
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!isValidRole(req.user.role) || !allowedRoles.includes(req.user.role)) {
      logger.warn(`Access denied: User ${req.user._id} (${req.user.role}) attempted to access restricted route`);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!hasPermission(req.user.role, permission)) {
      logger.warn(`Permission denied: User ${req.user._id} attempted to access ${permission}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.'
    });
  }
  next();
};

// Resource ownership middleware
export const requireOwnership = (model, paramId = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params[paramId]);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      if (req.user.role === ROLES.ADMIN) {
        return next();
      }

      const hasAccess = 
        resource.createdBy?.equals(req.user._id) ||
        (resource.department && resource.department === req.user.department);

      if (!hasAccess) {
        logger.warn(`Unauthorized access attempt: User ${req.user._id} attempted to access resource ${resource._id}`);
        return res.status(403).json({
          success: false,
          message: 'Access denied. Not authorized to access this resource.'
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};