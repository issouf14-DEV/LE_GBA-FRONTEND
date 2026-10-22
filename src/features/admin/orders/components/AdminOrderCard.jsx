import { Calendar, Mail, Phone, User } from 'lucide-react';
import { AdminOrderActions } from '@/features/admin/orders/components/AdminOrderActions';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { formatDate, formatPrice } from '@/lib/format';

export function AdminOrderCard({ order, ...actions }) {
  return (
    <article className="admin-order">
      <header className="admin-order__header">
        <div>
          <p className="admin-order__vehicle">{order.vehicleName}</p>
          <p className="admin-order__ref">
            #{order.reference} • {formatDate(order.createdAt, 'medium')}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="admin-order__grid">
        <div className="admin-order__block">
          <p className="admin-order__label">Client</p>
          <p className="admin-order__line admin-table__strong">
            <User aria-hidden="true" /> {order.userName || 'Client'}
          </p>
          {order.userPhone && (
            <p className="admin-order__line">
              <Phone aria-hidden="true" /> {order.userPhone}
            </p>
          )}
          {order.userEmail && (
            <p className="admin-order__line">
              <Mail aria-hidden="true" /> {order.userEmail}
            </p>
          )}
        </div>
        <div className="admin-order__block">
          <p className="admin-order__label">Période</p>
          <p className="admin-order__line">
            <Calendar aria-hidden="true" /> {formatDate(order.startDate, 'medium')} -{' '}
            {formatDate(order.endDate, 'medium')}
          </p>
          <p className="admin-order__line">
            {order.duration} jour{order.duration > 1 ? 's' : ''}
          </p>
        </div>
        <div className="admin-order__block admin-order__price">
          <p className="admin-order__label">Total</p>
          <p className="admin-order__total">{formatPrice(order.totalPrice)}</p>
          <p className="admin-order__line">{formatPrice(order.pricePerDay)} / jour</p>
        </div>
      </div>

      <AdminOrderActions order={order} {...actions} />
    </article>
  );
}
