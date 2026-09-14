import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  BookOpen,
  Barcode,
  Calendar,
  Layers,
  MapPin,
  Globe,
  FileText,
  Clock,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { PageContainer } from '../../../components/ui/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { BackendStatus } from '../components/BackendStatus';
import { useBookQuery, useDeleteBookMutation } from '../hooks/useBooksQuery';
import { formatDate, formatDateTime } from '../../../lib/utils';

export const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: book, isLoading, isError } = useBookQuery(id);
  const deleteMutation = useDeleteBookMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <PageContainer>
        <Card className="p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#D90052]/20 border-t-[#D90052] rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800">Carregando dados do livro...</h3>
          <p className="text-xs text-slate-500 mt-1">Consultando API Orquestradora</p>
        </Card>
      </PageContainer>
    );
  }

  if (isError || !book) {
    return (
      <PageContainer>
        <Card className="p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Livro não encontrado</h2>
          <p className="text-xs text-slate-500 mb-6">
            O livro solicitado não foi encontrado no acervo ou foi removido.
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
          title={book.title}
          description={`Por ${book.author} • Publicado por ${book.publisher}`}
          badge={<Badge status={book.status} size="md" />}
          className="mb-0"
        />

        <div className="flex items-center gap-3">
          <BackendStatus />
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/livros')}
          >
            Voltar
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Edit2 className="w-4 h-4" />}
            onClick={() => navigate(`/livros/${book.id}/editar`)}
          >
            Editar
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal: Resumo e Sinopse */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D90052]" />
              Sinopse da Obra
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {book.description || 'Nenhuma descrição detalhada informada.'}
            </p>
          </Card>

          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D90052]" />
              Especificações Técnicas
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Editora</span>
                <span className="font-semibold text-slate-800">{book.publisher}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Ano de Publicação</span>
                <span className="font-semibold text-slate-800">{book.year}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Edição</span>
                <span className="font-semibold text-slate-800">{book.edition || '1ª Edição'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Páginas</span>
                <span className="font-semibold text-slate-800">{book.pages}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Idioma</span>
                <span className="font-semibold text-slate-800">{book.language}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Categoria</span>
                <span className="font-semibold text-slate-800">{book.category}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna Lateral: Localização e Disponibilidade */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D90052]" />
              Disponibilidade no Acervo
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-600">Total de Exemplares</span>
                <span className="font-bold text-slate-900 text-sm">{book.totalCopies}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100">
                <span className="text-xs font-semibold">Exemplares Disponíveis</span>
                <span className="font-bold text-emerald-700 text-base">
                  {book.availableCopies}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-600">Localização / Prateleira</span>
                <span className="font-mono font-bold text-[#D90052] text-xs">
                  {book.shelf}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-600">Código ISBN</span>
                <span className="font-mono text-xs text-slate-800">{book.isbn}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Metadados do Registro
            </h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Cadastrado em:</span>
                <span className="font-medium text-slate-700">{formatDate(book.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Última atualização:</span>
                <span className="font-medium text-slate-700">{formatDate(book.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>ID do Sistema:</span>
                <span className="font-mono text-2xs text-slate-400">{book.id}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={async () => {
          await deleteMutation.mutateAsync(book.id);
          setIsDeleteDialogOpen(false);
          navigate('/livros');
        }}
        title="Excluir Livro"
        description={`Tem certeza que deseja excluir o livro "${book.title}"? Esta ação removerá o título e todos os seus registros do acervo permanentemente.`}
        confirmLabel={deleteMutation.isPending ? 'Excluindo...' : 'Sim, Excluir'}
        cancelLabel="Cancelar"
        variant="danger"
      />
    </PageContainer>
  );
};
