import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, BookOpen, Save, RotateCcw } from 'lucide-react';
import { PageContainer } from '../../../components/ui/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { BackendStatus } from '../components/BackendStatus';
import { useCreateBookMutation } from '../hooks/useBooksQuery';

const bookSchema = z.object({
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres'),
  isbn: z.string().min(10, 'ISBN inválido (mínimo 10 caracteres)'),
  author: z.string().min(2, 'Informe o nome do autor'),
  publisher: z.string().min(2, 'Informe a editora'),
  category: z.string().min(1, 'Selecione uma categoria'),
  year: z.number().min(1000, 'Ano inválido').max(new Date().getFullYear() + 1, 'Ano futuro inválido'),
  edition: z.string().optional(),
  pages: z.number().min(1, 'Número de páginas deve ser maior que 0'),
  language: z.string().min(1, 'Informe o idioma'),
  shelf: z.string().min(1, 'Informe a localização da prateleira (ex: A-01-04)'),
  totalCopies: z.number().min(1, 'Quantidade deve ser de pelo menos 1 exemplar'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.enum(['Disponível', 'Reservado', 'Emprestado', 'Manutenção', 'Indisponível']),
});

type BookFormData = z.infer<typeof bookSchema>;

export const NewBookPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateBookMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      isbn: '',
      author: '',
      publisher: '',
      category: 'Literatura Brasileira',
      year: new Date().getFullYear(),
      edition: '1ª Edição',
      pages: 200,
      language: 'Português',
      shelf: 'A-01-01',
      totalCopies: 3,
      status: 'Disponível',
      description: '',
    },
  });

  const onSubmit = async (data: BookFormData) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        edition: data.edition || '1ª Edição',
        availableCopies: data.totalCopies,
      });
      navigate('/livros');
    } catch {
      // O erro já é tratado e notificado com toast via onError da mutation
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

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <PageHeader
          title="Cadastro de Novo Livro"
          description="Preencha os campos abaixo para cadastrar um novo livro no sistema."
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
              Dados Principais do Livro
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

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quantidade de Exemplares"
                  type="number"
                  isRequired
                  error={errors.totalCopies?.message}
                  {...register('totalCopies', { valueAsNumber: true })}
                />

                <Select
                  label="Status Inicial"
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

          {/* Ações do Formulário */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="md"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => reset()}
              disabled={createMutation.isPending}
            >
              Limpar Campos
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Save className="w-4 h-4" />}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Salvando...' : 'Cadastrar Livro'}
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};
