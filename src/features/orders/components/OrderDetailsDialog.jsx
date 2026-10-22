import { Calendar, Car, Receipt, UserRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { formatDate, formatPrice } from '@/lib/format';

function Section({ icon: Icon, title, rows }) {
  return (
    <section className="details-section">
      <h4 className="details-section__title">
        <Icon aria-hidden="true" /> {title}
      </h4>
      <dl className="details-section__rows">
        {rows
          .filter(([, value]) => value !== undefined && value !== '')
          .map(([label, value]) => (
            <div key={label} className="details-row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}

// Fenêtre de détail d'une commande (client et admin)
export function OrderDetailsDialog({ order, onClose, children }) {
  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="details-dialog">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>Réservation #{order.reference}</DialogTitle>
              <DialogDescription>Créée le {formatDate(order.createdAt)}</DialogDescription>
              <OrderStatusBadge status={order.status} />
            </DialogHeader>
            <Section icon={Car} title="Véhicule" rows={[['Modèle', order.vehicleName]]} />
            <Section
              icon={Calendar}
              title="Période de location"
              rows={[
                ['Du', formatDate(order.startDate)],
                ['Au', formatDate(order.endDate)],
                ['Durée', `${order.duration} jour${order.duration > 1 ? 's' : ''}`],
              ]}
            />
            <Section
              icon={UserRound}
              title="Contact"
              rows={[
                ['Nom', order.userName],
                ['Email', order.userEmail],
                ['Téléphone', order.userPhone],
                ['Adresse', order.address],
                ['Notes', order.notes],
              ]}
            />
            <Section
              icon={Receipt}
              title="Prix"
              rows={[
                ['Prix par jour', formatPrice(order.pricePerDay)],
                ['Total', formatPrice(order.totalPrice)],
              ]}
            />
            {children}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
