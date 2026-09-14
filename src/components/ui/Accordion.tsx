import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AccordionItemProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  defaultOpen = false,
  icon,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        'border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-200',
        isOpen ? 'shadow-xs border-slate-300' : 'hover:border-slate-300',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-xl bg-rose-50 text-[#D90052] border border-rose-100/80 shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">{title}</h4>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 bg-slate-100 transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180 bg-rose-50 text-[#D90052]'
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-white animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
