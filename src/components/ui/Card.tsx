import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', hoverEffect = false, children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-5 sm:p-6',
      lg: 'p-6 sm:p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl border border-[#E2E8F0] shadow-sm transition-all duration-200',
          hoverEffect && 'hover:shadow-md hover:border-slate-300',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
  }
>(({ className, title, subtitle, action, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-start justify-between gap-4 mb-5 pb-1', className)}
      {...props}
    >
      <div>
        {title && <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';
