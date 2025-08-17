import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const createAppointment = async (req, res, next) => {
  try {
    const appointmentData = {
      ...req.body,
      createdBy: req.user._id
    };

    const appointment = await Appointment.create(appointmentData);
    await appointment.populate(['patient', 'provider']);

    logger.info(`New appointment created: ${appointment._id}`);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { date, provider, status } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    if (provider) query.provider = provider;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('provider', 'firstName lastName')
      .sort({ appointmentDate: 1, 'appointmentTime.start': 1 });

    res.json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName patientId')
      .populate('provider', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment retrieved successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        updatedBy: req.user._id 
      },
      { new: true, runValidators: true }
    )
    .populate('patient', 'firstName lastName patientId')
    .populate('provider', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    logger.info(`Appointment updated: ${appointment._id}`);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        updatedBy: req.user._id
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    logger.info(`Appointment cancelled: ${appointment._id}`);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getTodaysAppointments = async (req, res, next) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: { $nin: ['cancelled', 'no_show'] }
    })
    .populate('patient', 'firstName lastName patientId')
    .populate('provider', 'firstName lastName')
    .sort({ 'appointmentTime.start': 1 });

    res.json({
      success: true,
      message: "Today's appointments retrieved successfully",
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    next(error);
  }
};