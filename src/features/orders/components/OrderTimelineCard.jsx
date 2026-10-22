import { Calendar, Car, Receipt } from 'lucide-react';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { getOrderStatus } from '@/features/orders/lib/orderStatus';
import { formatDate, formatDateTime, formatPrice } from '@/lib/format';

export function OrderTimelineCard({ order }) {
  const { description } = getOrderStatus(order.status);
  const events = [
    ['Créée le', order.createdAt],
    ['Validée le', order.validatedAt],
    ['Terminée le', order.completedAt],
  ].filter(([, date]) => date);

  return (
    <article className="timeline-card">
      <div className="timeline-card__main">
        <div className="timeline-card__head">
          <span className="timeline-card__icon">
            <Car aria-hidden="true" />
          </span>
          <div>
            <h3 className="timeline-card__title">{order.vehicleName}</h3>
            <p className="timeline-card__ref">Commande #{order.reference}</p>
          </div>
        </div>
        <dl className="timeline-card__facts">
          <div>
            <dt>
              <Calendar aria-hidden="true" /> Période de location
            </dt>
            <dd>
              {formatDate(order.startDate)} - {formatDate(order.endDate)}
            </dd>
          </div>
          <div>
            <dt>
              <Receipt aria-hidden="true" /> Prix total
            </dt>
            <dd className="timeline-card__price">{formatPrice(order.totalPrice)}</dd>
          </div>
        </dl>
      </div>
      <div className="timeline-card__status">
        <OrderStatusBadge status={order.status} />
        <p className="timeline-card__description">{description}</p>
        <ul className="timeline-card__events">
          {events.map(([label, date]) => (
            <li key={label}>
              {label} {formatDateTime(date)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
