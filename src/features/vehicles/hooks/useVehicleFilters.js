import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  availableYears,
  countByType,
  DEFAULT_FILTERS,
  filterVehicles,
  VEHICLE_TYPES,
} from '@/features/vehicles/lib/vehicle';

const isKnownType = (value) => VEHICLE_TYPES.some((t) => t.id === value);

// Type et recherche viennent de l'URL (?type=electric&search=golf) pour être partageables
export function useVehicleFilters(vehicles) {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const type = isKnownType(params.get('type')) ? params.get('type') : 'all';
  const search = params.get('search') || '';

  const updateParam = (key, value, fallback) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (!value || value === fallback) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  };

  const results = useMemo(
    () => filterVehicles(vehicles, { type, search, filters }),
    [vehicles, type, search, filters]
  );

  return {
    type,
    search,
    filters,
    results,
    counts: useMemo(() => countByType(vehicles), [vehicles]),
    years: useMemo(() => availableYears(vehicles), [vehicles]),
    setType: (value) => updateParam('type', value, 'all'),
    setSearch: (value) => updateParam('search', value.slice(0, 80), ''),
    setFilter: (key, value) => setFilters((current) => ({ ...current, [key]: value })),
    reset: () => {
      setFilters(DEFAULT_FILTERS);
      setParams({}, { replace: true });
    },
  };
}
