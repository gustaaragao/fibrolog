/**
 * @deprecated This file is deprecated and should not be used.
 * Use the root-level utils/storage.ts with expo-secure-store instead.
 * This file exists for backward compatibility only.
 */

import axios, { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { getApiUrl } from "../config/api";

const TOKEN_STORAGE_KEY = "auth_token";
const USER_STORAGE_KEY = "auth_user";

// Storage abstraction for secure token storage
// Note: Web platform uses localStorage (unencrypted). Consider using httpOnly cookies for production.
const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

// Create axios instance with base configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically add JWT token and log requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Erro ao recuperar token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      try {
        await Promise.all([
          secureStorage.removeItem(TOKEN_STORAGE_KEY),
          secureStorage.removeItem(USER_STORAGE_KEY),
        ]);
      } catch {
        // Erro ao limpar dados de autenticação
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
