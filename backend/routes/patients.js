import express from 'express';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { patientValidationRules, idValidation } from '../middlewares/validation.js';
import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient
} from '../controllers/patientController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Patient routes with validation
router.route('/')
  .post(requirePermission('edit_patients'), patientValidationRules, createPatient)
  .get(requirePermission('view_patients'), getPatients);

router.route('/:id')
  .get(requirePermission('view_patients'), idValidation.validateId(), getPatient)
  .put([
    requirePermission('edit_patients'),
    idValidation.validateId(),
    patientValidationRules
  ], updatePatient)
  .delete(requirePermission('edit_patients'), idValidation.validateId(), deletePatient);

export default router;