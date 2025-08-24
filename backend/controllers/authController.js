import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwtHelper from '../utils/jwtHelper.js';
import logger from '../utils/logger.js';

/**
 * @desc    Register new user (Admin only)
 * @route   POST /api/auth/register
 * @access  Private (Admin only)
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email.'
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      department,
      fullName: `${firstName} ${lastName}`
    });

    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`New user registered: ${email} (${role})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: { user: userResponse }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed.'
    });
  }
};

/**
 * @desc    Login user with email or employee ID
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; 

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID or Email and password are required.' 
      });
    }

    // Determine if identifier is email or employee ID
    const isEmail = identifier.includes('@') && identifier.includes('.');
    
    // Build query based on identifier type
    const query = isEmail 
      ? { email: identifier.toLowerCase() }
      : { employeeId: identifier.toUpperCase() };

    // Find user
    const user = await User.findOne(query)
      .select('+password')
      .populate('department', 'name');

    if (!user) {
      logger.warn(`Failed login attempt with ${isEmail ? 'email' : 'employeeId'}: ${identifier}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Failed password attempt for user: ${user.email} (${user.employeeId})`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Generate token
    const token = jwtHelper.generateAccessToken(user);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User logged in: ${user.email} (${user.employeeId}) via ${isEmail ? 'email' : 'employee ID'}`);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed.'
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
      lastLogout: new Date()
    });
    
    logger.info(`User logged out: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout.'
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

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile.'
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
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Hash and save new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password.'
    });
  }
};