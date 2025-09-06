import express from 'express';
import { authenticate, authorize, adminOnly } from '../middlewares/auth.js';
import { staffValidationRules } from '../middlewares/validation.js';
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
  .get(getStaff);

router.route('/:id')
  .get(getStaffMember)
  .put([
    authorize('admin'),
    staffValidationRules
  ], updateStaff)
  .delete(adminOnly, deleteStaff);

export default router;