import express from 'express';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { patientValidationRules, idValidation, validateRequest } from '../middlewares/validation.js';
import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient
} from '../controllers/patientController.js';

const router = express.Router();

router.use(authenticate);

router.route('/')
  .post(requirePermission('edit_patients'), patientValidationRules, createPatient)
  .get(requirePermission('view_patients'), getPatients);

router.route('/:id')
  .get(requirePermission('view_patients'), ...idValidation.validateId(), validateRequest, getPatient)
  .put(
    requirePermission('edit_patients'),
    ...idValidation.validateId(),
    patientValidationRules,
    updatePatient
  )
  .delete(requirePermission('edit_patients'), ...idValidation.validateId(), validateRequest, deletePatient);

export default router;