import { Calendar, Clock, Eye, Mail, XCircle } from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { formatDate, formatPrice } from '@/lib/format';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=80&auto=format';

export function OrderCard({ order, onDetails, onCancel, onResend }) {
  const canCancel = order.status === 'en_attente';
  const canResend = order.status === 'validee' || order.status === 'rejetee';

  return (
    <article className="order-card">
      <header className="order-card__header">
        <div>
          <p className="order-card__ref">Réservation #{order.reference}</p>
          <p className="order-card__date">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="order-card__body">
        <div className="order-card__vehicle">
          <SafeImage
            src={order.vehicleImage || FALLBACK_IMAGE}
            alt={order.vehicleName}
            className="order-card__image"
          />
          <div>
            <h3 className="order-card__title">{order.vehicleName}</h3>
            <dl className="order-card__dates">
              <div>
                <dt>
                  <Calendar aria-hidden="true" /> Début
                </dt>
                <dd>{formatDate(order.startDate)}</dd>
              </div>
              <div>
                <dt>
                  <Calendar aria-hidden="true" /> Fin
                </dt>
                <dd>{formatDate(order.endDate)}</dd>
              </div>
            </dl>
            <p className="order-card__duration">
              <Clock aria-hidden="true" /> {order.duration} jour{order.duration > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="order-card__price">
          <p className="order-card__price-label">Prix total</p>
          <p className="order-card__price-value">{formatPrice(order.totalPrice)}</p>
          <p className="order-card__price-hint">{formatPrice(order.pricePerDay)} / jour</p>
        </div>
      </div>

      <footer className="order-card__actions">
        <Button variant="secondary" onClick={() => onDetails(order)}>
          <Eye aria-hidden="true" /> Détails
        </Button>
        {canCancel && (
          <Button variant="outline" className="text-danger" onClick={() => onCancel(order)}>
            <XCircle aria-hidden="true" /> Annuler
          </Button>
        )}
        {canResend && (
          <Button variant="outline" onClick={() => onResend(order)}>
            <Mail aria-hidden="true" /> Renvoyer l'email
          </Button>
        )}
      </footer>
    </article>
  );
}
