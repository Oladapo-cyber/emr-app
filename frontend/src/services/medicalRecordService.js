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
  uploadMedicalFile: async (file, recordData) => {
    try {
      // Validate file before upload
      if (!file) {
        throw new Error('No file selected');
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX. Received: ${file.type}`);
      }

      const formData = new FormData();
      formData.append('file', file);
      Object.keys(recordData).forEach(key => {
        if (recordData[key] !== undefined && recordData[key] !== null) {
          formData.append(key, recordData[key]);
        }
      });

      const response = await api.post(API_ENDPOINTS.MEDICAL_RECORDS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file uploads
      });
      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (error.message && !error.response) {
        // Client-side validation errors
        throw error;
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout. Please check your connection and try again.');
      }

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 413) {
          throw new Error('File too large for server. Maximum upload size exceeded.');
        }
        if (status === 415) {
          throw new Error('Unsupported file type.');
        }
        if (status === 400) {
          throw new Error(message || 'Invalid file or missing required data.');
        }
        if (status === 500) {
          throw new Error('Server error during upload. Please try again later.');
        }

        throw new Error(message || 'Failed to upload medical file');
      }

      throw new Error('Network error. Please check your connection and try again.');
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
  },

  /**
   * Upload multiple medical files with validation
   */
  uploadMultipleMedicalFiles: async (files, recordData) => {
    try {
      if (!files || files.length === 0) {
        throw new Error('No files selected');
      }

      // Validate all files before upload
      const maxSize = 10 * 1024 * 1024; // 10MB per file
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      for (let file of files) {
        if (file.size > maxSize) {
          throw new Error(`File "${file.name}" exceeds 10MB limit`);
        }
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File "${file.name}" has invalid type: ${file.type}`);
        }
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      Object.keys(recordData).forEach(key => {
        if (recordData[key] !== undefined && recordData[key] !== null) {
          formData.append(key, recordData[key]);
        }
      });

      const response = await api.post(`${API_ENDPOINTS.MEDICAL_RECORDS.UPLOAD}/multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes for multiple files
      });
      return response.data;
    } catch (error) {
      if (error.message && !error.response) {
        throw error;
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout. Please try uploading fewer files or check your connection.');
      }

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 413) {
          throw new Error('Total file size too large. Try uploading fewer files.');
        }
        if (status === 400) {
          throw new Error(message || 'Invalid files or missing required data.');
        }

        throw new Error(message || 'Failed to upload medical files');
      }

      throw new Error('Network error during multiple file upload. Please try again.');
    }
  },
};

export default medicalRecordService;