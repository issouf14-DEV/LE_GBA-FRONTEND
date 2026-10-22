import { normalizeText } from '@/lib/text';

const ARCHIVED = ['rejetee', 'annulee'];

export const STATUS_FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: 'en_attente', label: 'En attente' },
  { id: 'validee', label: 'Validées' },
  { id: 'terminee', label: 'Terminées' },
];

export const ACTIONS = {
  validate: {
    status: 'validee',
    title: 'Valider cette réservation ?',
    label: 'Valider',
    done: 'Réservation validée',
  },
  reject: {
    status: 'rejetee',
    title: 'Rejeter cette réservation ?',
    label: 'Rejeter',
    done: 'Réservation rejetée',
    destructive: true,
  },
};

export function countByStatus(orders) {
  return {
    total: orders.length,
    en_attente: orders.filter((o) => o.status === 'en_attente').length,
    validee: orders.filter((o) => o.status === 'validee' || o.status === 'terminee').length,
    archived: orders.filter((o) => ARCHIVED.includes(o.status)).length,
  };
}

export function filterOrders(orders, { view, status, search }) {
  const query = normalizeText(search);
  return orders
    .filter((o) =>
      view === 'history' ? ARCHIVED.includes(o.status) : !ARCHIVED.includes(o.status)
    )
    .filter((o) => view === 'history' || status === 'all' || o.status === status)
    .filter(
      (o) =>
        !query ||
        normalizeText(
          `${o.userName} ${o.userEmail} ${o.userPhone} ${o.vehicleName} ${o.id}`
        ).includes(query)
    );
}
