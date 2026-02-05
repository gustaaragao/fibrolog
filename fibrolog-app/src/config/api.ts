import Constants from 'expo-constants';

export const API_CONFIG = {
  BASE_URL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
  AUTH_ENDPOINT: '/auth',
};

// For development, we can also access the environment variable directly
export const getApiUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL || API_CONFIG.BASE_URL;
};