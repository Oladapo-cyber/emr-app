import User from '../models/User.js';
import logger from '../utils/logger.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

export const createStaff = async (req, res, next) => {
  try {
    const staffData = {
      ...req.body,
      createdBy: req.user._id
    };

    const staff = await User.create(staffData);
    await sendWelcomeEmail(staff);
    
    logger.info(`New staff member created: ${staff.email} (${staff.role})`);

    // Remove sensitive data
    const staffResponse = staff.toObject();
    delete staffResponse.password;

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: staffResponse
    });
  } catch (error) {
    next(error);
  }
};

export const getStaff = async (req, res, next) => {
  try {
    const { role, department, search } = req.query;
    let query = { isActive: true };

    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const staff = await User.find(query)
      .select('-password')
      .sort({ firstName: 1 });

    res.json({
      success: true,
      message: 'Staff retrieved successfully',
      data: staff,
      count: staff.length
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffMember = async (req, res, next) => {
  try {
    const staff = await User.findById(req.params.id)
      .select('-password');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      message: 'Staff member retrieved successfully',
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req, res, next) => {
  try {
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    logger.info(`Staff member updated: ${staff.email}`);

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (req, res, next) => {
  try {
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        updatedBy: req.user._id
      },
      { new: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    logger.info(`Staff member deactivated: ${staff.email}`);

    res.json({
      success: true,
      message: 'Staff member deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};