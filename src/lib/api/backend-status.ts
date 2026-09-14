import { useSyncExternalStore } from 'react';

/**
 * BackendSource: Tipo representativo da fonte que processou a requisição na Orquestradora.
 * Valores típicos esperados: 'Python' | 'JavaScript' | string
 */
export type BackendSource = 'Python' | 'JavaScript' | string;

export interface BackendStatusState {
  activeBackend: BackendSource | null;
  lastUpdated: Date | null;
  sourceField?: string;
}

let currentState: BackendStatusState = {
  activeBackend: null,
  lastUpdated: null,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(listener => listener());
}

export const backendStatusStore = {
  getState: () => currentState,
  
  /**
   * Atualiza o backend ativo identificado na resposta da API Orquestradora Java.
   * NUNCA utilize este valor para escolher rotas ou URLs no frontend (failover é exclusivo da API).
   */
  setActiveBackend: (backend: BackendSource | null, sourceField?: string) => {
    currentState = {
      activeBackend: backend,
      lastUpdated: new Date(),
      sourceField,
    };
    notify();
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/**
 * Hook do React para consumir o status atual do backend ativo de forma reativa.
 */
export function useBackendStatus() {
  return useSyncExternalStore(
    backendStatusStore.subscribe,
    backendStatusStore.getState,
    backendStatusStore.getState
  );
}
