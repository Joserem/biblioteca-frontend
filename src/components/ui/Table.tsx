import React from 'react';
import { cn } from '../../lib/utils';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  compact?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, compact = false, children, ...props }, ref) => {
    return (
      <div className="w-full overflow-x-auto">
        <table
          ref={ref}
          className={cn('w-full text-left border-collapse', className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn('bg-slate-50 sticky top-0 border-b border-[#E2E8F0]', className)}
      {...props}
    >
      {children}
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn('divide-y divide-[#E2E8F0] text-sm bg-white', className)}
      {...props}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { isHoverable?: boolean }
>(({ className, isHoverable = true, children, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn(
        'transition-colors',
        isHoverable && 'hover:bg-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn(
        'px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
});

TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn('px-6 py-4 text-slate-700 font-normal align-middle', className)}
      {...props}
    >
      {children}
    </td>
  );
});

TableCell.displayName = 'TableCell';
