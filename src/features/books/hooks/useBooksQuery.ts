import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services/book.service';
import { BookListParams, CreateBookInput, UpdateBookInput } from '../../../types';
import { toast } from 'sonner';

/**
 * Hook para listar livros com filtros e retry controlado.
 * Retry controlado: 1 tentativa (não faz loop infinito e não executa failover).
 */
export function useBooksQuery(params?: BookListParams) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => bookService.listBooks(params),
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obter um livro específico pelo ID.
 */
export function useBookQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => bookService.getBookById(id!),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation para cadastrar um novo livro.
 * Invalida o cache 'books' para atualizar a listagem automaticamente.
 */
export function useCreateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookInput) => bookService.createBook(data),
    onSuccess: (newBook) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Livro cadastrado com sucesso!', {
        description: `"${newBook.title}" foi adicionado ao acervo.`,
      });
    },
    onError: (error: any) => {
      const message =
        error?.message || 'Não foi possível salvar o livro. Tente novamente.';
      toast.error('Erro ao cadastrar livro', {
        description: message,
      });
    },
  });
}

/**
 * Mutation para atualizar um livro existente.
 */
export function useUpdateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookInput }) =>
      bookService.updateBook(id, data),
    onSuccess: (updatedBook) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['books', updatedBook.id] });
      toast.success('Livro atualizado com sucesso!', {
        description: `"${updatedBook.title}" teve seus dados atualizados.`,
      });
    },
    onError: (error: any) => {
      const message =
        error?.message || 'Não foi possível salvar as alterações. Tente novamente.';
      toast.error('Erro ao atualizar livro', {
        description: message,
      });
    },
  });
}

/**
 * Mutation para excluir um livro do acervo.
 */
export function useDeleteBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Livro removido do acervo com sucesso.');
    },
    onError: (error: any) => {
      const message =
        error?.message || 'Não foi possível excluir o livro. Tente novamente.';
      toast.error('Erro ao excluir livro', {
        description: message,
      });
    },
  });
}
