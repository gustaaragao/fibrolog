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

  // Trata erro 401 (Não autorizado) de forma global
  if (response.status === 401) {
    // Dispara um evento customizado que pode ser ouvido pelo AuthProvider
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new Event("fibrolog_unauthorized"));
    }
  }

  // Para respostas sem conteúdo (204 ou 200 sem body), retornar imediatamente
  if (response.status === 204 || response.status === 200) {
    // Tenta verificar se há conteúdo
    const contentType = response.headers.get("content-type");
    const hasContent = contentType && contentType.includes("application/json");

    if (response.status === 204 || !hasContent) {
      if (!response.ok) {
        throw new Error("Erro ao processar requisição.");
      }
      return {} as TResponse;
    }
  }

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
  put: <TResponse>(path: string, body?: Record<string, unknown>) =>
    request<TResponse>(path, { method: "PUT", body }),
  patch: <TResponse>(path: string, body?: Record<string, unknown>) =>
    request<TResponse>(path, { method: "PATCH", body }),
  delete: <TResponse>(path: string) => {
    return request<TResponse>(path, { method: "DELETE" });
  },
  setAuthToken: (_token: string) => {
    // No atual design, setAuthToken nao e necessario porque o token e recuperado
    // do storage em cada request. Esta funcao existe para compatibilidade.
  },
};

export type ApiError = Error;
