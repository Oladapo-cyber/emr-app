import { parseISO, startOfDay } from 'date-fns';

// Helper to create consistent validation results
export const ValidationResult = {
  success: (value) => ({ isValid: true, value }),
  error: (message) => ({ isValid: false, error: message })
};

// Validates MongoDB ObjectId format
export const isValidMongoId = (id) => {
  const valid = /^[0-9a-fA-F]{24}$/.test(id);
  return valid ? 
    ValidationResult.success(id) : 
    ValidationResult.error('Invalid ID format');
};

// Validates phone number format
export const isValidPhone = (phone) => {
  const valid = /^\+?[\d\s\-\(\)]+$/.test(phone);
  return valid ? 
    ValidationResult.success(phone) : 
    ValidationResult.error('Invalid phone number format');
};

// Validates email format
export const isValidEmail = (email) => {
  const valid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  return valid ? 
    ValidationResult.success(email) : 
    ValidationResult.error('Invalid email format');
};

// Validates future date
export const isFutureDate = (value) => {
  const inputDate = parseISO(value);
  const today = startOfDay(new Date());
  return inputDate >= today ? 
    ValidationResult.success(value) : 
    ValidationResult.error('Date must be in the future');
};

// Validates time format (HH:mm)
export const isValidTimeFormat = (value) => {
  const valid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
  return valid ? 
    ValidationResult.success(value) : 
    ValidationResult.error('Invalid time format (HH:mm)');
};

// Validates password strength
export const isStrongPassword = (value) => {
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);
  const hasMinLength = value.length >= 8;

  if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return ValidationResult.error(
      'Password must include uppercase, lowercase, number, special character and be at least 8 characters'
    );
  }
  return ValidationResult.success(value);
};