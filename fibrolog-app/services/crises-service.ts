import { api } from "./api";

export interface Crisis {
  id: number;
  paciente_id: number;
  intensidade_dor: number;
  contexto: string;
  duracao?: string;
  sintomas_relatados?: string;
  observacoes?: string;
  data_hora: string;
}

export interface CreateCrisisDto {
  intensidade_dor: number;
  contexto: string;
  duracao?: string;
  sintomas_relatados?: string;
  observacoes?: string;
}

export interface SupportContact {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  parentesco: string;
}

export const crisesService = {
  list: () => api.get<{ crises: Crisis[] }>("/crises"),
  getById: (id: number) => api.get<Crisis>(`/crises/${id}`),
  create: (data: CreateCrisisDto) => api.post<Crisis>("/crises", data),
  update: (id: number, data: Partial<CreateCrisisDto>) =>
    api.patch<Crisis>(`/crises/${id}`, data as Record<string, unknown>),
  delete: (id: number) => api.delete<void>(`/crises/${id}`),
};