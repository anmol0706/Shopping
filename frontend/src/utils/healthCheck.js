import axios from 'axios';
import api from './api';

/**
 * Check if the backend API is accessible
 * @returns {Promise<boolean>} True if backend is accessible, false otherwise
 */
export const checkBackendHealth = async () => {
  try {
    // Create a direct axios instance without the /api prefix for health check
    const healthApi = axios.create({
      baseURL: import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://shopping-backend-7mgn.onrender.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Try to reach the health endpoint
    const response = await healthApi.get('/health');

    return response.status === 200;
  } catch (error) {
    // Log only in development
    if (import.meta.env.DEV) {
      console.warn('Backend health check failed:', error.message);
    }
    return false;
  }
};

/**
 * Check if the backend API is accessible with retry logic
 * @param {number} maxRetries Maximum number of retries
 * @param {number} delay Delay between retries in milliseconds
 * @returns {Promise<boolean>} True if backend becomes accessible, false otherwise
 */
export const checkBackendHealthWithRetry = async (maxRetries = 3, delay = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    const isHealthy = await checkBackendHealth();
    
    if (isHealthy) {
      return true;
    }
    
    // Wait before retrying (except for the last attempt)
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
};

/**
 * Get backend status information
 * @returns {Promise<Object>} Status information object
 */
export const getBackendStatus = async () => {
  try {
    // Create a direct axios instance without the /api prefix for health check
    const healthApi = axios.create({
      baseURL: import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://shopping-backend-7mgn.onrender.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await healthApi.get('/health');

    return {
      status: 'online',
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'offline',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};
