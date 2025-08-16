import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { 
  patientValidationRules,
  patientIdValidation 
} from '../middlewares/validation.js';
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
  .post(patientValidationRules, createPatient)
  .get(getPatients);

router.route('/:id')
  .get(patientIdValidation, getPatient)
  .put([...patientIdValidation, ...patientValidationRules], updatePatient)
  .delete(patientIdValidation, deletePatient);

export default router;