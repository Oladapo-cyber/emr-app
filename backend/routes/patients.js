import express from 'express';
import { authenticate } from '../middlewares/auth.js';
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

// Patient routes
router.route('/')
  .post(createPatient)
  .get(getPatients);

router.route('/:id')
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

export default router;