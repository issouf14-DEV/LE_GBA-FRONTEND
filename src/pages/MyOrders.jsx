import { AlertCircle, Car, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHero } from '@/components/common/PageHero';
import { CardListSkeleton } from '@/components/common/skeletons/CardListSkeleton';
import { Button } from '@/components/ui/button';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { OrderDetailsDialog } from '@/features/orders/components/OrderDetailsDialog';
import { useMyOrders } from '@/features/orders/hooks/useMyOrders';

export default function MyOrders() {
  const { orders, loading, error, reload, cancel, resendEmail } = useMyOrders();
  const [selected, setSelected] = useState(null);
  const [toCancel, setToCancel] = useState(null);

  const renderContent = () => {
    if (loading) return <CardListSkeleton />;
    if (error) {
      return (
        <EmptyState
          icon={AlertCircle}
          tone="error"
          title="Erreur de chargement"
          description={error}
        >
          <Button className="btn-gradient btn-auto" onClick={reload}>
            <RefreshCw aria-hidden="true" /> Réessayer
          </Button>
        </EmptyState>
      );
    }
    if (orders.length === 0) {
      return (
        <EmptyState
          icon={Car}
          title="Aucune réservation"
          description="Vous n'avez pas encore réservé de véhicule."
        >
          <Button asChild className="btn-gradient btn-auto">
            <Link to="/vehicles">Découvrir nos véhicules</Link>
          </Button>
        </EmptyState>
      );
    }
    return (
      <div className="order-list">
        <h2 className="sr-only">Vos réservations</h2>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onDetails={setSelected}
            onCancel={setToCancel}
            onResend={resendEmail}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="page page--muted">
      <PageHero
        title="Mes réservations"
        subtitle="Suivez l'état de vos locations de véhicules"
        icon={Car}
      />
      <div className="page-container page-container--narrow page-container--padded">
        {renderContent()}
      </div>

      <OrderDetailsDialog order={selected} onClose={() => setSelected(null)} />
      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Annuler cette réservation ?"
        description="Cette action est définitive."
        confirmLabel="Oui, annuler"
        destructive
        onCancel={() => setToCancel(null)}
        onConfirm={() => {
          cancel(toCancel);
          setToCancel(null);
        }}
      />
    </div>
  );
}
