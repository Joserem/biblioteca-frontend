import { apiClient } from '../../../lib/api/client';
import { Book, CreateBookInput, UpdateBookInput, BookListParams, ApiResponse } from '../../../types';

/**
 * Normaliza respostas da Orquestradora, aceitando tanto payloads diretos
 * quanto envelopes no formato ApiResponse<T>
 */
function unwrapResponse<T>(data: ApiResponse<T> | T): T {
  if (data && typeof data === 'object' && 'data' in data) {
    return (data as ApiResponse<T>).data;
  }
  return data as T;
}

/**
 * Serviço de Livros.
 * Consome EXCLUSIVAMENTE a API Orquestradora Java.
 * Proibido qualquer fallback silencioso para dados mockados em caso de erro.
 */
export const bookService = {
  /**
   * Listagem de livros cadastrados com suporte a busca e filtros.
   * Endpoint: GET /books
   */
  async listBooks(params?: BookListParams): Promise<Book[]> {
    const response = await apiClient.get<ApiResponse<Book[]> | Book[]>('/books', {
      params: {
        search: params?.search || undefined,
        category: params?.category || undefined,
        status: params?.status || undefined,
        publisher: params?.publisher || undefined,
      },
    });
    return unwrapResponse(response.data);
  },

  /**
   * Busca um livro específico pelo seu ID.
   * Endpoint: GET /books/:id
   */
  async getBookById(id: string): Promise<Book> {
    const response = await apiClient.get<ApiResponse<Book> | Book>(`/books/${id}`);
    return unwrapResponse(response.data);
  },

  /**
   * Cadastra um novo livro no acervo.
   * Endpoint: POST /books
   */
  async createBook(data: CreateBookInput): Promise<Book> {
    const response = await apiClient.post<ApiResponse<Book> | Book>('/books', data);
    return unwrapResponse(response.data);
  },

  /**
   * Atualiza os dados de um livro existente.
   * Endpoint: PUT /books/:id
   */
  async updateBook(id: string, updates: UpdateBookInput): Promise<Book> {
    const response = await apiClient.put<ApiResponse<Book> | Book>(`/books/${id}`, updates);
    return unwrapResponse(response.data);
  },

  /**
   * Exclui um livro do acervo.
   * Endpoint: DELETE /books/:id
   */
  async deleteBook(id: string): Promise<void> {
    await apiClient.delete(`/books/${id}`);
  },
};

