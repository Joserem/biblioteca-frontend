import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { backendStatusStore } from './backend-status';

/**
 * CONFIGURAÇÃO DO CAMPO DE IDENTIFICAÇÃO DO BACKEND ATIVO
 * 
 * TODO: Quando o contrato da Seção 6 da disciplina for publicado com o nome exato do campo,
 * configure a constante PREFERRED_BACKEND_FIELD com a chave oficial.
 * O extrator inspeciona os campos mais prováveis por padrão para máxima compatibilidade.
 */
export const PREFERRED_BACKEND_FIELD = 'activeBackend'; // alternativas: 'backendSource', 'servedBy', etc.

export const CANDIDATE_BODY_FIELDS = [
  PREFERRED_BACKEND_FIELD,
  'backendSource',
  'activeBackend',
  'servedBy',
  'backend',
  'leader',
  'processedBy',
] as const;

export const CANDIDATE_HEADER_FIELDS = [
  'x-active-backend',
  'x-backend-source',
  'x-served-by',
  'x-backend',
  'x-leader',
] as const;

/**
 * URL Base exclusiva da API Orquestradora Java.
 * O Frontend NUNCA chama as APIs Python ou JavaScript diretamente.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos para lidar com resposta lenta e transições de líder
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Extrai o indicador de backend ativo dos dados ou headers da resposta.
 */
function extractActiveBackend(response: AxiosResponse): { value: string; field: string } | null {
  // 1. Verificar no corpo da resposta
  if (response.data && typeof response.data === 'object') {
    for (const field of CANDIDATE_BODY_FIELDS) {
      if (typeof response.data[field] === 'string' && response.data[field].trim().length > 0) {
        return { value: response.data[field].trim(), field: `body.${field}` };
      }
    }
  }

  // 2. Verificar nos headers HTTP
  if (response.headers) {
    for (const header of CANDIDATE_HEADER_FIELDS) {
      const headerVal = response.headers[header];
      if (typeof headerVal === 'string' && headerVal.trim().length > 0) {
        return { value: headerVal.trim(), field: `header.${header}` };
      }
    }
  }

  return null;
}

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const extracted = extractActiveBackend(response);
    if (extracted) {
      backendStatusStore.setActiveBackend(extracted.value, extracted.field);
    }
    return response;
  },
  (error: AxiosError) => {
    // Tratamento de Timeout
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      const timeoutMessage = 'A resposta está demorando mais que o esperado. Tente novamente.';
      const customTimeoutError = new Error(timeoutMessage);
      (customTimeoutError as any).isTimeout = true;
      (customTimeoutError as any).originalError = error;
      return Promise.reject(customTimeoutError);
    }

    // Tratamento de falha de conexão de rede com a Orquestradora
    if (!error.response && error.request) {
      const networkError = new Error(
        'Não foi possível conectar à API Orquestradora Java. Verifique se o serviço está ativo.'
      );
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);
