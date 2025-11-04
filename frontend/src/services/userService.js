import api from './api';
import { API_ENDPOINTS } from '../constants';

export const userService = {
  /**
   * Get all users/staff with optional filters
   */
  getUsers: async (filters = {}) => {
    try {
      const { role, department, search, isActive = true, page = 1, limit = 20 } = filters;
      const response = await api.get(API_ENDPOINTS.STAFF.BASE, {
        params: { role, department, search, isActive, page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  /**
   * Get single user by ID
   */
  getUserById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.STAFF.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  },

  /**
   * Create new user (admin only)
   */
  createUser: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  /**
   * Update user information
   */
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(API_ENDPOINTS.STAFF.BY_ID(id), userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  /**
   * Delete/deactivate user
   */
  deleteUser: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.STAFF.BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  /**
   * Get users by role
   */
  getUsersByRole: async (role) => {
    try {
      const response = await api.get(API_ENDPOINTS.STAFF.BASE, {
        params: { role, limit: 100 }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users by role');
    }
  },

  /**
   * Get users by department
   */
  getUsersByDepartment: async (department) => {
    try {
      const response = await api.get(API_ENDPOINTS.STAFF.BASE, {
        params: { department, limit: 100 }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users by department');
    }
  },

  /**
   * Get all doctors
   */
  getDoctors: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.STAFF.BASE, {
        params: { role: 'doctor', isActive: true, limit: 100 }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
    }
  },

  /**
   * Get all nurses
   */
  getNurses: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.STAFF.BASE, {
        params: { role: 'nurse', isActive: true, limit: 100 }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch nurses');
    }
  },

  /**
   * Search users
   */
  searchUsers: async (searchTerm) => {
    try {
      const response = await api.get(API_ENDPOINTS.STAFF.BASE, {
        params: { search: searchTerm, limit: 50 }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'User search failed');
    }
  },

  /**
   * Get user statistics
   */
  getUserStats: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.STAFF.BASE}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
    }
  }
};

export default userService;