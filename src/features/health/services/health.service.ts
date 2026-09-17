import { apiClient } from '../../../lib/api/client';

export interface BackendNode {
  id: string;
  serviceName: string;
  baseUri: string;
  status: 'HEALTHY' | 'UNAVAILABLE' | string;
  consecutiveFailures: number;
  lastHealthCheck: string;
  priority: number;
  leader: boolean;
}

export interface HealthCheckResponse {
  status?: string;
  leader?: string | null;
  lastLeadershipChange?: string;
  backends?: BackendNode[];
  erro?: string;
  timestamp?: string;
}

/**
 * Serviço responsável por consultar o status de liderança e saúde dos backends
 * exclusivamente através da API Orquestradora Java.
 * Endpoint exato: GET /backeds/health
 */
export const healthService = {
  async getHealth(): Promise<HealthCheckResponse> {

    try {
      // IMPORTANTE: Utilizar exatamente /backeds/health conforme especificado pela equipe da Orquestradora
      const response = await apiClient.get<HealthCheckResponse>('/backeds/health');
      return response.data;
    } catch (err: any) {
      // Caso a Orquestradora responda com HTTP 503/400 contendo o corpo { erro: "..." }
      if (err?.response?.data && typeof err.response.data === 'object' && err.response.data.erro) {
        return err.response.data as HealthCheckResponse;
      }
      // Se a Orquestradora estiver desligada (falha de conexão de rede), relança o erro
      throw err;
    }
  },
};
