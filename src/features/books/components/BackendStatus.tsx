import React from 'react';
import { useBackendStatus } from '../../../lib/api/backend-status';
import { cn } from '../../../lib/utils';
import { Server } from 'lucide-react';

interface BackendStatusProps {
  className?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const BackendStatus: React.FC<BackendStatusProps> = ({
  className,
  size = 'md',
  showIcon = true,
}) => {
  const { activeBackend } = useBackendStatus();

  // Mapeamento dinâmico conforme o backend retornado pela API Orquestradora
  const isPython = activeBackend?.toLowerCase() === 'python';
  const isJavaScript =
    activeBackend?.toLowerCase() === 'javascript' ||
    activeBackend?.toLowerCase() === 'js' ||
    activeBackend?.toLowerCase() === 'node';

  let dotColor = 'bg-slate-400';
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let labelText = 'Orquestradora Conectada';

  if (isPython) {
    dotColor = 'bg-emerald-500';
    badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs';
    labelText = 'Ativo: Python';
  } else if (isJavaScript) {
    dotColor = 'bg-amber-500';
    badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs';
    labelText = 'Ativo: JavaScript';
  } else if (activeBackend) {
    dotColor = 'bg-[#E9005B]';
    badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs';
    labelText = `Ativo: ${activeBackend}`;
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2.5 py-1 gap-1.5 font-semibold'
      : 'text-xs px-3 py-1.5 gap-2 font-bold';

  return (
    <div
      title="Backend responsável pelo processamento na API Orquestradora Java"
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200 select-none cursor-default',
        badgeClasses,
        sizeClasses,
        className
      )}
    >
      {/* Ping indicator pulsante */}
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            dotColor
          )}
        />
        <span className={cn('relative inline-flex rounded-full h-2 w-2', dotColor)} />
      </span>

      {showIcon && <Server className="w-3.5 h-3.5 opacity-70" />}

      <span className="tracking-wide">{labelText}</span>
    </div>
  );
};
