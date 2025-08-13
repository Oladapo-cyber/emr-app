import jwtHelper from '../utils/jwtHelper.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    const token = jwtHelper.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Verify access token
    const decoded = jwtHelper.verifyAccessToken(token);
    
    // Find user and exclude password
    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate('department', 'name');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Attach user and token info to request object
    req.user = user;
    req.token = token;
    req.tokenPayload = decoded;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid token.',
      code: 'INVALID_TOKEN'
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
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user._id} (${req.user.employeeId}) with role ${req.user.role}`);
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Permission-based authorization middleware
 * @param {string} permission - Required permission
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!req.user.hasPermission || !req.user.hasPermission(permission)) {
      logger.warn(`Permission denied for user ${req.user._id} (${req.user.employeeId}): missing ${permission}`);
      
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${permission}`,
        code: 'PERMISSION_DENIED',
        requiredPermission: permission,
        userRole: req.user.role,
        employeeId: req.user.employeeId
      });
    }

    next();
  };
};

/**
 * Multiple permissions middleware - requires ALL specified permissions
 * @param {...string} permissions - Required permissions (user must have ALL)
 */
export const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    const missingPermissions = permissions.filter(permission => 
      !req.user.hasPermission || !req.user.hasPermission(permission)
    );

    if (missingPermissions.length > 0) {
      logger.warn(`Multiple permissions denied for user ${req.user._id} (${req.user.employeeId}): missing ${missingPermissions.join(', ')}`);
      
      return res.status(403).json({
        success: false,
        message: `Access denied. Missing required permissions: ${missingPermissions.join(', ')}`,
        code: 'MULTIPLE_PERMISSIONS_DENIED',
        missingPermissions,
        userRole: req.user.role,
        employeeId: req.user.employeeId
      });
    }

    next();
  };
};

/**
 * Multiple permissions middleware - requires ANY of the specified permissions
 * @param {...string} permissions - Required permissions (user needs at least ONE)
 */
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    const hasAnyPermission = permissions.some(permission => 
      req.user.hasPermission && req.user.hasPermission(permission)
    );

    if (!hasAnyPermission) {
      logger.warn(`No required permissions found for user ${req.user._id} (${req.user.employeeId}): needs one of ${permissions.join(', ')}`);
      
      return res.status(403).json({
        success: false,
        message: `Access denied. Required at least one of: ${permissions.join(', ')}`,
        code: 'NO_REQUIRED_PERMISSIONS',
        requiredPermissions: permissions,
        userRole: req.user.role,
        employeeId: req.user.employeeId
      });
    }

    next();
  };
};

/**
 * Optional authentication - attaches user if token is present but doesn't fail if missing
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = jwtHelper.extractTokenFromHeader(authHeader);

    if (token && !jwtHelper.isTokenExpired(token)) {
      const decoded = jwtHelper.verifyAccessToken(token);
      const user = await User.findById(decoded.userId)
        .select('-password')
        .populate('department', 'name');
      
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
        req.tokenPayload = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    logger.debug('Optional auth failed, continuing without user:', error.message);
    next();
  }
};

/**
 * Middleware to check if user owns the resource or has admin privileges
 * @param {string} resourceUserField - Field name that contains the user ID in the resource
 */
export const ownerOrAdmin = (resourceUserField = 'createdBy') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    // Admin can access anything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.resource?.[resourceUserField]?.toString();
    const currentUserId = req.user._id.toString();

    if (resourceUserId !== currentUserId) {
      logger.warn(`Ownership check failed for user ${req.user._id} (${req.user.employeeId}) on resource with ${resourceUserField}: ${resourceUserId}`);
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.',
        code: 'OWNERSHIP_REQUIRED',
        employeeId: req.user.employeeId
      });
    }

    next();
  };
};

/**
 * Middleware to validate refresh token
 */
export const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = jwtHelper.verifyRefreshToken(refreshToken);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token or inactive user.',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    req.user = user;
    req.refreshTokenPayload = decoded;
    next();

  } catch (error) {
    logger.error('Refresh token validation error:', error);
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid refresh token.',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
};

/**
 * Middleware for department-based access control
 * @param {...string} allowedDepartments - Departments that can access the route
 */
export const requireDepartment = (...allowedDepartments) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    // Admin can access any department
    if (req.user.role === 'admin') {
      return next();
    }

    const userDepartment = req.user.department?.name || req.user.department;
    
    if (!allowedDepartments.includes(userDepartment)) {
      logger.warn(`Department access denied for user ${req.user._id} (${req.user.employeeId}) in department ${userDepartment}`);
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Department not authorized.',
        code: 'DEPARTMENT_ACCESS_DENIED',
        requiredDepartments: allowedDepartments,
        userDepartment,
        employeeId: req.user.employeeId
      });
    }

    next();
  };
};