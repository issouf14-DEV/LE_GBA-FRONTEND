import { useCallback, useEffect, useState } from 'react';
import { adminAPI } from '@/api/admin';
import { toDashboardStats } from '@/features/admin/dashboard/lib/stats';

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Une seule requête : le serveur calcule les agrégats sur toutes les données
  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setStats(toDashboardStats(await adminAPI.getStats()));
    } catch {
      setError('Impossible de joindre le serveur. Réessayez dans quelques instants.');
    } finally {
      setLoading(false);
    }
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
