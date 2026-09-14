import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  FilterX,
  Eye,
  Edit2,
  Trash2,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Layers,
  RotateCcw,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { PageContainer } from '../../../components/ui/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { MetricCard } from '../../../components/ui/MetricCard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { BackendStatus } from '../components/BackendStatus';
import { useBooksQuery, useDeleteBookMutation } from '../hooks/useBooksQuery';
import { formatDate } from '../../../lib/utils';
import { Book } from '../../../types';

export const BooksListPage: React.FC = () => {
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // TanStack Query para carregar livros com retry: 1
  const {
    data: books = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useBooksQuery({
    search: searchTerm,
    category: selectedCategory,
    status: selectedStatus,
  });

  // TanStack Query Mutation para exclusão
  const deleteMutation = useDeleteBookMutation();
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  // Dynamic Options extraídas dos livros carregados
  const categories = useMemo(() => {
    const set = new Set(books.map(b => b.category));
    return Array.from(set).sort().map(c => ({ value: c, label: c }));
  }, [books]);

  const statusOptions = [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Reservado', label: 'Reservado' },
    { value: 'Emprestado', label: 'Emprestado' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Indisponível', label: 'Indisponível' },
  ];

  // Paginação
  const totalPages = Math.ceil(books.length / itemsPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return books.slice(start, start + itemsPerPage);
  }, [books, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' || selectedCategory !== '' || selectedStatus !== '';

  // Métricas calculadas
  const totalCopies = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const availableCopies = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  const borrowedCopies = Math.max(0, totalCopies - availableCopies);
  const reservedCount = books.filter(b => b.status === 'Reservado').length;

  const bookToDelete = books.find(b => b.id === deleteBookId);

  // Tratamento de mensagem de erro amigável / timeout
  const errorMessage = useMemo(() => {
    if (!error) return null;
    if ((error as any).isTimeout) {
      return 'A resposta está demorando mais que o esperado. Tente novamente.';
    }
    return (
      (error as any).message ||
      'Não foi possível carregar os livros. Verifique a conexão com a API Orquestradora.'
    );
  }, [error]);

  const isTimeoutError = (error as any)?.isTimeout;

  return (
    <PageContainer>
      {/* Header com identificador do backend ativo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <PageHeader
          title="Livros"
          description="Gerencie o acervo cadastrado no sistema."
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

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard
          label="Total no Acervo"
          value={isLoading ? '...' : totalCopies.toString()}
          contextText={`${books.length} títulos cadastrados`}
          icon={<BookOpen className="w-5 h-5" />}
          variant="blue"
        />

        <MetricCard
          label="Disponíveis"
          value={isLoading ? '...' : availableCopies.toString()}
          contextText="prontos para consulta"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="green"
        />

        <MetricCard
          label="Emprestados"
          value={isLoading ? '...' : borrowedCopies.toString()}
          contextText="em posse de leitores"
          icon={<Layers className="w-5 h-5" />}
          variant="orange"
        />

        <MetricCard
          label="Reservados"
          value={isLoading ? '...' : reservedCount.toString()}
          contextText="aguardando retirada"
          icon={<Bookmark className="w-5 h-5" />}
          variant="purple"
        />
      </div>

      {/* Barra de Busca e Filtros */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          <div className="lg:col-span-6">
            <Input
              label="Buscar"
              placeholder="Buscar por título, autor ou ISBN..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="lg:col-span-3">
            <Select
              label="Categoria"
              placeholder="Todas as categorias"
              options={categories}
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <Select
              label="Status"
              placeholder="Todos"
              options={statusOptions}
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="lg:col-span-1">
            <Button
              variant="outline"
              size="md"
              disabled={!hasActiveFilters}
              onClick={resetFilters}
              icon={<FilterX className="w-4 h-4" />}
              className="w-full"
              title="Limpar filtros"
            >
              <span className="lg:hidden">Limpar</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* ESTADO DE ERRO / TIMEOUT */}
      {isError && (
        <Card className="mb-6 border-rose-200 bg-rose-50/50 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                {isTimeoutError ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-900">
                  {isTimeoutError
                    ? 'Tempo limite de resposta excedido'
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

      {/* TABELA DE LIVROS / LOADING SKELETON / EMPTY STATE */}
      <Card padding="none" className="overflow-hidden">
        {isLoading ? (
          /* Loading State: Skeleton */
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
                <div className="h-6 bg-slate-100 rounded-full w-20 animate-pulse" />
              </div>
            ))}
            <div className="text-center py-2 text-xs text-slate-400 font-medium">
              Carregando acervo da API Orquestradora...
            </div>
          </div>
        ) : paginatedBooks.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow isHoverable={false}>
                  <TableHead>Livro</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Exemplares</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBooks.map(book => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-10 rounded-md flex items-center justify-center text-white text-2xs font-bold shrink-0 shadow-2xs"
                          style={{ backgroundColor: book.coverColor || '#D90052' }}
                        >
                          <BookOpen className="w-4 h-4 opacity-90" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/livros/${book.id}`}
                            className="font-bold text-slate-900 hover:text-[#D90052] transition-colors truncate block text-sm"
                          >
                            {book.title}
                          </Link>
                          <span className="text-2xs text-slate-400 block truncate">
                            {book.publisher} • {book.year}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs sm:text-sm font-medium text-slate-800">
                        {book.author}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-2xs sm:text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {book.isbn}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        {book.category}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {book.availableCopies}
                        </span>
                        <span className="text-xs text-slate-400">/ {book.totalCopies}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge status={book.status} size="sm" />
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-slate-500">
                        {formatDate(book.updatedAt)}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/livros/${book.id}`)}
                          icon={<Eye className="w-3.5 h-3.5" />}
                          className="h-8 px-2 text-slate-500 hover:text-[#D90052]"
                          aria-label="Visualizar livro"
                          title="Visualizar detalhes"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/livros/${book.id}/editar`)}
                          icon={<Edit2 className="w-3.5 h-3.5" />}
                          className="h-8 px-2 text-slate-500 hover:text-amber-600"
                          aria-label="Editar livro"
                          title="Editar livro"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteBookId(book.id)}
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
                totalItems={books.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="p-8">
            <EmptyState
              title="Nenhum livro encontrado"
              description={
                hasActiveFilters
                  ? 'Não foram encontrados livros com os filtros selecionados. Tente alterar os termos da busca.'
                  : 'Nenhum livro cadastrado no acervo da biblioteca.'
              }
              actionLabel={hasActiveFilters ? 'Limpar Filtros' : '+ Cadastrar Novo Livro'}
              onAction={
                hasActiveFilters ? resetFilters : () => navigate('/livros/novo')
              }
            />
          </div>
        )}
      </Card>

      {/* Diálogo de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={!!deleteBookId}
        onClose={() => setDeleteBookId(null)}
        onConfirm={async () => {
          if (deleteBookId) {
            await deleteMutation.mutateAsync(deleteBookId);
            setDeleteBookId(null);
          }
        }}
        title="Excluir Livro"
        description={`Tem certeza que deseja excluir o livro "${bookToDelete?.title}"? Esta ação não poderá ser desfeita.`}
        confirmLabel={deleteMutation.isPending ? 'Excluindo...' : 'Sim, Excluir'}
        cancelLabel="Cancelar"
        variant="danger"
      />
    </PageContainer>
  );
};
