// URL base da API do FibroLog
// Usar variavel de ambiente se disponivel, senao usar localhost
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

// Timeout padrao para requisicoes (em ms)
export const API_TIMEOUT = 30000;

// Headers comuns para requisicoes
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};
