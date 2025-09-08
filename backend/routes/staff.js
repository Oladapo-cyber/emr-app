import express from 'express';
import { authenticate, adminOnly } from '../middlewares/auth.js';
import { staffValidationRules, idValidation } from '../middlewares/validation.js';
import {
  createStaff,
  getStaff,
  getStaffMember,
  updateStaff,
  deleteStaff
} from '../controllers/staffController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Staff routes - Admin only for create/delete
router.route('/')
  .post(adminOnly, staffValidationRules, createStaff)
  .get(adminOnly, getStaff);

router.route('/:id')
  .get(adminOnly, idValidation.validateId(), getStaffMember)
  .put(adminOnly, [idValidation.validateId(), staffValidationRules], updateStaff)
  .delete(adminOnly, idValidation.validateId(), deleteStaff);

export default router;