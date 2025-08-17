import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getTodaysAppointments
} from '../controllers/appointmentController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Appointment routes
router.route('/')
  .post(createAppointment)
  .get(getAppointments);

router.get('/today', getTodaysAppointments);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

export default router;