import { body, param, validationResult } from 'express-validator';
import Appointment from '../models/Appointment.js';
import { ROLES } from '../config/constants.js';
import { isValidMongoId, isValidPhone, isValidEmail, isFutureDate, isValidTimeFormat, isStrongPassword } from '../utils/validation.js';

// Core validation helper - processes validation results from express-validator
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

// Parameter validation chains
export const idValidation = {
  validateId: (paramName = 'id') => [
    param(paramName).custom(isValidMongoId).withMessage(`Invalid ${paramName} format`),
    validateRequest
  ],
  patientIdValidation: [
    param('id').custom(isValidMongoId).withMessage('Invalid patient ID format'),
    validateRequest
  ],
  appointmentIdValidation: [
    param('id').custom(isValidMongoId).withMessage('Invalid appointment ID format'),
    validateRequest
  ]
};

// Common field validators
export const commonValidators = {
  mongoIdParam: (field) => 
    param(field).custom(value => {
      const result = isValidMongoId(value);
      if (!result.isValid) throw new Error(result.error);
      return true;
    }),

  mongoIdBody: (field) => 
    body(field).custom(value => {
      const result = isValidMongoId(value);
      if (!result.isValid) throw new Error(result.error);
      return true;
    }),

  email: () =>
    body('email')
      .optional()
      .trim()
      .custom(value => {
        const result = isValidEmail(value);
        if (!result.isValid) throw new Error(result.error);
        return true;
      })
      .normalizeEmail(),

  phone: () =>
    body('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .custom(value => {
        const result = isValidPhone(value);
        if (!result.isValid) throw new Error(result.error);
        return true;
      }),

  password: () =>
    body('password')
      .custom(value => {
        const result = isStrongPassword(value);
        if (!result.isValid) throw new Error(result.error);
        return true;
      })
};

// Healthcare specific validators
export const healthcareValidators = {
  appointmentDate: () =>
    body('appointmentDate')
      .isISO8601()
      .withMessage('Invalid date format')
      .custom(isFutureDate),
  appointmentTime: () => [
    body('appointmentTime.start').custom(isValidTimeFormat),
    body('appointmentTime.end').custom(isValidTimeFormat)
  ],
  medicalRecordType: () =>
    body('visitType')
      .isIn(['routine_checkup', 'emergency', 'follow_up', 'consultation', 'procedure'])
      .withMessage('Invalid visit type')
};

// Business logic validators 
export const businessValidators = {
  validateAppointmentConflict: async (req, res, next) => {
    try {
      const { provider, appointmentDate, appointmentTime } = req.body;
      const existingAppointment = await Appointment.findOne({
        provider, 
        appointmentDate, 
        'appointmentTime.start': appointmentTime.start,  
        status: { $nin: ['cancelled', 'no_show'] },  
        ...(req.params.id ? { _id: { $ne: req.params.id } } : {})
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
  }
};

// Complete validation chains 
export const patientValidationRules = [
  commonValidators.requiredString('firstName'),
  commonValidators.requiredString('lastName'),
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
  commonValidators.phone(),
  commonValidators.email(),
  validateRequest
];

export const appointmentValidationRules = [
  commonValidators.mongoIdBody('patient'),
  commonValidators.mongoIdBody('provider'),
  healthcareValidators.appointmentDate(),
  ...healthcareValidators.appointmentTime(),
  validateRequest
];

export const medicalRecordValidationRules = [
  commonValidators.mongoIdBody('patient'),
  healthcareValidators.medicalRecordType(),
  body('diagnosis')
    .notEmpty()
    .withMessage('Diagnosis is required'),
  body('treatment')
    .notEmpty()
    .withMessage('Treatment is required'),
  validateRequest
];

export const staffValidationRules = [
  commonValidators.requiredString('firstName'),
  commonValidators.requiredString('lastName'),
  commonValidators.email(),
  commonValidators.phone(),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role'),
  validateRequest
];
