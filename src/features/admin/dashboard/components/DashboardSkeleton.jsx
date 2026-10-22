import { skeletonKeys } from '@/components/common/skeletons/skeletonKeys';
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div
      className="admin-page__body"
      role="status"
      aria-busy="true"
      aria-label="Chargement du tableau de bord"
    >
      <div className="stat-grid">
        {skeletonKeys(5, 'stat').map((key) => (
          <div key={key} className="stat-card">
            <Skeleton className="skeleton-line skeleton-line--short" />
            <Skeleton className="skeleton-line skeleton-line--hero" />
          </div>
        ))}
      </div>
      <div className="chart-grid">
        {skeletonKeys(2, 'chart').map((key) => (
          <div key={key} className="chart-card">
            <Skeleton className="skeleton-line skeleton-line--title" />
            <Skeleton className="chart-card__plot skeleton-chart" />
          </div>
        ))}
      </div>
      <div className="admin-card">
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  );
}
