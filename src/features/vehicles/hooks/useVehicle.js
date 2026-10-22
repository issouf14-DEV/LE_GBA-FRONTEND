import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/api/client';
import { vehiclesAPI } from '@/api/vehicles';
import { normalizeVehicle } from '@/features/vehicles/lib/vehicle';

export function useVehicle(id) {
  const [state, setState] = useState({ vehicle: null, loading: true, error: '' });

  useEffect(() => {
    let active = true;
    if (!id) {
      setState({ vehicle: null, loading: false, error: '' });
      return undefined;
    }
    setState({ vehicle: null, loading: true, error: '' });

    vehiclesAPI
      .getById(id)
      .then((data) => {
        if (!active) return;
        const vehicle = data?.vehicle || data;
        setState({
          vehicle: vehicle ? normalizeVehicle(vehicle) : null,
          loading: false,
          error: '',
        });
      })
      .catch((error) => {
        if (!active) return;
        const notFound = error?.response?.status === 404;
        setState({
          vehicle: null,
          loading: false,
          error: notFound ? '' : getErrorMessage(error, 'Impossible de charger ce véhicule'),
        });
      });

    return () => {
      active = false;
    };
  }, [id]);

  return state;
}
