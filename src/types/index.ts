/**
 * Modelo oficial de Livro segundo o Contrato Oficial do Projeto.
 * Exclusivamente estes 7 campos retornados pela API:
 */
export interface Livro {
  id_livro: number;
  titulo: string;
  isbn: string;
  autor: string;
  editora: string;
  data_cadastro: string;
  data_atualizacao: string;
}

/**
 * Payload para criação de livro (POST /livros).
 * O frontend envia exclusivamente os 4 campos que o usuário informa.
 * id_livro e timestamps não são inventados no frontend.
 */
export interface CriarLivroPayload {
  titulo: string;
  isbn: string;
  autor: string;
  editora: string;
}

/**
 * Payload para atualização de livro (PUT /livros/{id_livro}).
 * Permite a edição dos campos informativos do livro.
 */
export type AtualizarLivroPayload = CriarLivroPayload;

/**
 * BackendSource: Indica qual backend processou a requisição no cluster.
 * Valores esperados: 'Python' | 'JavaScript' | string.
 */
export type BackendSource = 'Python' | 'JavaScript' | string;

/**
 * Envelope genérico de resposta da API Orquestradora Java, caso a API
 * envolva os dados em uma propriedade `data`.
 */
export interface ApiResponse<T> {
  data?: T;
  erro?: string;
  status?: string;
  leader?: string;
  timestamp?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

