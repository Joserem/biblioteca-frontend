import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services/book.service';
import { Livro, CriarLivroPayload, AtualizarLivroPayload } from '../../../types';
import { getApiErrorMessage } from '../../../lib/api/client';
import { toast } from 'sonner';

/**
 * Hook para listar livros da API Orquestradora Java.
 * Chave de cache: ['livros']
 * Retry controlado: 1 tentativa.
 */
export function useBooksQuery() {
  return useQuery({
    queryKey: ['livros'],
    queryFn: () => bookService.listLivros(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obter um livro específico pelo seu id_livro.
 * Chave de cache: ['livros', id_livro]
 */
export function useBookQuery(id_livro: number | string | undefined) {
  return useQuery({
    queryKey: ['livros', id_livro],
    queryFn: () => bookService.getLivroById(id_livro!),
    enabled: id_livro !== undefined && id_livro !== '',
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation para cadastrar um novo livro (POST /livros).
 * Invalida ['livros'] após sucesso.
 */
export function useCreateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CriarLivroPayload) => bookService.createLivro(data),
    onSuccess: (newLivro: Livro) => {
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      toast.success('Livro cadastrado com sucesso!', {
        description: `"${newLivro.titulo || 'O livro'}" foi adicionado ao acervo.`,
      });
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(
        error,
        'Não foi possível salvar o livro. Verifique os dados informados.'
      );
      toast.error('Erro ao cadastrar livro', {
        description: message,
      });
    },
  });
}

/**
 * Mutation para atualizar um livro existente (PUT /livros/{id_livro}).
 * Invalida ['livros'] e ['livros', id_livro] após sucesso.
 */
export function useUpdateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id_livro, data }: { id_livro: number | string; data: AtualizarLivroPayload }) =>
      bookService.updateLivro(id_livro, data),
    onSuccess: (updatedLivro: Livro) => {
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      if (updatedLivro?.id_livro) {
        queryClient.invalidateQueries({ queryKey: ['livros', updatedLivro.id_livro] });
      }
      toast.success('Livro atualizado com sucesso!', {
        description: `"${updatedLivro.titulo || 'O livro'}" teve seus dados atualizados.`,
      });
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(
        error,
        'Não foi possível salvar as alterações. Tente novamente.'
      );
      toast.error('Erro ao atualizar livro', {
        description: message,
      });
    },
  });
}

/**
 * Mutation para excluir um livro (DELETE /livros/{id_livro}).
 * Invalida ['livros'] após sucesso.
 */
export function useDeleteBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id_livro: number | string) => bookService.deleteLivro(id_livro),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      toast.success('Livro removido do acervo com sucesso.');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(
        error,
        'Não foi possível excluir o livro. Tente novamente.'
      );
      toast.error('Erro ao excluir livro', {
        description: message,
      });
    },
  });
}

