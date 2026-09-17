/**
 * Configuração de ambiente do Frontend.
 * Comunicação exclusiva com a API Orquestradora Java.
 */
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');

export const env = {
  VITE_API_URL: API_URL,
};


