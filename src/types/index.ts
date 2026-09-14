export type BookStatus = 'Disponível' | 'Reservado' | 'Emprestado' | 'Manutenção' | 'Indisponível';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  year: number;
  edition: string;
  pages: number;
  language: string;
  shelf: string; // Prateleira / Localização
  totalCopies: number;
  availableCopies: number;
  status: BookStatus;
  description: string;
  coverColor?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateBookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookInput = Partial<CreateBookInput>;

export interface BookListParams {
  search?: string;
  category?: string;
  status?: string;
  publisher?: string;
}

/**
 * BackendSource: Indica qual backend processou a requisição no cluster (Python ou JavaScript).
 * Esse dado vem exclusivamente da API Orquestradora Java.
 */
export type BackendSource = 'Python' | 'JavaScript' | string;

/**
 * Envelope genérico de resposta da API Orquestradora Java
 * TODO: Ajustar para a chave exata assim que definida na Seção 6 da disciplina.
 */
export interface ApiResponse<T> {
  data: T;
  activeBackend?: BackendSource;
  backendSource?: BackendSource;
  servedBy?: BackendSource;
  timestamp?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
