import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../config/api';

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

// Check if we're in development mode
const isDevelopment = __DEV__;

// Create axios instance with base configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add JWT token and log requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (isDevelopment) {
        console.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          headers: {
            ...config.headers,
            Authorization: token ? 'Bearer [REDACTED]' : undefined,
          },
          data: config.data,
        });
      }
    } catch (error) {
      console.error('Error retrieving token for request:', error);
    }
    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (isDevelopment) {
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    // Log error in development
    if (isDevelopment) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      });
    }

    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      try {
        await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
        
        // You can emit an event here to notify the auth context
        // For now, we'll just clear the storage and let the UI handle the redirect
        console.log('Token expired, clearing auth data');
      } catch (storageError) {
        console.error('Error clearing auth data:', storageError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;