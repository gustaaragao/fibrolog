import React, { createContext, useContext } from 'react';

// Types matching the FastAPI backend
export interface User {
  id: number;
  nome: string;
  email: string;
  data_nascimento?: string;
  sexo?: string;
  data_diagnostico?: string;
  medicacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Internal methods for token management
  setAuthData: (token: string, user: User) => Promise<void>;
  clearAuthData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};