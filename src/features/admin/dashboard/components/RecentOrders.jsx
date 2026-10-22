import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { formatDate, formatPrice } from '@/lib/format';

export function RecentOrders({ orders }) {
  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <h2 className="chart-card__title">Commandes récentes</h2>
        <Link to="/admin/orders" className="link-primary admin-card__link">
          Tout voir <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      {orders.length === 0 ? (
        <p className="chart-card__empty">Aucune commande pour le moment</p>
      ) : (
        <Table className="admin-table">
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="admin-table__strong">{order.userName || 'Client'}</TableCell>
                <TableCell>{order.vehicleName}</TableCell>
                <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatDate(order.createdAt, 'short')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
