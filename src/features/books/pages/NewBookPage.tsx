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
import { Button } from '../../../components/ui/Button';
import { BackendStatus } from '../components/BackendStatus';
import { useCreateBookMutation } from '../hooks/useBooksQuery';

const novoLivroSchema = z.object({
  titulo: z
    .string()
    .min(1, 'O título é obrigatório')
    .min(2, 'O título deve ter pelo menos 2 caracteres'),
  isbn: z
    .string()
    .min(1, 'O código ISBN é obrigatório')
    .min(10, 'ISBN inválido (mínimo 10 caracteres)'),
  autor: z
    .string()
    .min(1, 'O nome do autor é obrigatório')
    .min(2, 'Informe o nome do autor'),
  editora: z
    .string()
    .min(1, 'O nome da editora é obrigatório')
    .min(2, 'Informe a editora'),
});

type NovoLivroFormData = z.infer<typeof novoLivroSchema>;

export const NewBookPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateBookMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NovoLivroFormData>({
    resolver: zodResolver(novoLivroSchema),
    defaultValues: {
      titulo: '',
      isbn: '',
      autor: '',
      editora: '',
    },
  });

  const onSubmit = async (data: NovoLivroFormData) => {
    try {
      // O payload de criação envia estritamente os dados que o usuário informa:
      // { "titulo": "...", "isbn": "...", "autor": "...", "editora": "..." }
      await createMutation.mutateAsync({
        titulo: data.titulo.trim(),
        isbn: data.isbn.trim(),
        autor: data.autor.trim(),
        editora: data.editora.trim(),
      });
      navigate('/livros');
    } catch {
      // O erro já é tratado e notificado com toast via onError da mutation
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <PageHeader
          title="Cadastro de Novo Livro"
          description="Preencha os campos obrigatórios para cadastrar um novo livro no sistema."
          className="mb-0"
        />

        <div className="flex items-center gap-3">
          <BackendStatus />
          <Button
            variant="outline"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/livros')}
            disabled={createMutation.isPending}
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
              Dados do Livro (Contrato Oficial)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Input
                label="Título"
                isRequired
                placeholder="Ex: Dom Casmurro"
                error={errors.titulo?.message}
                {...register('titulo')}
                disabled={createMutation.isPending}
              />

              <Input
                label="ISBN"
                isRequired
                placeholder="Ex: 978-8572328104"
                error={errors.isbn?.message}
                {...register('isbn')}
                disabled={createMutation.isPending}
              />

              <Input
                label="Autor"
                isRequired
                placeholder="Ex: Machado de Assis"
                error={errors.autor?.message}
                {...register('autor')}
                disabled={createMutation.isPending}
              />

              <Input
                label="Editora"
                isRequired
                placeholder="Ex: Editora Garnier"
                error={errors.editora?.message}
                {...register('editora')}
                disabled={createMutation.isPending}
              />
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

