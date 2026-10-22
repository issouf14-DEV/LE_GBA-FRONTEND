import { useMemo, useState } from 'react';
import { getErrorMessage } from '@/api/client';
import { vehiclesAPI } from '@/api/vehicles';
import { useToast } from '@/components/common/toast/useToast';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import { normalizeText } from '@/lib/text';

const notify = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

export function useAdminVehicles() {
  const toast = useToast();
  const { vehicles, loading, error, reload } = useVehicles();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = normalizeText(search);
    if (!query) return vehicles;
    return vehicles.filter((v) =>
      normalizeText(
        `${v.brand} ${v.model} ${v.fuel} ${v.type} ${v.color} ${v.year} ${v.price}`
      ).includes(query)
    );
  }, [vehicles, search]);

  const save = async (id, payload) => {
    try {
      const saved = id ? await vehiclesAPI.update(id, payload) : await vehiclesAPI.create(payload);
      toast.success(id ? 'Véhicule mis à jour' : 'Véhicule ajouté');
      notify(id ? 'vehicleUpdated' : 'vehicleCreated', { vehicle: saved });
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur lors de l'enregistrement"));
      return false;
    }
  };

  const remove = async (id) => {
    try {
      await vehiclesAPI.remove(id);
      toast.success('Véhicule supprimé');
      notify('vehicleDeleted', { vehicleId: id });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Erreur lors de la suppression'));
    }
  };

  return {
    vehicles: filtered,
    total: vehicles.length,
    availableCount: vehicles.filter((v) => v.available).length,
    loading,
    error,
    reload,
    search,
    setSearch,
    save,
    remove,
  };
}
