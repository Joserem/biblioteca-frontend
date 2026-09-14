import React from 'react';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', ariaLabel, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D90052] focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed select-none shrink-0';

    const variants = {
      primary: 'bg-[#D90052] hover:bg-[#1D4ED8] text-white shadow-2xs',
      secondary: 'bg-[#0B1930] hover:bg-[#132545] text-white shadow-2xs',
      outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-2xs',
      danger: 'hover:bg-red-50 text-slate-500 hover:text-red-600',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    };

    const sizes = {
      sm: 'w-8 h-8 rounded-lg text-sm',
      md: 'w-10 h-10 rounded-xl text-base',
      lg: 'w-12 h-12 rounded-xl text-lg',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
