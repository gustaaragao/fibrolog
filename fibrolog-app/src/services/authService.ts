/**
 * @deprecated This file is deprecated and should not be used.
 * Use the root-level services/auth-service.ts instead.
 * This file exists for backward compatibility only.
 */

import apiClient from './apiClient';

// Types matching FastAPI backend responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string; // Password for the account (backend expects 'senha')
  data_nascimento: string; // Date of birth in ISO format (required by backend)
  sexo: string; // Gender (required by backend)
  data_diagnostico: string; // Diagnosis date in ISO format (required by backend)
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string | Array<{ msg: string; type: string }>;
}

class AuthService {
  async login(email: string, password: string): Promise<TokenResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await apiClient.post<TokenResponse>('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      return response.data;
    } catch (error: any) {
      // Handle different types of errors from FastAPI
      if (error.response?.status === 401) {
        throw new Error('Credenciais inválidas. Verifique seu email e senha.');
      } else if (error.response?.status === 422) {
        // Validation errors from FastAPI
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          const messages = detail.map(err => err.msg).join(', ');
          throw new Error(`Erro de validação: ${messages}`);
        } else {
          throw new Error(detail || 'Dados inválidos fornecidos.');
        }
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando.');
      } else {
        throw new Error('Erro inesperado. Tente novamente.');
      }
    }
  }

  async register(name: string, email: string, password: string): Promise<TokenResponse> {
    try {
      // DEPRECATED: Do not use this implementation. Update root-level services/auth-service.ts instead.
      // Note: This simplified registration is missing required backend fields.
      const response = await apiClient.post<TokenResponse>('/pacientes', {
        nome: name,
        email,
        senha: password, // Backend expects 'senha', not 'password'
        // Missing required fields that should be collected from the UI:
        // data_nascimento: string (ISO date format)
        // sexo: string
        // data_diagnostico: string (ISO date format)
      });
      
      return response.data;
    } catch (error: any) {
      // Handle different types of errors from FastAPI
      if (error.response?.status === 400) {
        const detail = error.response.data?.detail;
        if (detail?.includes('email')) {
          throw new Error('Este email já está sendo usado por outra conta.');
        }
        throw new Error(detail || 'Dados inválidos para registro.');
      } else if (error.response?.status === 422) {
        // Validation errors from FastAPI
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          const messages = detail.map(err => err.msg).join(', ');
          throw new Error(`Erro de validação: ${messages}`);
        } else {
          throw new Error(detail || 'Dados inválidos fornecidos.');
        }
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando.');
      } else {
        throw new Error('Erro inesperado. Tente novamente.');
      }
    }
  }
}

export const authService = new AuthService();