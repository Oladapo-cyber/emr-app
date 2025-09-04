import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { 
  appointmentValidationRules, 
  idValidation,
  businessValidators 
} from '../middlewares/validation.js';

import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getTodaysAppointments
} from '../controllers/appointmentController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Add validation only to create and update operations
router.route('/')
  .post([
    appointmentValidationRules,
    businessValidators.validateAppointmentConflict
  ], createAppointment)
  .get(getAppointments);

router.get('/today', getTodaysAppointments);

router.route('/:id')
  .get(idValidation.validateId(), getAppointment)
  .put([
    idValidation.validateId(),
    appointmentValidationRules,
    businessValidators.validateAppointmentConflict
  ], updateAppointment)
  .delete(idValidation.validateId(), deleteAppointment);
export default router;