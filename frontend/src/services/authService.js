import api from './api';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  /**
   * Login user with email or employee ID
   */
  login: async (identifier, password) => {
    try {
      console.log('[AuthService] Login attempt:', { identifier });
      
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        identifier, // Send as "identifier" - backend handles both email/employeeId
        password
      });

      console.log('[AuthService] Login response:', response.data);

      if (response.data?.success) {
        // ✅ FIXED: Backend returns "accessToken", not "token"
        const { accessToken, refreshToken, user } = response.data.data;

        // Validate response data
        if (!accessToken || !user) {
          throw new Error('Invalid response from server: missing token or user data');
        }

        // Store tokens with consistent keys
        localStorage.setItem('emr-token', accessToken);
        localStorage.setItem('emr-user', JSON.stringify(user));

        if (refreshToken) {
          localStorage.setItem('emr-refresh-token', refreshToken);
        }

        console.log('[AuthService] Login successful, tokens stored');
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }

      return response.data;
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Other errors
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Register new user (admin only)
   */
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);

      // Update stored user data
      if (response.data?.data?.user) {
        localStorage.setItem('emr-user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage even if API call fails
      localStorage.removeItem('emr-token');
      localStorage.removeItem('emr-refresh-token');
      localStorage.removeItem('emr-user');
    }
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      throw new Error(errorMessage);
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('emr-refresh-token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });

      // ✅ FIXED: Backend returns "accessToken"
      if (response.data?.data?.accessToken) {
        localStorage.setItem('emr-token', response.data.data.accessToken);
        if (response.data.data.refreshToken) {
          localStorage.setItem('emr-refresh-token', response.data.data.refreshToken);
        }
      }

      return response.data;
    } catch (error) {
      // If refresh fails, logout
      localStorage.removeItem('emr-token');
      localStorage.removeItem('emr-refresh-token');
      localStorage.removeItem('emr-user');
      window.location.href = '/login';
      throw error;
    }
  }
};

export default authService;
