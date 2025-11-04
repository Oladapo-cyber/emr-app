import api from './api';
import { API_ENDPOINTS } from '../constants';

export const patientService = {
  /**
   * Get all patients with optional search and pagination
   */
  getPatients: async (params = {}) => {
    try {
      const { search = '', page = 1, limit = 10, status } = params;
      const response = await api.get(API_ENDPOINTS.PATIENTS.BASE, {
        params: { search, page, limit, status }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patients');
    }
  },

  /**
   * Get single patient by ID
   */
  getPatientById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.PATIENTS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient details');
    }
  },

  /**
   * Create new patient
   */
  createPatient: async (patientData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PATIENTS.BASE, patientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create patient');
    }
  },

  /**
   * Update patient information
   */
  updatePatient: async (id, patientData) => {
    try {
      const response = await api.put(API_ENDPOINTS.PATIENTS.BY_ID(id), patientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  },

  /**
   * Delete/deactivate patient
   */
  deletePatient: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.PATIENTS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete patient');
    }
  },

  /**
   * Search patients by various criteria
   */
  searchPatients: async (searchTerm) => {
    try {
      const response = await api.get(API_ENDPOINTS.PATIENTS.BASE, {
        params: { search: searchTerm, limit: 50 }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Patient search failed');
    }
  },

  /**
   * Get patient statistics
   */
  getPatientStats: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PATIENTS.BASE}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient statistics');
    }
  }
};

export default patientService;