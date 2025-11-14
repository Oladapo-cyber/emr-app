import express from 'express';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { 
  appointmentValidationRules, 
  idValidation,
  businessValidators,
  validateRequest
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

router.use(authenticate);

router.route('/')
  .post(
    requirePermission('manage_appointments'),
    appointmentValidationRules,
    businessValidators.validateAppointmentConflict,
    createAppointment
  )
  .get(requirePermission('view_appointments'), getAppointments);

router.get('/today', requirePermission('view_appointments'), getTodaysAppointments);

router.route('/:id')
  .get(requirePermission('view_appointments'), ...idValidation.validateId(), validateRequest, getAppointment)
  .put(
    requirePermission('manage_appointments'),
    ...idValidation.validateId(),
    appointmentValidationRules,
    businessValidators.validateAppointmentConflict,
    updateAppointment
  )
  .delete(requirePermission('manage_appointments'), ...idValidation.validateId(), validateRequest, deleteAppointment);

export default router;