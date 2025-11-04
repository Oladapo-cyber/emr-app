import api from './api';
import { API_ENDPOINTS } from '../constants';

export const medicalRecordService = {
  /**
   * Get all medical records with optional filters
   */
  getMedicalRecords: async (filters = {}) => {
    try {
      const { patient, startDate, endDate, type, page = 1, limit = 20 } = filters;
      const response = await api.get(API_ENDPOINTS.MEDICAL_RECORDS.BASE, {
        params: { patient, startDate, endDate, type, page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch medical records');
    }
  },

  /**
   * Get medical records for specific patient
   */
  getPatientRecords: async (patientId, filters = {}) => {
    try {
      const { type, startDate, endDate, page = 1, limit = 20 } = filters;
      const response = await api.get(API_ENDPOINTS.MEDICAL_RECORDS.BASE, {
        params: { patient: patientId, type, startDate, endDate, page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient records');
    }
  },

  /**
   * Get single medical record by ID
   */
  getMedicalRecordById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.MEDICAL_RECORDS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch medical record');
    }
  },

  /**
   * Create new medical record
   */
  createMedicalRecord: async (recordData) => {
    try {
      const response = await api.post(API_ENDPOINTS.MEDICAL_RECORDS.BASE, recordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create medical record');
    }
  },

  /**
   * Update medical record
   */
  updateMedicalRecord: async (id, recordData) => {
    try {
      const response = await api.put(API_ENDPOINTS.MEDICAL_RECORDS.BY_ID(id), recordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update medical record');
    }
  },

  /**
   * Upload medical file (single)
   */
  uploadMedicalFile: async (file, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('medicalFile', file);
      
      // Add metadata fields
      Object.keys(metadata).forEach(key => {
        if (metadata[key] !== undefined && metadata[key] !== null) {
          formData.append(key, metadata[key]);
        }
      });

      const response = await api.post(
        API_ENDPOINTS.MEDICAL_RECORDS.UPLOAD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000 // 60 seconds for file upload
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload medical file');
    }
  },

  /**
   * Upload multiple medical files
   */
  uploadMultipleFiles: async (files, metadata = {}) => {
    try {
      const formData = new FormData();
      
      // Append all files
      Array.from(files).forEach(file => {
        formData.append('medicalFiles', file);
      });
      
      // Add metadata
      Object.keys(metadata).forEach(key => {
        if (metadata[key] !== undefined && metadata[key] !== null) {
          formData.append(key, metadata[key]);
        }
      });

      const response = await api.post(
        `${API_ENDPOINTS.MEDICAL_RECORDS.BASE}/upload-multiple`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000 // 2 minutes for multiple files
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload files');
    }
  },

  /**
   * Download medical file
   */
  downloadMedicalFile: async (recordId, fileId) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.MEDICAL_RECORDS.BY_ID(recordId)}/files/${fileId}`,
        {
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medical-file-${fileId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to download file');
    }
  },

  /**
   * Delete medical record
   */
  deleteMedicalRecord: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.MEDICAL_RECORDS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete medical record');
    }
  },

  /**
   * Get medical record statistics
   */
  getMedicalRecordStats: async (patientId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.MEDICAL_RECORDS.BASE}/stats`, {
        params: { patient: patientId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch medical record statistics');
    }
  }
};

export default medicalRecordService;