import React from 'react';
import { cn } from '../../lib/utils';
import { Sparkline } from './Sparkline';

export interface MetricCardProps {
  label: string;
  value: string | number;
  contextText?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  progressPercentage?: number;
  icon: React.ReactNode;
  variant?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'slate';
  sparklineData?: number[];
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  contextText,
  trend,
  progressPercentage,
  icon,
  variant = 'blue',
  sparklineData,
  className,
}) => {
  const variantStyles = {
    blue: {
      iconBg: 'bg-[#FFF0F5] text-[#D90052]',
      trendColor: 'text-[#D90052]',
      sparklineColor: '#D90052',
      progressBar: 'bg-[#E9005B]',
      progressTrack: 'bg-[#FFF0F5]',
    },
    green: {
      iconBg: 'bg-emerald-50 text-[#16A34A]',
      trendColor: 'text-emerald-600',
      sparklineColor: '#16A34A',
      progressBar: 'bg-emerald-500',
      progressTrack: 'bg-emerald-100/60',
    },
    orange: {
      iconBg: 'bg-amber-50 text-[#D97706]',
      trendColor: 'text-amber-600',
      sparklineColor: '#D97706',
      progressBar: 'bg-amber-500',
      progressTrack: 'bg-amber-100/60',
    },
    red: {
      iconBg: 'bg-rose-50 text-[#DC2626]',
      trendColor: 'text-rose-600',
      sparklineColor: '#DC2626',
      progressBar: 'bg-rose-500',
      progressTrack: 'bg-rose-100/60',
    },
    purple: {
      iconBg: 'bg-purple-50 text-[#9333EA]',
      trendColor: 'text-purple-600',
      sparklineColor: '#9333EA',
      progressBar: 'bg-purple-500',
      progressTrack: 'bg-purple-100/60',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700',
      trendColor: 'text-slate-600',
      sparklineColor: '#64748B',
      progressBar: 'bg-slate-500',
      progressTrack: 'bg-slate-200',
    },
  };

  const currentTheme = variantStyles[variant];

  return (
    <div
      className={cn(
        'bg-white rounded-[18px] border border-[#E4EAF2] shadow-[0_2px_8px_rgba(15,23,42,0.04)] p-5 flex flex-col justify-between min-h-[145px] max-h-[175px] sm:min-h-0 sm:max-h-none transition-all duration-150 hover:shadow-xs',
        className
      )}
    >
      {/* Top Section: Icon left, Label + Value right */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl shrink-0 border border-slate-100 flex items-center justify-center',
            currentTheme.iconBg
          )}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-slate-500 text-xs sm:text-sm font-semibold truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
            {value}
          </p>

          {contextText && (
            <p className="text-xs text-[#D90052] font-semibold mt-0.5">{contextText}</p>
          )}
        </div>

        {trend && (
          <span
            className={cn(
              'text-xs font-bold px-2 py-0.5 rounded-full shrink-0',
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-rose-50 text-rose-700 border border-rose-100'
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {/* Bottom Progress Bar */}
      {typeof progressPercentage === 'number' && (
        <div className={cn('mt-4 h-1.5 w-full rounded-full overflow-hidden', currentTheme.progressTrack)}>
          <div
            className={cn('h-full rounded-full transition-all duration-500', currentTheme.progressBar)}
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
          />
        </div>
      )}

      {sparklineData && typeof progressPercentage !== 'number' && (
        <div className="mt-3">
          <Sparkline
            data={sparklineData}
            color={currentTheme.sparklineColor}
            width={160}
            height={26}
          />
        </div>
      )}
    </div>
  );
};
