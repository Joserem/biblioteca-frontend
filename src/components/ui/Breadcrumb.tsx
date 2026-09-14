import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';
import { BreadcrumbItem } from '../../types';
import { cn } from '../../lib/utils';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500', className)}
    >
      <Link
        to="/livros"
        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors text-slate-700"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#D90052]" />
        <span className="hidden sm:inline font-semibold">Biblioteca</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="hover:text-slate-900 transition-colors truncate max-w-[140px] sm:max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'truncate max-w-[150px] sm:max-w-[240px]',
                  isLast ? 'text-slate-900 font-semibold' : 'text-slate-500'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
