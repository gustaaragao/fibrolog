import apiClient from './apiClient';

// Types matching FastAPI backend responses
export interface LoginRequest {
  email: string;
  password: string;
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
      const response = await apiClient.post<TokenResponse>('/auth', {
        email,
        password,
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
}

export const authService = new AuthService();