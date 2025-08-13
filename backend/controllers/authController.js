import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwtHelper from '../utils/jwtHelper.js';
import logger from '../utils/logger.js';

/**
 * @desc    Register new user (Admin only in production)
 * @route   POST /api/auth/register
 * @access  Public (Admin only in production)
 */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      phoneNumber,
      specialization,
      licenseNumber,
      employeeId
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { employeeId: employeeId }
      ]
    });

    if (existingUser) {
      const duplicateField = existingUser.email === email.toLowerCase() ? 'email' : 'employee ID';
      return res.status(400).json({
        success: false,
        message: `User already exists with this ${duplicateField}.`,
        code: 'USER_EXISTS',
        field: duplicateField
      });
    }

    // Validate required fields based on role
    if (role === 'doctor' && !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'License number is required for doctors.',
        code: 'MISSING_LICENSE'
      });
    }

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required.',
        code: 'MISSING_EMPLOYEE_ID'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      department,
      phoneNumber,
      specialization,
      licenseNumber,
      employeeId,
      fullName: `${firstName} ${lastName}`
    });

    await user.save();

    // Generate token pair using your JWT helper
    const tokenPair = jwtHelper.generateTokenPair(user);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`New user registered: ${email} (${role}) - Employee ID: ${employeeId}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: userResponse,
        ...tokenPair
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: messages,
        code: 'VALIDATION_ERROR'
      });
    }

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateField} already exists.`,
        code: 'DUPLICATE_FIELD',
        field: duplicateField
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
      code: 'REGISTRATION_ERROR'
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, employeeId, password } = req.body;

    // Validate input - allow login with either email or employeeId
    if ((!email && !employeeId) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Employee ID and password are required.',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Build query - find by email or employeeId
    const query = {};
    if (email) {
      query.email = email.toLowerCase();
    } else {
      query.employeeId = employeeId;
    }

    // Find user and include password for comparison
    const user = await User.findOne(query)
      .select('+password')
      .populate('department', 'name');

    if (!user) {
      logger.warn(`Failed login attempt with ${email ? 'email' : 'employeeId'}: ${email || employeeId}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      logger.warn(`Login attempt on inactive account: ${user.email} (${user.employeeId})`);
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Contact administrator.',
        code: 'ACCOUNT_INACTIVE',
        employeeId: user.employeeId
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Failed password attempt for user: ${user.email} (${user.employeeId})`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login and login count
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // Generate token pair using your JWT helper
    const tokenPair = jwtHelper.generateTokenPair(user);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User logged in: ${user.email} (${user.employeeId}) - Login count: ${user.loginCount}`);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: userResponse,
        ...tokenPair
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
      code: 'LOGIN_ERROR'
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('department', 'name');

    // Add token expiration info
    const tokenExpiration = jwtHelper.getTokenExpiration(req.token);

    res.json({
      success: true,
      data: { 
        user,
        tokenExpiration,
        tokenInfo: {
          type: req.tokenPayload?.type,
          issuedAt: new Date(req.tokenPayload?.iat * 1000),
          expiresAt: tokenExpiration
        }
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile.',
      code: 'PROFILE_ERROR'
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName', 'lastName', 'phoneNumber', 
      'specialization', 'preferences'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update fullName if firstName or lastName changed
    if (updates.firstName || updates.lastName) {
      const currentUser = await User.findById(req.user._id).select('firstName lastName');
      const firstName = updates.firstName || currentUser.firstName;
      const lastName = updates.lastName || currentUser.lastName;
      updates.fullName = `${firstName} ${lastName}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).select('-password').populate('department', 'name');

    logger.info(`Profile updated for user: ${user.email} (${user.employeeId})`);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user }
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: messages,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile.',
      code: 'UPDATE_ERROR'
    });
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
        code: 'MISSING_PASSWORDS'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match.',
        code: 'PASSWORD_MISMATCH'
      });   
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
        code: 'WEAK_PASSWORD'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      logger.warn(`Invalid current password attempt by user: ${user.email} (${user.employeeId})`);
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the same as current password.',
        code: 'SAME_PASSWORD'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and record change
    user.password = hashedNewPassword;
    user.passwordChangedAt = new Date();
    user.updatedBy = req.user._id;
    await user.save();

    logger.info(`Password changed for user: ${user.email} (${user.employeeId})`);

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password.',
      code: 'PASSWORD_CHANGE_ERROR'
    });
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res) => {
  try {
    // User and refresh token validation is handled by validateRefreshToken middleware
    const user = req.user;

    // Generate new token pair
    const tokenPair = jwtHelper.generateTokenPair(user);

    logger.info(`Access token refreshed for user: ${user.email} (${user.employeeId})`);

    res.json({
      success: true,
      message: 'Token refreshed successfully.',
      data: tokenPair
    });

  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing token.',
      code: 'REFRESH_ERROR'
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    // Update last logout time
    await User.findByIdAndUpdate(req.user._id, {
      lastLogout: new Date(),
      updatedBy: req.user._id
    });
    
    logger.info(`User logged out: ${req.user.email} (${req.user.employeeId})`);

    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout.',
      code: 'LOGOUT_ERROR'
    });
  }
};

/**
 * @desc    Get user sessions info
 * @route   GET /api/auth/sessions
 * @access  Private
 */
export const getSessionInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('loginCount lastLogin lastLogout createdAt')
      .lean();

    const tokenInfo = {
      type: req.tokenPayload?.type,
      issuedAt: new Date(req.tokenPayload?.iat * 1000),
      expiresAt: jwtHelper.getTokenExpiration(req.token),
      userId: req.tokenPayload?.userId,
      employeeId: req.tokenPayload?.employeeId
    };

    res.json({
      success: true,
      data: {
        sessionInfo: user,
        currentToken: tokenInfo
      }
    });

  } catch (error) {
    logger.error('Get session info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session information.',
      code: 'SESSION_INFO_ERROR'
    });
  }
};

/**
 * @desc    Validate token (for client-side token checking)
 * @route   GET /api/auth/validate
 * @access  Private
 */
export const validateToken = async (req, res) => {
  try {
    // If we reach here, token is valid (middleware passed)
    const tokenExpiration = jwtHelper.getTokenExpiration(req.token);
    const isExpiringSoon = (tokenExpiration - new Date()) < 15 * 60 * 1000; // 15 minutes

    res.json({
      success: true,
      message: 'Token is valid.',
      data: {
        valid: true,
        expiresAt: tokenExpiration,
        isExpiringSoon,
        user: {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
          employeeId: req.user.employeeId,
          fullName: req.user.fullName
        }
      }
    });

  } catch (error) {
    logger.error('Token validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating token.',
      code: 'TOKEN_VALIDATION_ERROR'
    });
  }
};