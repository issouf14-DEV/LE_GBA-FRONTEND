import { skeletonKeys } from '@/components/common/skeletons/skeletonKeys';
import { Skeleton } from '@/components/ui/skeleton';

// Tableau en cours de chargement : une ligne = un avatar/vignette + des cellules
export function TableSkeleton({ rows = 5, columns = 5 }) {
  const cells = skeletonKeys(columns - 1, 'cell');

  return (
    <div
      className="table-skeleton"
      role="status"
      aria-busy="true"
      aria-label="Chargement du tableau"
    >
      {skeletonKeys(rows, 'row').map((row) => (
        <div key={row} className="table-skeleton__row">
          <Skeleton className="skeleton-thumb" />
          {cells.map((cell) => (
            <Skeleton key={cell} className="skeleton-line" />
          ))}
        </div>
      ))}
    </div>
  );
}
