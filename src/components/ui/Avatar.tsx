import React from 'react';
import { cn, getInitials } from '../../lib/utils';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizes = {
    sm: 'w-7 h-7 text-xs font-semibold',
    md: 'w-9 h-9 text-xs font-bold',
    lg: 'w-11 h-11 text-sm font-bold',
    xl: 'w-14 h-14 text-base font-bold',
  };

  // Generate a consistent soft background color based on name hash
  const getSoftBg = (str: string) => {
    const colors = [
      'bg-rose-100 text-[#BC0048] border-rose-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-rose-100 text-rose-800 border-rose-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(name);
  const colorClass = getSoftBg(name);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
        className={cn(
          'rounded-full object-cover border border-slate-200 shrink-0',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center border select-none shrink-0 tracking-wider',
        colorClass,
        sizes[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
};
