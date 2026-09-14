import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, BookOpen, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { PageContainer } from '../../../components/ui/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { BackendStatus } from '../components/BackendStatus';
import { useBookQuery, useUpdateBookMutation } from '../hooks/useBooksQuery';

const bookSchema = z.object({
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres'),
  isbn: z.string().min(10, 'ISBN inválido (mínimo 10 caracteres)'),
  author: z.string().min(2, 'Informe o nome do autor'),
  publisher: z.string().min(2, 'Informe a editora'),
  category: z.string().min(1, 'Selecione uma categoria'),
  year: z.number().min(1000, 'Ano inválido').max(new Date().getFullYear() + 1, 'Ano inválido'),
  edition: z.string().optional(),
  pages: z.number().min(1, 'Número de páginas deve ser maior que 0'),
  language: z.string().min(1, 'Informe o idioma'),
  shelf: z.string().min(1, 'Informe a localização da prateleira'),
  totalCopies: z.number().min(1, 'Quantidade total inválida'),
  availableCopies: z.number().min(0, 'Quantidade disponível inválida'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.enum(['Disponível', 'Reservado', 'Emprestado', 'Manutenção', 'Indisponível']),
});

type BookFormData = z.infer<typeof bookSchema>;

export const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Queries e Mutations TanStack Query
  const { data: book, isLoading, isError } = useBookQuery(id);
  const updateMutation = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    values: book
      ? {
          title: book.title,
          isbn: book.isbn,
          author: book.author,
          publisher: book.publisher,
          category: book.category,
          year: book.year,
          edition: book.edition,
          pages: book.pages,
          language: book.language,
          shelf: book.shelf,
          totalCopies: book.totalCopies,
          availableCopies: book.availableCopies,
          description: book.description,
          status: book.status,
        }
      : undefined,
  });

  const onSubmit = async (data: BookFormData) => {
    if (!id) return;
    try {
      await updateMutation.mutateAsync({ id, data });
      navigate('/livros');
    } catch {
      // Notificado via onError da mutation
    }
  };

  const categoryOptions = [
    { value: 'Literatura Brasileira', label: 'Literatura Brasileira' },
    { value: 'Ficção Científica', label: 'Ficção Científica' },
    { value: 'Tecnologia', label: 'Tecnologia & Programação' },
    { value: 'História', label: 'História & Humanidades' },
    { value: 'Fantasia', label: 'Fantasia & Aventura' },
    { value: 'Filosofia', label: 'Filosofia' },
    { value: 'Psicologia', label: 'Psicologia' },
    { value: 'Ciências', label: 'Ciências & Matemática' },
    { value: 'Infantojuvenil', label: 'Infantojuvenil' },
  ];

  const statusOptions = [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Reservado', label: 'Reservado' },
    { value: 'Emprestado', label: 'Emprestado' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Indisponível', label: 'Indisponível' },
  ];

  // Estado de Carregamento
  if (isLoading) {
    return (
      <PageContainer>
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#D90052]/20 border-t-[#D90052] rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800">Carregando dados do livro...</h3>
          <p className="text-xs text-slate-500 mt-1">
            Consultando API Orquestradora Java
          </p>
        </Card>
      </PageContainer>
    );
  }

  // Estado de Livro Não Encontrado
  if (isError || !book) {
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
          title={`Editar: ${book.title}`}
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
              Dados do Livro
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Input
                label="Título"
                isRequired
                placeholder="Ex: Dom Casmurro"
                error={errors.title?.message}
                {...register('title')}
              />

              <Input
                label="ISBN"
                isRequired
                placeholder="Ex: 978-8572328104"
                error={errors.isbn?.message}
                {...register('isbn')}
              />

              <Input
                label="Autor"
                isRequired
                placeholder="Ex: Machado de Assis"
                error={errors.author?.message}
                {...register('author')}
              />

              <Input
                label="Editora"
                isRequired
                placeholder="Ex: Editora Garnier"
                error={errors.publisher?.message}
                {...register('publisher')}
              />

              <Select
                label="Categoria"
                isRequired
                options={categoryOptions}
                error={errors.category?.message}
                {...register('category')}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Ano de Publicação"
                  type="number"
                  isRequired
                  error={errors.year?.message}
                  {...register('year', { valueAsNumber: true })}
                />

                <Input
                  label="Edição"
                  placeholder="Ex: 2ª Edição"
                  error={errors.edition?.message}
                  {...register('edition')}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Total de Páginas"
                  type="number"
                  isRequired
                  error={errors.pages?.message}
                  {...register('pages', { valueAsNumber: true })}
                />

                <Input
                  label="Idioma"
                  isRequired
                  placeholder="Ex: Português"
                  error={errors.language?.message}
                  {...register('language')}
                />
              </div>

              <Input
                label="Prateleira / Localização"
                isRequired
                placeholder="Ex: A-01-04"
                error={errors.shelf?.message}
                {...register('shelf')}
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Total Exemplares"
                  type="number"
                  isRequired
                  error={errors.totalCopies?.message}
                  {...register('totalCopies', { valueAsNumber: true })}
                />

                <Input
                  label="Disponíveis"
                  type="number"
                  isRequired
                  error={errors.availableCopies?.message}
                  {...register('availableCopies', { valueAsNumber: true })}
                />

                <Select
                  label="Status"
                  isRequired
                  options={statusOptions}
                  error={errors.status?.message}
                  {...register('status')}
                />
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label="Sinopse / Descrição"
                  isRequired
                  rows={4}
                  placeholder="Breve resumo ou sinopse da obra..."
                  error={errors.description?.message}
                  {...register('description')}
                />
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
