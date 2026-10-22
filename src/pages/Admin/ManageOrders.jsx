import { AlertCircle, Archive, CheckCircle2, Clock, Package, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { StatCard } from '@/components/common/StatCard';
import { CardListSkeleton } from '@/components/common/skeletons/CardListSkeleton';
import { Button } from '@/components/ui/button';
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { AdminOrderActions } from '@/features/admin/orders/components/AdminOrderActions';
import { AdminOrderCard } from '@/features/admin/orders/components/AdminOrderCard';
import { OrdersToolbar } from '@/features/admin/orders/components/OrdersToolbar';
import { useAdminOrders } from '@/features/admin/orders/hooks/useAdminOrders';
import { ACTIONS } from '@/features/admin/orders/lib/adminOrders';
import { OrderDetailsDialog } from '@/features/orders/components/OrderDetailsDialog';

export default function ManageOrders() {
  const admin = useAdminOrders();
  const [selected, setSelected] = useState(null);
  const [pending, setPending] = useState(null);
  const action = pending ? ACTIONS[pending.type] : null;

  const handlers = {
    onAction: (order, type) => setPending({ order, type }),
    onReminder: admin.sendReminder,
    onSummary: admin.sendSummary,
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Gestion des réservations"
        subtitle="Validez, rejetez et suivez les commandes"
      >
        <Button variant="outline" onClick={admin.reload}>
          <RefreshCw aria-hidden="true" /> Actualiser
        </Button>
      </AdminPageHeader>

      <div className="stat-grid">
        <StatCard title="Total" value={admin.counts.total} icon={Package} />
        <StatCard title="En attente" value={admin.counts.en_attente} icon={Clock} />
        <StatCard title="Validées" value={admin.counts.validee} icon={CheckCircle2} />
        <StatCard title="Rejetées / annulées" value={admin.counts.archived} icon={Archive} />
      </div>

      <div className="admin-card">
        <OrdersToolbar filters={admin.filters} onChange={admin.setFilter} />
        {admin.loading ? (
          <CardListSkeleton />
        ) : admin.error ? (
          <EmptyState icon={AlertCircle} tone="error" title="Erreur" description={admin.error} />
        ) : admin.orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Aucune réservation"
            description="Aucune réservation ne correspond à ces critères."
          />
        ) : (
          <div className="order-list">
            {admin.orders.map((order) => (
              <AdminOrderCard key={order.id} order={order} onDetails={setSelected} {...handlers} />
            ))}
          </div>
        )}
      </div>

      <OrderDetailsDialog order={selected} onClose={() => setSelected(null)}>
        {selected && <AdminOrderActions order={selected} {...handlers} />}
      </OrderDetailsDialog>
      <ConfirmDialog
        open={Boolean(pending)}
        title={action?.title}
        description={
          pending ? `${pending.order.vehicleName} • ${pending.order.userName || 'Client'}` : ''
        }
        confirmLabel={action?.label}
        destructive={action?.destructive}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          admin.updateStatus(pending.order, action.status, action.done);
          setPending(null);
          setSelected(null);
        }}
      />
    </div>
  );
}
