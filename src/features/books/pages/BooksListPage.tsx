import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  AlertCircle,
  Clock,
  X,
} from 'lucide-react';
import { Books, UsersThree, Buildings } from '@phosphor-icons/react';
import { PageContainer } from '../../../components/ui/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { MetricCard } from '../../../components/ui/MetricCard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../../components/ui/Table';
import { Pagination } from '../../../components/ui/Pagination';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { BackendStatus } from '../components/BackendStatus';
import { useBooksQuery, useDeleteBookMutation } from '../hooks/useBooksQuery';
import { formatDate } from '../../../lib/utils';
import { Livro } from '../../../types';

export const BooksListPage: React.FC = () => {
  const navigate = useNavigate();

  // Search state (pesquisa estritamente em titulo, autor, isbn, editora)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // TanStack Query para carregar livros da API Orquestradora
  const {
    data: livros = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useBooksQuery();

  // Mutation de exclusão
  const deleteMutation = useDeleteBookMutation();
  const [deleteLivroId, setDeleteLivroId] = useState<number | null>(null);

  // Filtragem local exclusivamente sobre campos existentes no contrato oficial
  const filteredLivros = useMemo(() => {
    if (!searchTerm.trim()) return livros;
    const term = searchTerm.toLowerCase().trim();
    return livros.filter(livro => {
      const matchTitulo = livro.titulo?.toLowerCase().includes(term);
      const matchAutor = livro.autor?.toLowerCase().includes(term);
      const matchIsbn = livro.isbn?.toLowerCase().includes(term);
      const matchEditora = livro.editora?.toLowerCase().includes(term);
      return matchTitulo || matchAutor || matchIsbn || matchEditora;
    });
  }, [livros, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredLivros.length / itemsPerPage) || 1;
  const paginatedLivros = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLivros.slice(start, start + itemsPerPage);
  }, [filteredLivros, currentPage, itemsPerPage]);

  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Métricas legítimas derivadas exclusivamente dos dados reais retornados pela API
  const totalLivros = livros.length;
  const totalAutores = useMemo(() => {
    return new Set(livros.map(l => l.autor?.trim()).filter(Boolean)).size;
  }, [livros]);
  const totalEditoras = useMemo(() => {
    return new Set(livros.map(l => l.editora?.trim()).filter(Boolean)).size;
  }, [livros]);

  const livroParaExcluir = livros.find(l => l.id_livro === deleteLivroId);

  // Mensagem amigável de erro extraída centralizadamente
  const errorMessage = useMemo(() => {
    if (!error) return null;
    if ((error as any)?.isTimeout) {
      return 'A resposta está demorando mais que o esperado. Tente novamente.';
    }
    return (
      (error as any)?.message ||
      'Não foi possível conectar à API Orquestradora. Verifique se o serviço está ativo em http://localhost:8080.'
    );
  }, [error]);

  const isTimeoutError = (error as any)?.isTimeout;

  return (
    <PageContainer>
      {/* Header com indicador do backend ativo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <PageHeader
          title="Livros"
          description="Gerencie o acervo cadastrado no sistema através da API Orquestradora."
          className="mb-0"
        />

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <BackendStatus />
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/livros/novo')}
          >
            Novo Livro
          </Button>
        </div>
      </div>

      {/* Cards de Métricas Reais do Contrato */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <MetricCard
          label="Total de Livros"
          value={isLoading || isError ? '—' : totalLivros.toString()}
          contextText={isError ? 'API desconectada' : `${totalLivros} títulos cadastrados`}
          icon={<Books className="w-10 h-10" weight="duotone" />}
          variant="blue"
        />

        <MetricCard
          label="Autores Cadastrados"
          value={isLoading || isError ? '—' : totalAutores.toString()}
          contextText={isError ? 'indisponível' : `${totalAutores} autores distintos`}
          icon={<UsersThree className="w-10 h-10" weight="duotone" />}
          variant="purple"
        />

        <MetricCard
          label="Editoras Registradas"
          value={isLoading || isError ? '—' : totalEditoras.toString()}
          contextText={isError ? 'indisponível' : `${totalEditoras} editoras no acervo`}
          icon={<Buildings className="w-10 h-10" weight="duotone" />}
          variant="green"
        />
      </div>

      {/* Barra de Busca (somente campos do contrato: título, autor, isbn, editora) */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <Input
              label="Buscar no Acervo"
              placeholder="Pesquisar por título, autor, ISBN ou editora..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {searchTerm && (
            <div className="sm:self-end pb-0.5">
              <Button
                variant="outline"
                size="md"
                onClick={resetSearch}
                icon={<X className="w-4 h-4" />}
              >
                Limpar Busca
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* ESTADO DE ERRO / TIMEOUT */}
      {isError && (
        <Card className="mb-6 border-rose-200 bg-rose-50/50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="text-rose-600 flex items-center justify-center shrink-0">
                {isTimeoutError ? (
                  <Clock className="w-9 h-9" />
                ) : (
                  <AlertCircle className="w-9 h-9" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-900">
                  {isTimeoutError
                    ? 'A resposta está demorando mais que o esperado. Tente novamente.'
                    : 'Falha ao carregar livros'}
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? 'Tentando...' : 'Tentar novamente'}
            </Button>
          </div>
        </Card>
      )}

      {/* TABELA DE LIVROS DO CONTRATO OFICIAL */}
      <Card padding="none" className="overflow-hidden">
        {isLoading ? (
          /* Loading State */
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse" />
            </div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50">
                <div className="w-8 h-10 bg-slate-200 rounded-md shrink-0 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded w-1/5 animate-pulse" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse hidden sm:block" />
              </div>
            ))}
            <div className="text-center py-2 text-xs text-slate-400 font-medium">
              Carregando livros...
            </div>
          </div>
        ) : paginatedLivros.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow isHoverable={false}>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Editora</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Data de Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLivros.map((livro: Livro) => (
                  <TableRow key={livro.id_livro}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 rounded-md flex items-center justify-center text-white bg-[#D90052] shrink-0 shadow-2xs">
                          <Books className="w-4 h-4 opacity-90" weight="fill" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/livros/${livro.id_livro}`}
                            className="font-bold text-slate-900 hover:text-[#D90052] transition-colors truncate block text-sm"
                          >
                            {livro.titulo}
                          </Link>
                          <span className="text-2xs text-slate-400 block truncate">
                            ID: #{livro.id_livro}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs sm:text-sm font-medium text-slate-800">
                        {livro.autor}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-2xs sm:text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {livro.isbn}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        {livro.editora}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-slate-500">
                        {formatDate(livro.data_cadastro)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-slate-500">
                        {formatDate(livro.data_atualizacao)}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/livros/${livro.id_livro}`)}
                          icon={<Eye className="w-3.5 h-3.5" />}
                          className="h-8 px-2 text-slate-500 hover:text-[#D90052]"
                          aria-label="Visualizar livro"
                          title="Visualizar detalhes"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/livros/${livro.id_livro}/editar`)}
                          icon={<Edit2 className="w-3.5 h-3.5" />}
                          className="h-8 px-2 text-slate-500 hover:text-amber-600"
                          aria-label="Editar livro"
                          title="Editar livro"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteLivroId(livro.id_livro)}
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          className="h-8 px-2 text-slate-500 hover:text-rose-600"
                          aria-label="Excluir livro"
                          title="Excluir livro"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 sm:p-5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredLivros.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : isError ? (
          /* Estado de Erro na Tabela */
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              {isTimeoutError
                ? 'A resposta está demorando mais que o esperado. Tente novamente.'
                : 'API Orquestradora Indisponível'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
              {errorMessage}
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? 'Tentando reconectar...' : 'Tentar novamente'}
            </Button>
          </div>
        ) : (
          /* Empty State */
          <div className="p-8">
            <EmptyState
              title="Nenhum livro encontrado"
              description={
                searchTerm
                  ? 'Não foram encontrados livros com o termo pesquisado. Tente outro título, autor, ISBN ou editora.'
                  : 'Nenhum livro cadastrado no acervo da biblioteca.'
              }
              actionLabel={searchTerm ? 'Limpar Busca' : '+ Cadastrar Novo Livro'}
              onAction={
                searchTerm ? resetSearch : () => navigate('/livros/novo')
              }
            />
          </div>
        )}
      </Card>

      {/* Diálogo de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={deleteLivroId !== null}
        onClose={() => setDeleteLivroId(null)}
        onConfirm={async () => {
          if (deleteLivroId !== null) {
            try {
              await deleteMutation.mutateAsync(deleteLivroId);
              setDeleteLivroId(null);
            } catch {
              // Em caso de erro, a mutation onError exibe mensagem amigável e o registro é mantido
            }
          }
        }}
        title="Excluir Livro"
        description={`Tem certeza que deseja excluir o livro "${livroParaExcluir?.titulo || 'selecionado'}"? Esta ação não poderá ser desfeita.`}
        confirmLabel={deleteMutation.isPending ? 'Excluindo...' : 'Sim, Excluir'}
        cancelLabel="Cancelar"
        variant="danger"
      />
    </PageContainer>
  );
};

