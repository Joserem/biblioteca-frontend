import React from 'react';
import { useHealthQuery } from '../../health/hooks/useHealthQuery';
import { cn } from '../../../lib/utils';
import { Server } from 'lucide-react';

interface BackendStatusProps {
  className?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

/**
 * Converte o nome do líder retornado pela API Orquestradora Java para o rótulo de exibição.
 * Os únicos backends de negócio da arquitetura são Python e JavaScript.
 * Java é exclusivamente a Orquestradora, portanto nunca é apresentado como backend de CRUD.
 */
function formatLeaderLabel(leader?: string | null): string {
  if (!leader) return 'Backend indisponível';
  const lower = leader.toLowerCase();
  if (lower.includes('python')) {
    return 'Ativo: Python';
  }
  if (lower.includes('javascript') || lower.includes('node') || lower.includes('js')) {
    return 'Ativo: JavaScript';
  }
  return 'Backend ativo';
}

export const BackendStatus: React.FC<BackendStatusProps> = ({
  className,
  size = 'md',
  showIcon = true,
}) => {
  const { data, isLoading, isError } = useHealthQuery();

  let dotColor = 'bg-slate-400';
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let labelText = 'Verificando backend...';

  if (isLoading && !data) {
    // Consulta inicial em andamento
    dotColor = 'bg-slate-400';
    badgeClasses = 'bg-slate-100 text-slate-600 border-slate-200';
    labelText = 'Verificando backend...';
  } else if (isError) {
    // API Orquestradora Java está desligada (localhost:8080 inacessível)
    dotColor = 'bg-rose-500';
    badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs';
    labelText = 'Orquestradora indisponível';
  } else if (data?.erro || !data?.leader) {
    // Orquestradora respondeu, porém nenhum backend está disponível no momento
    dotColor = 'bg-amber-500';
    badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs';
    labelText = 'Backend indisponível';
  } else {
    // Orquestradora respondeu com líder ativo válido
    const leader = data.leader;
    labelText = formatLeaderLabel(leader);

    const lower = leader.toLowerCase();
    if (lower.includes('python')) {
      dotColor = 'bg-emerald-500';
      badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs';
    } else if (lower.includes('javascript') || lower.includes('node') || lower.includes('js')) {
      dotColor = 'bg-amber-500';
      badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs';
    } else {
      dotColor = 'bg-blue-500';
      badgeClasses = 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs';
    }
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2.5 py-1 gap-1.5 font-semibold'
      : 'text-xs px-3 py-1.5 gap-2 font-bold';

  return (
    <div
      title="Status da API Orquestradora Java e do Backend Líder (/backends)"
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200 select-none cursor-default',
        badgeClasses,
        sizeClasses,
        className
      )}
    >
      {/* Indicador pulsante */}
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

