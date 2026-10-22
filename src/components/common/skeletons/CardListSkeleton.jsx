import { skeletonKeys } from '@/components/common/skeletons/skeletonKeys';
import { Skeleton } from '@/components/ui/skeleton';

// Liste de cartes (commandes…) en cours de chargement
export function CardListSkeleton({ count = 3 }) {
  return (
    <div className="order-list" role="status" aria-busy="true" aria-label="Chargement de la liste">
      {skeletonKeys(count, 'card').map((key) => (
        <div key={key} className="card-skeleton">
          <div className="card-skeleton__header">
            <Skeleton className="skeleton-line skeleton-line--title" />
            <Skeleton className="skeleton-pill" />
          </div>
          <div className="card-skeleton__body">
            <Skeleton className="skeleton-media" />
            <div className="card-skeleton__lines">
              <Skeleton className="skeleton-line skeleton-line--title" />
              <Skeleton className="skeleton-line" />
              <Skeleton className="skeleton-line skeleton-line--short" />
            </div>
            <Skeleton className="skeleton-block" />
          </div>
        </div>
      ))}
    </div>
  );
}
