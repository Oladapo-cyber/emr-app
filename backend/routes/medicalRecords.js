import express from 'express';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { medicalRecordValidationRules, idValidation } from '../middlewares/validation.js';
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
  .post(requirePermission('edit_medical_records'), medicalRecordValidationRules, createMedicalRecord)
  .get(requirePermission('view_medical_records'), getMedicalRecords);

router.route('/:id')
  .get(requirePermission('view_medical_records'), idValidation.validateId(), getMedicalRecord)
  .put(requirePermission('edit_medical_records'), medicalRecordValidationRules, updateMedicalRecord)
  .delete(requirePermission('edit_medical_records'), idValidation.validateId(), deleteMedicalRecord);

router.post(
  '/upload',
  requirePermission('edit_medical_records'),
  uploadMedicalFile.single('medicalFile'),
  uploadSingleRecord
);

router.post(
  '/upload-multiple',
  requirePermission('edit_medical_records'),
  uploadMedicalFile.array('medicalFiles', 5),
  uploadMultipleRecords
);

export default router;
