import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';

/**
 * Cliente HTTP exclusivo para a API Orquestradora Java em http://localhost:8080.
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

/**
 * Extrai mensagem descritiva amigável do erro retornado pela API ou pela camada de rede.
 * Prioriza estritamente `response.data.erro` conforme contrato da Orquestradora.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  if (!error) return fallback;

  // Erro customizado previamente formatado
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
    const customMsg = (error as any).message;
    // Se for mensagem de timeout ou conexão já tratada, retorna diretamente
    if (customMsg.includes('Não foi possível conectar') || customMsg.includes('demorando mais que o esperado')) {
      return customMsg;
    }
  }

  // AxiosError
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ erro?: string; message?: string }>;

    // Timeout
    if (axiosErr.code === 'ECONNABORTED' || axiosErr.message?.toLowerCase().includes('timeout')) {
      return 'A resposta está demorando mais que o esperado. Tente novamente.';
    }

    // Sem resposta (API Orquestradora desligada)
    if (!axiosErr.response && axiosErr.request) {
      return 'Não foi possível conectar à API Orquestradora.';
    }

    // Resposta HTTP com corpo de erro estruturado
    const data = axiosErr.response?.data;
    if (data && typeof data === 'object' && data.erro) {
      return data.erro;
    }

    const status = axiosErr.response?.status;
    if (status === 400) {
      return 'Não foi possível concluir a operação. Verifique os dados informados.';
    }
    if (status === 404) {
      return 'Livro não encontrado.';
    }
    if (status === 500) {
      return 'Ocorreu um erro no servidor. Tente novamente.';
    }
    if (status === 503) {
      return 'Serviço temporariamente indisponível. Tente novamente em instantes.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<{ erro?: string }>) => {
    // Tratamento de Timeout
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      const timeoutMessage = 'A resposta está demorando mais que o esperado. Tente novamente.';
      const customTimeoutError = new Error(timeoutMessage);
      (customTimeoutError as any).isTimeout = true;
      (customTimeoutError as any).originalError = error;
      return Promise.reject(customTimeoutError);
    }

    // Tratamento de falha de conexão de rede com a Orquestradora (:8080)
    if (!error.response && error.request) {
      const networkError = new Error('Não foi possível conectar à API Orquestradora.');
      (networkError as any).isNetworkError = true;
      (networkError as any).originalError = error;
      return Promise.reject(networkError);
    }

    // Se o backend respondeu com { "erro": "..." }, encapsula em Error com essa mensagem
    const backendErrorMsg = error.response?.data?.erro;
    if (backendErrorMsg) {
      const apiError = new Error(backendErrorMsg);
      (apiError as any).response = error.response;
      (apiError as any).status = error.response?.status;
      return Promise.reject(apiError);
    }

    // Códigos HTTP com mensagens amigáveis padrão caso não haja campo "erro"
    const status = error.response?.status;
    let friendlyMessage = 'Ocorreu um erro no servidor. Tente novamente.';
    if (status === 400) {
      friendlyMessage = 'Não foi possível concluir a operação. Verifique os dados informados.';
    } else if (status === 404) {
      friendlyMessage = 'Livro não encontrado.';
    } else if (status === 500) {
      friendlyMessage = 'Ocorreu um erro no servidor. Tente novamente.';
    }

    const fallbackError = new Error(friendlyMessage);
    (fallbackError as any).response = error.response;
    (fallbackError as any).status = status;
    return Promise.reject(fallbackError);
  }
);

