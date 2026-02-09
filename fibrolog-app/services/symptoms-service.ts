import { api } from "./api";

// Interface para um sintoma individual
export interface SymptomEntry {
  id: string; // ID do sintoma (ex: "1", "5")
  intensity: number; // Inteiro de 0 a 10
}

// Interface para uma região de dor do BodyMap
export interface PainRegionEntry {
  id: string; // ID da região (ex: "24", "10")
  intensity: number; // Inteiro de 0 a 10
}

// Interface para o payload completo do Registro Diário
export interface DailyLogPayload {
  symptoms: SymptomEntry[];
  painRegions: PainRegionEntry[];
  notes?: string; // Observações opcionais
  timestamp: string; // ISO 8601 (ex: new Date().toISOString())
}

// Interface que reflete exatamente o que o backend retorna (snake_case)
export interface DailyLogBackend {
  id: number;
  paciente_id: number;
  data_registro: string;
  notes?: string;
  symptoms: SymptomEntry[];
  painRegions: PainRegionEntry[];
  message?: string;
}

export interface DailyLogListResponse {
  registros: DailyLogBackend[];
}

// Interface para um Registro Diário completo no frontend (camelCase)
export interface DailyLog extends DailyLogPayload {
  id: number;
  paciente_id: number;
}

// Interface para a resposta do servidor ao criar
export interface CreateDailyLogResponse {
  id: number;
  message: string;
}

export const DailyLogService = {
  /**
   * Envia o registro diário de sintomas e dor para o backend.
   * @param data Payload contendo sintomas, regiões e notas.
   */
  async create(data: DailyLogPayload): Promise<CreateDailyLogResponse> {
    try {
      const response = await api.post<CreateDailyLogResponse>(
        "/registros-diarios/",
        data as unknown as Record<string, unknown>,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca o histórico de registros diários do usuário.
   */
  async getAll(): Promise<DailyLog[]> {
    try {
      const response = await api.get<DailyLogListResponse>(
        "/registros-diarios/",
      );

      const logs = response.registros || [];

      // Mapeia do formato do backend (snake_case) para o frontend (camelCase)
      return logs.map((log) => ({
        id: log.id,
        paciente_id: log.paciente_id,
        timestamp: log.data_registro,
        notes: log.notes,
        symptoms: log.symptoms || [],
        painRegions: log.painRegions || [],
      }));
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca um registro diário específico por ID.
   */
  async getById(id: number): Promise<DailyLog> {
    try {
      const log = await api.get<DailyLogBackend>(`/registros-diarios/${id}`);
      return {
        id: log.id,
        paciente_id: log.paciente_id,
        timestamp: log.data_registro,
        notes: log.notes,
        symptoms: log.symptoms || [],
        painRegions: log.painRegions || [],
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza um registro diário existente.
   */
  async update(id: number, data: Partial<DailyLogPayload>): Promise<void> {
    try {
      await api.put(
        `/registros-diarios/${id}`,
        data as unknown as Record<string, unknown>,
      );
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deleta um registro diário existente.
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/registros-diarios/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
