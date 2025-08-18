import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../controllers/medicalRecordController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Medical record routes
router.route('/')
  .post(authorize('doctor', 'nurse'), createMedicalRecord)
  .get(getMedicalRecords);

router.route('/:id')
  .get(getMedicalRecord)
  .put(authorize('doctor', 'nurse'), updateMedicalRecord)
  .delete(authorize('admin', 'doctor'), deleteMedicalRecord);

export default router;