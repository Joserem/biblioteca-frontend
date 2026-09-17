import { useQuery } from '@tanstack/react-query';
import { healthService } from '../services/health.service';

/**
 * Hook para consulta periódica do status da API Orquestradora e do backend líder.
 * refetchInterval: 4000ms (4 segundos) permite failover visível em tempo real sem sobrecarregar a rede.
 */
export function useHealthQuery() {
  return useQuery({
    queryKey: ['orchestrator-health'],
    queryFn: () => healthService.getHealth(),
    refetchInterval: 4000,
    retry: 0, // Atualização rápida sem retry demorado em caso de queda
    refetchOnWindowFocus: true,
  });
}

