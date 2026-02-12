import { api } from "./api";

export interface DashboardStatistics {
  total_registros: number;
  total_crises: number;
  dias_ativos: number;
  media_intensidade_dor: number | null;
  sintoma_mais_frequente: string | null;
  sequencia_dias_consecutivos: number;
  taxa_adesao: number | null;
}

export interface MetricTrend {
  valor: number;
  variacao_percentual: number | null;
  tendencia: "alta" | "baixa" | "neutro";
}

export interface WeeklyPainData {
  dia: string;
  data: string;
  intensidade_dor: number | null;
}

export interface PatientInsight {
  tipo: "success" | "warning" | "info" | "danger";
  mensagem: string;
  icone: string;
}

export interface ProgressStatistics {
  media_dor_semana: MetricTrend;
  dias_registrados_mes: MetricTrend;
  crises_mes: MetricTrend;
  grafico_dor_semanal: WeeklyPainData[];
  insights: PatientInsight[];
}

export const statisticsService = {
  /**
   * Busca as estatísticas gerais do dashboard do paciente logado
   */
  async getDashboard(): Promise<DashboardStatistics> {
    try {
      const response = await api.get<DashboardStatistics>(
        "/estatisticas/dashboard"
      );
      return response;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  },

  /**
   * Busca as estatísticas de progresso detalhadas do paciente logado
   */
  async getProgresso(): Promise<ProgressStatistics> {
    try {
      const response = await api.get<ProgressStatistics>(
        "/estatisticas/progresso"
      );
      return response;
    } catch (error) {
      console.error("Erro ao buscar estatísticas de progresso:", error);
      throw error;
    }
  },
};
