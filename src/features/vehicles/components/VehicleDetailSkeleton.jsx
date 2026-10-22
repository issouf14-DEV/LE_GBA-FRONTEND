import { skeletonKeys } from '@/components/common/skeletons/skeletonKeys';
import { Skeleton } from '@/components/ui/skeleton';

export function VehicleDetailSkeleton() {
  return (
    <div
      className="vehicle-detail"
      role="status"
      aria-busy="true"
      aria-label="Chargement du véhicule"
    >
      <Skeleton className="vehicle-gallery__main skeleton-flat" />
      <div className="vehicle-info">
        <Skeleton className="skeleton-line skeleton-line--short" />
        <Skeleton className="skeleton-line skeleton-line--hero" />
        <Skeleton className="skeleton-line" />
        <Skeleton className="skeleton-line" />
        <div className="spec-grid">
          {skeletonKeys(4, 'spec').map((key) => (
            <Skeleton key={key} className="skeleton-tile" />
          ))}
        </div>
        <Skeleton className="skeleton-block skeleton-block--tall" />
      </div>
    </div>
  );
}
