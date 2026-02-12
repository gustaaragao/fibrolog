import { API_BASE_URL } from "@/constants/api";
import { storage } from "@/utils/storage";

export const reportsService = {
  /**
   * Fetches the PDF report from the API.
   * @param dataInicio ISO 8601 string
   * @param dataFim ISO 8601 string
   * @returns Promise with the blob response
   */
  async getReportPdf(dataInicio: string, dataFim: string): Promise<Blob> {
    const token = await storage.getItemAsync("fibrolog_access_token");

    if (!token) {
      throw new Error("Sessão expirada. Por favor, faça login novamente.");
    }

    const url = new URL(`${API_BASE_URL}/relatorios/pdf`);
    url.searchParams.append("data_inicio", dataInicio);
    url.searchParams.append("data_fim", dataFim);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error("Não foi possível gerar o relatório. Tente novamente mais tarde.");
    }

    return await response.blob();
  },
};
