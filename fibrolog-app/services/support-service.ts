import { api } from "./api";
import { SupportContact } from "./crises-service";

export const supportService = {
  list: () => api.get<{ contatos: SupportContact[] }>("/rede-apoio"),
  create: (data: Omit<SupportContact, "id">) =>
    api.post<SupportContact>("/rede-apoio", data as unknown as Record<string, unknown>),
  delete: (id: number) => api.delete<void>(`/rede-apoio/${id}`),
};
