import express from 'express';
import { medicalRecordValidationRules } from '../middlewares/validation.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  uploadSingleRecord,
  uploadMultipleRecords
} from '../controllers/medicalRecordController.js';
import { uploadMedicalFile } from '../utils/fileUploads.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Medical record routes
router.route('/')
  .post(authorize('doctor', 'nurse'), medicalRecordValidationRules, createMedicalRecord)
  .get(getMedicalRecords);

router.route('/:id')
  .get(getMedicalRecord)
  .put(authorize('doctor', 'nurse'), updateMedicalRecord)
  .delete(authorize('admin', 'doctor'), deleteMedicalRecord);

// Upload routes
router.post(
  '/upload',
  authorize('doctor', 'nurse'),
  uploadMedicalFile.single('medicalFile'),
  uploadSingleRecord
);

router.post(
  '/upload-multiple',
  authorize('doctor', 'nurse'),
  uploadMedicalFile.array('medicalFiles', 5),
  uploadMultipleRecords
);

export default router;
