import { useState, useCallback } from "react";

/**
 * Custom hook for making API calls with loading and error states
 * @param {Function} apiFunc - The API function to call
 * @returns {Object} - Object containing data, loading, error states and execute function
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunc(...args);
        setData(response.data);
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return {
    data,
    loading,
    error,
    execute,
    setData, // Allows manual updates to data
    setError, // Allows manual error setting
  };
};


export default useApi;
