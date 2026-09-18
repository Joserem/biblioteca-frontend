import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, BookOpen, Save, AlertCircle, Calendar, Hash } from 'lucide-react';
import { PageContainer } from '../../../components/ui/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { BackendStatus } from '../components/BackendStatus';
import { useBookQuery, useUpdateBookMutation } from '../hooks/useBooksQuery';
import { formatDate, formatIsbnInput } from '../../../lib/utils';

const editarLivroSchema = z.object({
  titulo: z
    .string()
    .min(1, 'O título é obrigatório')
    .min(2, 'O título deve ter pelo menos 2 caracteres'),
  isbn: z
    .string()
    .min(1, 'O código ISBN é obrigatório')
    .refine(val => val.replace(/\D/g, '').length >= 10, 'ISBN inválido (mínimo 10 dígitos)'),
  autor: z
    .string()
    .min(1, 'O nome do autor é obrigatório')
    .min(2, 'Informe o nome do autor'),
  editora: z
    .string()
    .min(1, 'O nome da editora é obrigatório')
    .min(2, 'Informe a editora'),
});

type EditarLivroFormData = z.infer<typeof editarLivroSchema>;

export const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Consultas e Mutações oficiais TanStack Query
  const { data: livro, isLoading, isError } = useBookQuery(id);
  const updateMutation = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditarLivroFormData>({
    resolver: zodResolver(editarLivroSchema),
    values: livro
      ? {
          titulo: livro.titulo || '',
          isbn: formatIsbnInput(livro.isbn || ''),
          autor: livro.autor || '',
          editora: livro.editora || '',
        }
      : undefined,
  });

  const onSubmit = async (data: EditarLivroFormData) => {
    if (!id) return;
    try {
      // O payload de atualização envia estritamente os dados permitidos:
      // { "titulo": "...", "isbn": "...", "autor": "...", "editora": "..." }
      await updateMutation.mutateAsync({
        id_livro: id,
        data: {
          titulo: data.titulo.trim(),
          isbn: data.isbn.trim(),
          autor: data.autor.trim(),
          editora: data.editora.trim(),
        },
      });
      navigate('/livros');
    } catch {
      // Erro notificado via onError da mutation
    }
  };

  // Estado de Carregamento
  if (isLoading) {
    return (
      <PageContainer>
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#D90052]/20 border-t-[#D90052] rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800">Carregando livro...</h3>
          <p className="text-xs text-slate-500 mt-1">
            Consultando API Orquestradora em http://localhost:8080
          </p>
        </Card>
      </PageContainer>
    );
  }

  // Estado de Livro Não Encontrado
  if (isError || !livro) {
    return (
      <PageContainer>
        <Card className="p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Livro não encontrado</h2>
          <p className="text-xs text-slate-500 mb-6">
            O livro solicitado não existe ou não pôde ser recuperado da Orquestradora.
          </p>
          <Button variant="primary" onClick={() => navigate('/livros')}>
            Voltar para Listagem
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <PageHeader
          title={`Editar: ${livro.titulo}`}
          description="Atualize as informações cadastrais do livro no acervo."
          className="mb-0"
        />

        <div className="flex items-center gap-3">
          <BackendStatus />
          <Button
            variant="outline"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/livros')}
            disabled={updateMutation.isPending}
          >
            Voltar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full space-y-6">
          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D90052]" />
              Dados do Livro (Campos Editáveis)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Input
                label="Título"
                isRequired
                placeholder="Ex: Dom Casmurro"
                error={errors.titulo?.message}
                {...register('titulo')}
                disabled={updateMutation.isPending}
              />

              <Input
                label="ISBN"
                isRequired
                placeholder="Ex: 978-8572328104"
                inputMode="numeric"
                maxLength={14}
                error={errors.isbn?.message}
                {...register('isbn', {
                  onChange: e => {
                    e.target.value = formatIsbnInput(e.target.value);
                  },
                })}
                disabled={updateMutation.isPending}
              />

              <Input
                label="Autor"
                isRequired
                placeholder="Ex: Machado de Assis"
                error={errors.autor?.message}
                {...register('autor')}
                disabled={updateMutation.isPending}
              />

              <Input
                label="Editora"
                isRequired
                placeholder="Ex: Editora Garnier"
                error={errors.editora?.message}
                {...register('editora')}
                disabled={updateMutation.isPending}
              />
            </div>
          </Card>

          {/* Metadados somente-leitura (id_livro e datas) protegidos contra edição manual */}
          <Card className="bg-slate-50/50 border-slate-200">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              Metadados do Registro (Somente Leitura)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-1">ID do Livro (id_livro)</span>
                <span className="font-mono font-bold text-slate-800">#{livro.id_livro}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Data de Cadastro
                </span>
                <span className="font-medium text-slate-700">{formatDate(livro.data_cadastro)}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Última Atualização
                </span>
                <span className="font-medium text-slate-700">{formatDate(livro.data_atualizacao)}</span>
              </div>
            </div>
          </Card>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/livros')}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Save className="w-4 h-4" />}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Salvando alterações...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};

