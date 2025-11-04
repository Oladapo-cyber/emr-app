import api from './api';
import { API_ENDPOINTS } from '../constants';

export const appointmentService = {
  /**
   * Get all appointments with optional filters
   */
  getAppointments: async (filters = {}) => {
    try {
      const { date, provider, status, patient, page = 1, limit = 50 } = filters;
      const response = await api.get(API_ENDPOINTS.APPOINTMENTS.BASE, {
        params: { date, provider, status, patient, page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  },

  /**
   * Get today's appointments
   */
  getTodaysAppointments: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.APPOINTMENTS.TODAY);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch today's appointments");
    }
  },

  /**
   * Get single appointment by ID
   */
  getAppointmentById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment details');
    }
  },

  /**
   * Create new appointment
   */
  createAppointment: async (appointmentData) => {
    try {
      // Transform frontend data to match backend schema
      const payload = {
        patient: appointmentData.patientId || appointmentData.patient,
        provider: appointmentData.providerId || appointmentData.doctor || appointmentData.provider,
        appointmentDate: appointmentData.date,
        appointmentTime: {
          start: appointmentData.time || appointmentData.startTime,
          end: appointmentData.endTime || calculateEndTime(appointmentData.time, appointmentData.duration)
        },
        appointmentType: appointmentData.type?.toLowerCase().replace(' ', '_') || 'consultation',
        department: appointmentData.department || 'general',
        reasonForVisit: appointmentData.notes || appointmentData.reasonForVisit || '',
        status: appointmentData.status || 'scheduled',
        duration: appointmentData.duration || 30
      };

      const response = await api.post(API_ENDPOINTS.APPOINTMENTS.BASE, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create appointment');
    }
  },

  /**
   * Update appointment
   */
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.put(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), appointmentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update appointment');
    }
  },

  /**
   * Cancel appointment
   */
  cancelAppointment: async (id, reason) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.APPOINTMENTS.BY_ID(id)}/cancel`, {
        cancellationReason: reason
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  },

  /**
   * Delete appointment
   */
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete appointment');
    }
  },

  /**
   * Get appointments by date range
   */
  getAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(API_ENDPOINTS.APPOINTMENTS.BASE, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
};

/**
 * Helper function to calculate end time based on start time and duration
 */
function calculateEndTime(startTime, duration = 30) {
  if (!startTime) return null;
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0);
  
  const endDate = new Date(startDate.getTime() + duration * 60000);
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
  
  return `${endHours}:${endMinutes}`;
}

export default appointmentService;