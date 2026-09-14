import React from 'react';
import { cn } from '../../lib/utils';
import { BookStatus } from '../../types';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  status?: BookStatus | string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  status,
  size = 'md',
  dot = true,
  children,
  ...props
}) => {
  let computedVariant: BadgeVariant = variant || 'default';

  if (status) {
    switch (status) {
      case 'Disponível':
      case 'Python':
        computedVariant = 'success';
        break;
      case 'Reservado':
      case 'JavaScript':
        computedVariant = 'warning';
        break;
      case 'Indisponível':
        computedVariant = 'danger';
        break;
      case 'Emprestado':
        computedVariant = 'info';
        break;
      case 'Manutenção':
        computedVariant = 'neutral';
        break;
      default:
        computedVariant = 'neutral';
    }
  }

  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-rose-50 text-[#D90052] border-rose-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const dots = {
    default: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-rose-500',
    purple: 'bg-purple-500',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-2xs px-2 py-0.5 gap-1 font-semibold rounded-full',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border shrink-0 select-none whitespace-nowrap',
        variants[computedVariant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[computedVariant])} />
      )}
      <span>{children || status}</span>
    </span>
  );
};
