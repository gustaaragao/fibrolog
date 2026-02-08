import { API_BASE_URL } from "@/constants/api";
import { storage } from "@/utils/storage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiErrorResponse = {
  detail?: string;
};

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  try {
    const data = (await response.json()) as T;
    return data;
  } catch {
    return null;
  }
}

async function request<TResponse>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
  } = {},
): Promise<TResponse> {
  const { method = "GET", body, headers = {} } = options;

  // Busca o token de autenticação
  const token = await storage.getItemAsync("fibrolog_access_token");

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Adiciona o token se existir
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await parseJsonSafe<ApiErrorResponse>(response);

  if (!response.ok) {
    const mensagemErro =
      (data && data.detail) || "Erro ao comunicar com o servidor.";
    throw new Error(mensagemErro);
  }

  return (data as TResponse) ?? ({} as TResponse);
}

export const api = {
  get: <TResponse>(path: string) => request<TResponse>(path, { method: "GET" }),
  post: <TResponse>(path: string, body?: Record<string, unknown>) =>
    request<TResponse>(path, { method: "POST", body }),
};

export type ApiError = Error;
