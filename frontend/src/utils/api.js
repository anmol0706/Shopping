import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shopping-backend-7mgn.onrender.com/api',
  timeout: 30000, // Increased timeout for production
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only log errors in development to reduce console noise in production
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. Please try again.';
      } else if (error.code === 'ERR_NETWORK') {
        error.message = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'ENOTFOUND') {
        error.message = 'Server not found. Please try again later.';
      } else {
        error.message = 'Unable to connect to server. Please try again later.';
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }

    // Handle CORS errors
    if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
      error.message = 'Connection error. Please refresh the page and try again.';
    }

    return Promise.reject(error);
  }
);

// Test API connection
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    if (import.meta.env.DEV) {
      console.log('✅ API Connection successful:', response.data);
    }
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ API Connection failed:', error.message);
    }
    // Don't throw error to prevent app crashes
    return { status: 'error', message: error.message };
  }
};

export default api;
