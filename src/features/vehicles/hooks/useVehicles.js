import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '@/api/client';
import { vehiclesAPI } from '@/api/vehicles';
import { toVehicleList } from '@/features/vehicles/lib/vehicle';

const UPDATE_EVENTS = ['vehicleUpdated', 'vehicleCreated', 'vehicleDeleted'];

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setVehicles(toVehicleList(await vehiclesAPI.getAll()));
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de charger les véhicules'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    for (const name of UPDATE_EVENTS) window.addEventListener(name, reload);
    return () => {
      for (const name of UPDATE_EVENTS) window.removeEventListener(name, reload);
    };
  }, [reload]);

  return { vehicles, loading, error, reload };
}
