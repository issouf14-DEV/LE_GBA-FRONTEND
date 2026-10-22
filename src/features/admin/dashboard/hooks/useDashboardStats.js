import { useCallback, useEffect, useState } from 'react';
import { adminAPI } from '@/api/admin';
import { ordersAPI } from '@/api/orders';
import { vehiclesAPI } from '@/api/vehicles';
import { computeStats } from '@/features/admin/dashboard/lib/stats';
import { toVehicleList } from '@/features/vehicles/lib/vehicle';

const valueOr = (result, fallback) => (result.status === 'fulfilled' ? result.value : fallback);

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.allSettled([
      ordersAPI.getAll(),
      adminAPI.getUsers(),
      vehiclesAPI.getAll(),
    ]);
    if (results.every((result) => result.status === 'rejected')) {
      setError('Impossible de joindre le serveur. Réessayez dans quelques instants.');
    } else {
      setStats(
        computeStats({
          orders: valueOr(results[0], []),
          users: valueOr(results[1], []),
          vehicles: toVehicleList(valueOr(results[2], [])),
        })
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener('newOrder', reload);
    window.addEventListener('orderStatusUpdated', reload);
    return () => {
      window.removeEventListener('newOrder', reload);
      window.removeEventListener('orderStatusUpdated', reload);
    };
  }, [reload]);

  return { stats, loading, error, reload };
}
