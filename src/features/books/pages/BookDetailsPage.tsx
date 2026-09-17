import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  BookOpen,
  Calendar,
  Trash2,
  AlertCircle,
  Hash,
  Building2,
  User,
  Barcode,
} from 'lucide-react';
import { PageContainer } from '../../../components/ui/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { BackendStatus } from '../components/BackendStatus';
import { useBookQuery, useDeleteBookMutation } from '../hooks/useBooksQuery';
import { formatDateTime } from '../../../lib/utils';

export const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: livro, isLoading, isError } = useBookQuery(id);
  const deleteMutation = useDeleteBookMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  if (isError || !livro) {
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
          title={livro.titulo}
          description={`Por ${livro.autor} • Publicado por ${livro.editora}`}
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
            onClick={() => navigate(`/livros/${livro.id_livro}/editar`)}
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
        {/* Coluna Principal: Informações Oficiais do Livro */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D90052]" />
              Dados Cadastrais do Livro
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Título da Obra
                </span>
                <span className="font-semibold text-slate-900 text-base">{livro.titulo}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1 text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Autor
                </span>
                <span className="font-semibold text-slate-800">{livro.autor}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1 text-xs flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Editora
                </span>
                <span className="font-semibold text-slate-800">{livro.editora}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1 text-xs flex items-center gap-1.5">
                  <Barcode className="w-3.5 h-3.5 text-slate-400" /> Código ISBN
                </span>
                <span className="font-mono font-semibold text-slate-800">{livro.isbn}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna Lateral: Metadados do Registro */}
        <div className="space-y-6">
          <Card>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              Metadados do Registro
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">ID no Sistema:</span>
                <span className="font-mono font-bold text-[#D90052]">#{livro.id_livro}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Data de Cadastro:
                </span>
                <span className="font-medium text-slate-700">
                  {formatDateTime(livro.data_cadastro)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Última Atualização:
                </span>
                <span className="font-medium text-slate-700">
                  {formatDateTime(livro.data_atualizacao)}
                </span>
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
          try {
            await deleteMutation.mutateAsync(livro.id_livro);
            setIsDeleteDialogOpen(false);
            navigate('/livros');
          } catch {
            // Em erro, a mutation exibe o erro amigável e mantém na tela
            setIsDeleteDialogOpen(false);
          }
        }}
        title="Excluir Livro"
        description={`Tem certeza que deseja excluir o livro "${livro.titulo}"? Esta ação removerá o registro do acervo permanentemente.`}
        confirmLabel={deleteMutation.isPending ? 'Excluindo...' : 'Sim, Excluir'}
        cancelLabel="Cancelar"
        variant="danger"
      />
    </PageContainer>
  );
};

