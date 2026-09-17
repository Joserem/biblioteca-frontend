import { apiClient } from '../../../lib/api/client';
import { Livro, CriarLivroPayload, AtualizarLivroPayload, ApiResponse } from '../../../types';

/**
 * Normaliza defensivamente respostas de lista de livros da API Orquestradora.
 * Suporta tanto array direto `[ ... ]` quanto envelopes `{ data: [ ... ] }` ou `{ livros: [ ... ] }`.
 * Qualquer adaptação fica estritamente centralizada neste adapter.
 */
function unwrapLivrosList(payload: unknown): Livro[] {
  if (Array.isArray(payload)) {
    return payload as Livro[];
  }
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) {
      return obj.data as Livro[];
    }
    if (Array.isArray(obj.livros)) {
      return obj.livros as Livro[];
    }
  }
  return [];
}

/**
 * Normaliza defensivamente a resposta de um único livro.
 * Suporta tanto objeto direto `{ ... }` quanto envelopes `{ data: { ... } }` ou `{ livro: { ... } }`.
 */
function unwrapLivroItem(payload: unknown): Livro {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      return obj.data as Livro;
    }
    if (obj.livro && typeof obj.livro === 'object' && !Array.isArray(obj.livro)) {
      return obj.livro as Livro;
    }
    return obj as unknown as Livro;
  }
  return payload as Livro;
}

/**
 * Serviço de Livros (Equipe 1).
 * Consome EXCLUSIVAMENTE a API Orquestradora Java em http://localhost:8080.
 * Endpoints estritamente alinhados ao contrato oficial:
 * - GET    /livros
 * - GET    /livros/{id_livro}
 * - POST   /livros
 * - PUT    /livros/{id_livro}
 * - DELETE /livros/{id_livro}
 */
export const bookService = {
  /**
   * Listagem de livros cadastrados.
   * Endpoint: GET /livros
   */
  async listLivros(): Promise<Livro[]> {
    const response = await apiClient.get<ApiResponse<Livro[]> | Livro[]>('/livros');
    return unwrapLivrosList(response.data);
  },

  /**
   * Busca um livro específico pelo seu id_livro.
   * Endpoint: GET /livros/{id_livro}
   */
  async getLivroById(id_livro: number | string): Promise<Livro> {
    const response = await apiClient.get<ApiResponse<Livro> | Livro>(`/livros/${id_livro}`);
    return unwrapLivroItem(response.data);
  },

  /**
   * Cadastra um novo livro no acervo.
   * Endpoint: POST /livros
   * Payload: { titulo, isbn, autor, editora }
   */
  async createLivro(data: CriarLivroPayload): Promise<Livro> {
    const response = await apiClient.post<ApiResponse<Livro> | Livro>('/livros', data);
    return unwrapLivroItem(response.data);
  },

  /**
   * Atualiza os dados cadastrais de um livro existente.
   * Endpoint: PUT /livros/{id_livro}
   * Payload: { titulo, isbn, autor, editora }
   */
  async updateLivro(id_livro: number | string, data: AtualizarLivroPayload): Promise<Livro> {
    const response = await apiClient.put<ApiResponse<Livro> | Livro>(`/livros/${id_livro}`, data);
    return unwrapLivroItem(response.data);
  },

  /**
   * Exclui um livro do acervo.
   * Endpoint: DELETE /livros/{id_livro}
   */
  async deleteLivro(id_livro: number | string): Promise<void> {
    await apiClient.delete(`/livros/${id_livro}`);
  },
};


