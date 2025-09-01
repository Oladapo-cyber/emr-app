import { body, param, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

export const patientValidationRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
    
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
    
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Invalid date format'),
    
  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender value'),
    
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Invalid phone number format'),
    
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format'),
    
  validateRequest
];

export const patientIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid patient ID format'),
  validateRequest
];
 
export const appointmentValidationRules = [
  body('patient')
    .isMongoId()
    .withMessage('Valid patient ID is required'),
    
  body('provider')
    .isMongoId()
    .withMessage('Valid provider ID is required'),
    
  body('appointmentDate')
    .isISO8601()
    .withMessage('Valid appointment date is required'),
    
  body('appointmentTime.start')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid start time required (HH:mm)'),
    
  body('appointmentTime.end')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid end time required (HH:mm)'),
    
  validateRequest
];

// Add appointment conflict validation
export const validateAppointmentConflict = async (req, res, next) => {
  try {
    const { provider, appointmentDate, appointmentTime } = req.body;
    
    const existingAppointment = await Appointment.findOne({
      provider,
      appointmentDate,
      'appointmentTime.start': appointmentTime.start,
      status: { $nin: ['cancelled', 'no_show'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Provider already has an appointment at this time'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};