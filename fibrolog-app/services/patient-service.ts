import { api } from "./api";

export interface Patient {
  id: number;
  nome: string;
  email: string;
  celular: string;
  data_nascimento: string;
  sexo: string;
  data_diagnostico: string;
  created_at: string;
  updated_at: string;
}

export interface UpdatePatientDTO {
  nome?: string;
  email?: string;
  celular?: string;
}

export const patientService = {
  getMe: async (): Promise<Patient> => {
    return api.get<Patient>("/pacientes/me");
  },

  updatePatient: async (id: number, data: UpdatePatientDTO): Promise<Patient> => {
    return api.patch<Patient>(`/pacientes/${id}`, data as Record<string, unknown>);
  },
};
