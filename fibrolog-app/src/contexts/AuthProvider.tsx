import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext, AuthContextType, User } from './AuthContext';
import { authService } from '../services/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Set authentication data and persist to storage
  const setAuthData = async (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    
    await AsyncStorage.multiSet([
      [TOKEN_STORAGE_KEY, authToken],
      [USER_STORAGE_KEY, JSON.stringify(userData)],
    ]);
  };

  // Clear authentication data from state and storage
  const clearAuthData = async () => {
    setToken(null);
    setUser(null);
    
    await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
  };

  // Check if token is expired (basic JWT parsing)
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't parse the token, consider it expired
    }
  };

  // Handle token expiration automatically
  const handleTokenExpiration = async () => {
    await clearAuthData();
    // You can show a toast message here if needed
    console.log('Session expired, user logged out automatically');
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      // For now, we'll create a mock user object since the login endpoint
      // only returns token. In a real app, you'd make another request to get user data
      const userData: User = {
        id: 1, // Mock data - in real app, get from user endpoint
        nome: 'User', // Mock data
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await setAuthData(response.access_token, userData);
    } catch (error) {
      throw error; // Re-throw to let the UI handle the error
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register(name, email, password);
      
      // Create user object from registration data
      const userData: User = {
        id: 1, // Mock data - in real app, get from registration response
        nome: name,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await setAuthData(response.access_token, userData);
    } catch (error) {
      throw error; // Re-throw to let the UI handle the error
    }
  };

  // Logout function
  const logout = async () => {
    await clearAuthData();
  };

  // Check for existing token on app start
  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const [storedToken, storedUser] = await AsyncStorage.multiGet([
          TOKEN_STORAGE_KEY,
          USER_STORAGE_KEY,
        ]);

        const tokenValue = storedToken[1];
        const userValue = storedUser[1];

        if (tokenValue && userValue) {
          // Check if token is expired
          if (isTokenExpired(tokenValue)) {
            await handleTokenExpiration();
          } else {
            const parsedUser = JSON.parse(userValue) as User;
            setToken(tokenValue);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Error checking existing token:', error);
        // Clear any corrupted data
        await clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingToken();
  }, []);

  // Set up periodic token expiration check
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(token)) {
        handleTokenExpiration();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(interval);
  }, [token, isAuthenticated]);

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setAuthData,
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};