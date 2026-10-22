import { skeletonKeys } from '@/components/common/skeletons/skeletonKeys';
import { Skeleton } from '@/components/ui/skeleton';

// Même gabarit que VehicleCard pendant le chargement du catalogue
export function VehicleGridSkeleton({ count = 8 }) {
  return (
    <div
      className="vehicle-grid"
      role="status"
      aria-busy="true"
      aria-label="Chargement des véhicules"
    >
      {skeletonKeys(count, 'vehicle').map((key) => (
        <div key={key} className="vehicle-card">
          <Skeleton className="vehicle-card__media skeleton-flat" />
          <div className="vehicle-card__body">
            <Skeleton className="skeleton-line skeleton-line--short" />
            <Skeleton className="skeleton-line skeleton-line--title" />
            <Skeleton className="skeleton-line" />
            <Skeleton className="skeleton-line" />
            <Skeleton className="skeleton-line skeleton-line--price" />
            <Skeleton className="skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}
