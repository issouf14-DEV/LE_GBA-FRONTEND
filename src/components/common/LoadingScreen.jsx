import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

// Chargement d'une page entière (navigation) : pour une liste, préférer un skeleton
export function LoadingScreen({ fullScreen = false, label = 'Chargement en cours...' }) {
  return (
    <div className={cn('loading', fullScreen && 'loading--fullscreen')}>
      <Spinner className="loading__spinner" />
      <p className="loading__label">{label}</p>
    </div>
  );
}
