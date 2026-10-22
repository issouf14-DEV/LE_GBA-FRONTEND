import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getErrorMessage } from '@/api/client';
import { sendPaymentReminder, sendRentalSummary } from '@/api/email';
import { ordersAPI } from '@/api/orders';
import { useToast } from '@/components/common/toast/useToast';
import { countByStatus, filterOrders } from '@/features/admin/orders/lib/adminOrders';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { normalizeOrder, sortByNewest } from '@/features/orders/lib/normalizeOrder';

const REFRESH_INTERVAL = 30_000;

export function useAdminOrders() {
  const toast = useToast();
  const { addNotification } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ view: 'active', status: 'all', search: '' });
  const lastPending = useRef(null);

  const reload = useCallback(async () => {
    try {
      const list = sortByNewest((await ordersAPI.getAll()).map(normalizeOrder));
      const pending = list.filter((o) => o.status === 'en_attente').length;
      if (lastPending.current !== null && pending > lastPending.current) {
        addNotification({
          type: 'order',
          title: 'Nouvelle commande',
          message: `${pending - lastPending.current} commande(s) en attente de validation`,
        });
      }
      lastPending.current = pending;
      setOrders(list);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors du chargement des commandes'));
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    reload();
    const timer = setInterval(reload, REFRESH_INTERVAL);
    window.addEventListener('newOrder', reload);
    return () => {
      clearInterval(timer);
      window.removeEventListener('newOrder', reload);
    };
  }, [reload]);

  const updateStatus = async (order, status, successMessage) => {
    try {
      await ordersAPI.updateStatus(order.id, status, order);
      toast.success(`${successMessage}. Email envoyé au client.`);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Erreur lors de la mise à jour du statut'));
    }
  };

  const sendEmail = async (request, label) => {
    const result = await request();
    if (result.success) toast.success(`${label} envoyé`);
    else toast.error(`Erreur lors de l'envoi : ${label.toLowerCase()}`);
  };

  return {
    orders: useMemo(() => filterOrders(orders, filters), [orders, filters]),
    counts: useMemo(() => countByStatus(orders), [orders]),
    loading,
    error,
    filters,
    setFilter: (key, value) => setFilters((current) => ({ ...current, [key]: value })),
    reload,
    updateStatus,
    sendReminder: (order) => sendEmail(() => sendPaymentReminder(order.id), 'Rappel de paiement'),
    sendSummary: (order) => sendEmail(() => sendRentalSummary(order.id), 'Récapitulatif'),
  };
}
