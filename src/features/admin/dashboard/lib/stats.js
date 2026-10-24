import { normalizeOrder } from '@/features/orders/lib/normalizeOrder';
import { ORDER_STATUSES } from '@/features/orders/lib/orderStatus';

// Compteur renvoyé par le serveur : tout ce qui n'est pas un nombre positif vaut 0
const count = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

// Mois court en français (« janv. »), calculé en UTC pour ne pas dépendre du fuseau
export const monthName = (year, month) =>
  new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('fr-FR', {
    month: 'short',
    timeZone: 'UTC',
  });

// Six derniers mois, déjà agrégés par le serveur (du plus ancien au plus récent)
function monthlySeries(monthly) {
  return (Array.isArray(monthly) ? monthly : []).map((entry) => ({
    name: monthName(Number(entry?.year), Number(entry?.month)),
    revenus: count(entry?.revenus),
    commandes: count(entry?.commandes),
  }));
}

// Seuls les statuts connus sont affichés (lecture par Object.hasOwn, sans prototype)
function statusSeries(byStatus) {
  const source = byStatus && typeof byStatus === 'object' ? byStatus : {};
  return Object.entries(ORDER_STATUSES)
    .map(([key, { label }]) => ({
      name: label,
      value: Object.hasOwn(source, key) ? count(source[key]) : 0,
    }))
    .filter((item) => item.value > 0);
}

// Réponse de GET /api/admin/stats -> forme attendue par le tableau de bord
export function toDashboardStats(data = {}) {
  const months = monthlySeries(data?.monthly);
  return {
    totalOrders: count(data?.totalOrders),
    pendingOrders: count(data?.pendingOrders),
    totalRevenue: count(data?.totalRevenue),
    totalUsers: count(data?.totalUsers),
    totalVehicles: count(data?.totalVehicles),
    monthly: months.map(({ name, revenus }) => ({ name, revenus })),
    monthlyOrders: months.map(({ name, commandes }) => ({ name, commandes })),
    byStatus: statusSeries(data?.byStatus),
    recentOrders: (Array.isArray(data?.recentOrders) ? data.recentOrders : []).map(normalizeOrder),
  };
}
