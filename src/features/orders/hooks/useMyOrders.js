import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '@/api/client';
import { resendOrderEmail } from '@/api/email';
import { ordersAPI } from '@/api/orders';
import { useToast } from '@/components/common/toast/useToast';
import { normalizeOrder, sortByNewest } from '@/features/orders/lib/normalizeOrder';

export function useMyOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setOrders(sortByNewest((await ordersAPI.getMine()).map(normalizeOrder)));
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors du chargement des réservations'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener('newOrder', reload);
    return () => window.removeEventListener('newOrder', reload);
  }, [reload]);

  const cancel = async (order) => {
    try {
      await ordersAPI.cancel(order.id);
      toast.success('Réservation annulée');
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur lors de l'annulation"));
    }
  };

  const resendEmail = async (order) => {
    const result = await resendOrderEmail(order.id);
    if (result.success) toast.success('Email renvoyé');
    else toast.error("Impossible de renvoyer l'email. Contactez le support.");
  };

  return { orders, loading, error, reload, cancel, resendEmail };
}
