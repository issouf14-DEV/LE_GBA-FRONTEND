import { normalizeOrder } from '@/features/orders/lib/normalizeOrder';
import { ORDER_STATUSES } from '@/features/orders/lib/orderStatus';

const MONTHS = 6;

// Six derniers mois (année comprise, pour ne pas mélanger mars 2024 et mars 2025)
function monthlySeries(orders) {
  const now = new Date();
  return Array.from({ length: MONTHS }, (_, index) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - index), 1);
    const inMonth = orders.filter((order) => {
      const date = new Date(order.createdAt);
      return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
    });
    return {
      name: month.toLocaleDateString('fr-FR', { month: 'short' }),
      revenus: inMonth.reduce((sum, order) => sum + order.totalPrice, 0),
      commandes: inMonth.length,
    };
  });
}

function statusSeries(orders) {
  return Object.entries(ORDER_STATUSES)
    .map(([key, { label }]) => ({
      name: label,
      value: orders.filter((o) => o.status === key).length,
    }))
    .filter((item) => item.value > 0);
}

export function computeStats({ orders: rawOrders, users, vehicles }) {
  const orders = rawOrders.map(normalizeOrder);
  // Seules les commandes validées ou terminées comptent dans le chiffre d'affaires
  const revenueOrders = orders.filter((o) => o.status === 'validee' || o.status === 'terminee');

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'en_attente').length,
    totalRevenue: revenueOrders.reduce((sum, o) => sum + o.totalPrice, 0),
    totalUsers: users.length,
    totalVehicles: vehicles.length,
    monthly: monthlySeries(revenueOrders),
    monthlyOrders: monthlySeries(orders),
    byStatus: statusSeries(orders),
    recentOrders: [...orders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5),
  };
}
