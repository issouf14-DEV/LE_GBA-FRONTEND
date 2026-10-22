import { AlertCircle, ClipboardList, FileDown, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHero } from '@/components/common/PageHero';
import { CardListSkeleton } from '@/components/common/skeletons/CardListSkeleton';
import { useToast } from '@/components/common/toast/useToast';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { OrderTimelineCard } from '@/features/orders/components/OrderTimelineCard';
import { useMyOrders } from '@/features/orders/hooks/useMyOrders';
import { exportOrdersPdf } from '@/features/orders/lib/exportOrdersPdf';

export default function OrderHistory() {
  const { user } = useAuth();
  const toast = useToast();
  const { orders, loading, error, reload } = useMyOrders();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportOrdersPdf(orders, user);
      toast.success('PDF téléchargé');
    } catch {
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page page--muted">
      <PageHero
        title="Historique des commandes"
        subtitle="Suivez l'état de vos réservations"
        icon={ClipboardList}
      >
        <div className="page-hero__actions">
          <Button variant="secondary" onClick={reload} disabled={loading}>
            {loading ? <Spinner /> : <RefreshCw aria-hidden="true" />}
            Actualiser
          </Button>
          {orders.length > 0 && (
            <Button className="btn-gradient btn-auto" onClick={handleExport} disabled={exporting}>
              {exporting ? <Spinner /> : <FileDown aria-hidden="true" />}
              {exporting ? 'Génération du PDF...' : 'Exporter en PDF'}
            </Button>
          )}
        </div>
      </PageHero>

      <div className="page-container page-container--narrow page-container--padded">
        {loading ? (
          <CardListSkeleton />
        ) : error ? (
          <EmptyState
            icon={AlertCircle}
            tone="error"
            title="Erreur de chargement"
            description={error}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Aucune commande trouvée"
            description="Vous n'avez pas encore effectué de réservation."
          >
            <Button asChild className="btn-gradient btn-auto">
              <Link to="/vehicles">Voir les véhicules</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="order-list">
            <h2 className="sr-only">Historique des réservations</h2>
            {orders.map((order) => (
              <OrderTimelineCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
