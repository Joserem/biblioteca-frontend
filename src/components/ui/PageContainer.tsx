import React from 'react';
import { cn } from '../../lib/utils';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'full' | '1440' | '1200' | '900';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  className,
  maxWidth = '1440',
  children,
  ...props
}) => {
  const maxWidths = {
    full: 'w-full',
    '1440': 'max-w-[1440px]',
    '1200': 'max-w-[1200px]',
    '900': 'max-w-[900px]',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8',
        maxWidths[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
