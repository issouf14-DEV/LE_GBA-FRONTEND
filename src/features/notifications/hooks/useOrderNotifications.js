import { useEffect } from 'react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { getOrderStatus } from '@/features/orders/lib/orderStatus';

// Transforme les événements de commande en notifications locales (les emails sont envoyés ailleurs)
export function useOrderNotifications(role = 'user') {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const onNewOrder = (event) => {
      if (role !== 'admin') return;
      const order = event.detail?.order || {};
      addNotification({
        type: 'order',
        title: 'Nouvelle commande reçue',
        message: `${order.userName || 'Un client'} a commandé ${order.vehicleName || 'un véhicule'}`,
        orderId: order._id || order.id,
      });
    };

    const onStatusUpdated = (event) => {
      if (role !== 'user') return;
      const { orderId, status, order } = event.detail || {};
      const { key, label } = getOrderStatus(status);
      addNotification({
        type: `order_${key}`,
        title: `Commande : ${label}`,
        message: `Réservation ${order?.vehicleName || ''} : ${label.toLowerCase()}`.trim(),
        orderId,
      });
    };

    window.addEventListener('newOrder', onNewOrder);
    window.addEventListener('orderStatusUpdated', onStatusUpdated);
    return () => {
      window.removeEventListener('newOrder', onNewOrder);
      window.removeEventListener('orderStatusUpdated', onStatusUpdated);
    };
  }, [role, addNotification]);
}
