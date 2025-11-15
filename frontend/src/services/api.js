import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Enable cookies for session management
});

// Request interceptor - adds auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("emr-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Log request for debugging
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles token refresh and auth errors
api.interceptors.response.use(
  (response) => {
    // ✅ Log successful responses
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ✅ Better error logging
    console.error("[API Response Error]", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle 401 (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try refreshing token
        const refreshToken = localStorage.getItem("emr-refresh-token");
        if (refreshToken) {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/auth/refresh-token`,
            { refreshToken },
            { withCredentials: true }
          );

          // Update tokens
          localStorage.setItem("emr-token", data.data.accessToken);
          if (data.data.refreshToken) {
            localStorage.setItem("emr-refresh-token", data.data.refreshToken);
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("[Token Refresh Failed]", refreshError);
        // Refresh failed, logout user
        localStorage.removeItem("emr-token");
        localStorage.removeItem("emr-refresh-token");
        localStorage.removeItem("emr-user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
