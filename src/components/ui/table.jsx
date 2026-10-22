import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const make = (name, Tag, base) => {
  const C = forwardRef(({ className, ...props }, ref) => (
    <Tag ref={ref} className={cn(base, className)} {...props} />
  ));
  C.displayName = name;
  return C;
};

const TableRoot = make('TableRoot', 'table', 'w-full caption-bottom text-sm');

export const Table = forwardRef((props, ref) => (
  <div className="relative w-full overflow-auto">
    <TableRoot ref={ref} {...props} />
  </div>
));
Table.displayName = 'Table';

export const TableHeader = make('TableHeader', 'thead', '[&_tr]:border-b');
export const TableBody = make('TableBody', 'tbody', '[&_tr:last-child]:border-0');
export const TableFooter = make('TableFooter', 'tfoot', 'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0');
export const TableRow = make('TableRow', 'tr', 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted');
export const TableHead = make('TableHead', 'th', 'h-12 px-4 text-left align-middle font-medium text-muted-foreground');
export const TableCell = make('TableCell', 'td', 'p-4 align-middle');
export const TableCaption = make('TableCaption', 'caption', 'mt-4 text-sm text-muted-foreground');
