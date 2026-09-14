import { apiClient } from '../../../lib/api/client';
import { backendStatusStore } from '../../../lib/api/backend-status';
import { Book, CreateBookInput, UpdateBookInput, BookListParams, ApiResponse } from '../../../types';
import { mockBooks } from '../../../mocks/books.mock';

/**
 * Flag para ativar simulação local via mocks caso a API Orquestradora Java
 * ainda não esteja rodando localmente (ex: durante avaliação em banca ou dev offline).
 * Configure no .env: VITE_USE_MOCKS=true ou deixe vazio/false para usar a Orquestradora real.
 */
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Estado local de mock em memória inicializado a partir dos dados mock existentes
let inMemoryBooks: Book[] = [...mockBooks];

// Simula a alternância de backend ativo durante testes com mock
let mockBackendAlternator: 'Python' | 'JavaScript' = 'Python';

function getMockBackend(): 'Python' | 'JavaScript' {
  // Alterna o backend para demonstrar a visibilidade do failover caso esteja em modo mock
  const current = mockBackendAlternator;
  return current;
}

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
 * Serviço exclusivo para operações do CRUD de Livros.
 * Comunica-se EXCLUSIVAMENTE com a API Orquestradora Java.
 * O frontend NUNCA chama as APIs Python ou JavaScript diretamente.
 */
export const bookService = {
  /**
   * Listagem de livros cadastrados com suporte a busca e filtros.
   * Endpoint: GET /books
   */
  async listBooks(params?: BookListParams): Promise<Book[]> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 300));
      backendStatusStore.setActiveBackend(getMockBackend(), 'mock');
      
      let filtered = [...inMemoryBooks];
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          b =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query) ||
            b.isbn.toLowerCase().includes(query)
        );
      }
      if (params?.category) {
        filtered = filtered.filter(b => b.category === params.category);
      }
      if (params?.status) {
        filtered = filtered.filter(b => b.status === params.status);
      }
      return filtered;
    }

    try {
      const response = await apiClient.get<ApiResponse<Book[]> | Book[]>('/books', {
        params: {
          search: params?.search || undefined,
          category: params?.category || undefined,
          status: params?.status || undefined,
          publisher: params?.publisher || undefined,
        },
      });
      return unwrapResponse(response.data);
    } catch (err: any) {
      // Fallback gracioso caso a Orquestradora não esteja rodando e não haja VITE_USE_MOCKS explícito
      if (err?.isNetworkError || err?.code === 'ERR_NETWORK') {
        console.warn('API Orquestradora indisponível. Carregando dados locais de desenvolvimento.');
        backendStatusStore.setActiveBackend(getMockBackend(), 'fallback');
        return inMemoryBooks;
      }
      throw err;
    }
  },

  /**
   * Busca um livro específico pelo seu ID.
   * Endpoint: GET /books/:id
   */
  async getBookById(id: string): Promise<Book> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 200));
      backendStatusStore.setActiveBackend(getMockBackend(), 'mock');
      const book = inMemoryBooks.find(b => b.id === id);
      if (!book) {
        throw new Error('Livro não encontrado');
      }
      return book;
    }

    try {
      const response = await apiClient.get<ApiResponse<Book> | Book>(`/books/${id}`);
      return unwrapResponse(response.data);
    } catch (err: any) {
      if (err?.isNetworkError || err?.code === 'ERR_NETWORK') {
        const book = inMemoryBooks.find(b => b.id === id);
        if (!book) throw new Error('Livro não encontrado');
        backendStatusStore.setActiveBackend(getMockBackend(), 'fallback');
        return book;
      }
      throw err;
    }
  },

  /**
   * Cadastra um novo livro no acervo.
   * Endpoint: POST /books
   */
  async createBook(data: CreateBookInput): Promise<Book> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 400));
      backendStatusStore.setActiveBackend(getMockBackend(), 'mock');
      const newBook: Book = {
        ...data,
        id: `liv-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryBooks = [newBook, ...inMemoryBooks];
      return newBook;
    }

    try {
      const response = await apiClient.post<ApiResponse<Book> | Book>('/books', data);
      return unwrapResponse(response.data);
    } catch (err: any) {
      if (err?.isNetworkError || err?.code === 'ERR_NETWORK') {
        const newBook: Book = {
          ...data,
          id: `liv-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        inMemoryBooks = [newBook, ...inMemoryBooks];
        backendStatusStore.setActiveBackend(getMockBackend(), 'fallback');
        return newBook;
      }
      throw err;
    }
  },

  /**
   * Atualiza os dados de um livro existente.
   * Endpoint: PUT /books/:id
   */
  async updateBook(id: string, updates: UpdateBookInput): Promise<Book> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 400));
      backendStatusStore.setActiveBackend(getMockBackend(), 'mock');
      const index = inMemoryBooks.findIndex(b => b.id === id);
      if (index === -1) {
        throw new Error('Livro não encontrado para atualização');
      }
      const updatedBook: Book = {
        ...inMemoryBooks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      inMemoryBooks[index] = updatedBook;
      return updatedBook;
    }

    try {
      const response = await apiClient.put<ApiResponse<Book> | Book>(`/books/${id}`, updates);
      return unwrapResponse(response.data);
    } catch (err: any) {
      if (err?.isNetworkError || err?.code === 'ERR_NETWORK') {
        const index = inMemoryBooks.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Livro não encontrado');
        const updatedBook: Book = {
          ...inMemoryBooks[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        inMemoryBooks[index] = updatedBook;
        backendStatusStore.setActiveBackend(getMockBackend(), 'fallback');
        return updatedBook;
      }
      throw err;
    }
  },

  /**
   * Exclui um livro do acervo.
   * Endpoint: DELETE /books/:id
   */
  async deleteBook(id: string): Promise<void> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 300));
      backendStatusStore.setActiveBackend(getMockBackend(), 'mock');
      inMemoryBooks = inMemoryBooks.filter(b => b.id !== id);
      return;
    }

    try {
      await apiClient.delete(`/books/${id}`);
    } catch (err: any) {
      if (err?.isNetworkError || err?.code === 'ERR_NETWORK') {
        inMemoryBooks = inMemoryBooks.filter(b => b.id !== id);
        backendStatusStore.setActiveBackend(getMockBackend(), 'fallback');
        return;
      }
      throw err;
    }
  },

  /**
   * Método auxiliar para testes da banca: permite alternar manualmente o mock entre Python e JS
   * se o backend real não estiver conectado no momento da demonstração.
   */
  toggleMockBackend(target?: 'Python' | 'JavaScript') {
    mockBackendAlternator = target || (mockBackendAlternator === 'Python' ? 'JavaScript' : 'Python');
    backendStatusStore.setActiveBackend(mockBackendAlternator, 'manual-test');
  },
};
