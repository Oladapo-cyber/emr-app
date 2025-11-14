import express from 'express';
import { authenticate, adminOnly } from '../middlewares/auth.js';
import { staffValidationRules, idValidation, validateRequest } from '../middlewares/validation.js';
import {
  createStaff,
  getStaff,
  getStaffMember,
  updateStaff,
  deleteStaff
} from '../controllers/staffController.js';

const router = express.Router();

router.use(authenticate);

router.route('/')
  .post(adminOnly, staffValidationRules, createStaff)
  .get(adminOnly, getStaff);

router.route('/:id')
  .get(adminOnly, ...idValidation.validateId(), validateRequest, getStaffMember)
  .put(adminOnly, ...idValidation.validateId(), staffValidationRules, updateStaff)
  .delete(adminOnly, ...idValidation.validateId(), validateRequest, deleteStaff);

export default router;