import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';

/**
 * Cliente HTTP exclusivo para a API Orquestradora Java.
 * O Frontend NUNCA chama as APIs Python ou JavaScript diretamente.
 */
export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10000, // 10 segundos para lidar com resposta lenta e transições de líder
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
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
        `Não foi possível conectar à API Orquestradora Java. Verifique se o serviço está ativo em ${env.VITE_API_URL}.`
      );
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);
