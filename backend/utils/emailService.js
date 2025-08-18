import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"EMR System" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw error;
  }
};

export const sendAppointmentConfirmation = async (appointment) => {
  const html = `
    <h2>Appointment Confirmation</h2>
    <p>Dear ${appointment.patient.firstName},</p>
    <p>Your appointment has been scheduled for:</p>
    <p>Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
    <p>Time: ${appointment.appointmentTime.start}</p>
    <p>Provider: Dr. ${appointment.provider.firstName} ${appointment.provider.lastName}</p>
  `;

  return sendEmail(
    appointment.patient.email,
    'Appointment Confirmation',
    html
  );
};

export const sendAppointmentReminder = async (appointment) => {
  const html = `
    <h2>Appointment Reminder</h2>
    <p>Dear ${appointment.patient.firstName},</p>
    <p>This is a reminder for your upcoming appointment:</p>
    <p>Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
    <p>Time: ${appointment.appointmentTime.start}</p>
    <p>Provider: Dr. ${appointment.provider.firstName} ${appointment.provider.lastName}</p>
  `;

  return sendEmail(
    appointment.patient.email,
    'Appointment Reminder',
    html
  );
};

export const sendWelcomeEmail = async (staff) => {
  const html = `
    <h2>Welcome to EMR System</h2>
    <p>Dear ${staff.firstName},</p>
    <p>Your account has been created with the following details:</p>
    <p>Email: ${staff.email}</p>
    <p>Role: ${staff.role}</p>
    <p>Please log in to set up your password.</p>
  `;

  return sendEmail(
    staff.email,
    'Welcome to EMR System',
    html
  );
};

export default {
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendWelcomeEmail,
};