import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D90052]/30 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98] select-none cursor-pointer';

    const variants = {
      primary:
        'bg-[#D90052] hover:bg-[#BC0048] text-white shadow-sm border border-transparent',
      secondary:
        'bg-white hover:bg-[#FFF0F5] text-[#D90052] border border-[#D90052] shadow-2xs',
      outline:
        'bg-white hover:bg-[#FFF0F5] text-[#D90052] border border-[#D90052] hover:border-[#BC0048] shadow-2xs',
      danger:
        'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300',
      success:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-transparent',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-transparent',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
      md: 'text-sm px-4 py-2 rounded-xl gap-2 h-10',
      lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 h-12',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
