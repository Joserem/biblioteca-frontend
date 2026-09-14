import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-500',
        className
      )}
    >
      <div>
        Mostrando <span className="font-semibold text-slate-900">{startItem}</span> a{' '}
        <span className="font-semibold text-slate-900">{endItem}</span> de{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span> registros
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={<ChevronLeft className="w-4 h-4" />}
          className="px-2"
          aria-label="Página anterior"
        />

        <div className="flex items-center gap-1">
          {getPages().map((page, i) =>
            typeof page === 'number' ? (
              <button
                key={i}
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  'w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer select-none',
                  currentPage === page
                    ? 'bg-[#D90052] text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                )}
              >
                {page}
              </button>
            ) : (
              <span key={i} className="px-1 text-slate-400">
                ...
              </span>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={<ChevronRight className="w-4 h-4" />}
          className="px-2"
          aria-label="Próxima página"
        />
      </div>
    </div>
  );
};
