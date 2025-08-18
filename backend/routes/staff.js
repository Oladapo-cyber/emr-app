import express from 'express';
import { authenticate, authorize, adminOnly } from '../middlewares/auth.js';
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
  .post(adminOnly, createStaff)
  .get(getStaff);

router.route('/:id')
  .get(getStaffMember)
  .put(authorize('admin'), updateStaff)
  .delete(adminOnly, deleteStaff);

export default router;