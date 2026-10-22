import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterPills } from '@/components/common/FilterPills';
import { VehicleGrid } from '@/features/vehicles/components/VehicleGrid';
import { VehicleGridSkeleton } from '@/features/vehicles/components/VehicleGridSkeleton';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import { countByType, VEHICLE_TYPES } from '@/features/vehicles/lib/vehicle';

const MAX_MODELS = 8;

// Aperçu du catalogue réel (API), filtrable par motorisation
export function ModelsSection() {
  const { vehicles, loading, error } = useVehicles();
  const [type, setType] = useState('all');

  const counts = useMemo(() => countByType(vehicles), [vehicles]);
  const shown = vehicles.filter((v) => type === 'all' || v.type === type).slice(0, MAX_MODELS);
  const tabs = VEHICLE_TYPES.map((t) => ({ ...t, count: counts[t.id] }));

  return (
    <section className="section">
      <div className="page-container">
        <h2 className="section-title section-title--center">Découvrir nos modèles</h2>
        <FilterPills options={tabs} value={type} onChange={setType} />

        {loading ? (
          <VehicleGridSkeleton count={4} />
        ) : error ? (
          <p className="section-note">{error}</p>
        ) : shown.length > 0 ? (
          <VehicleGrid vehicles={shown} />
        ) : (
          <p className="section-note">Aucun véhicule disponible dans cette catégorie.</p>
        )}

        <p className="section-note">
          Découvrez tous nos véhicules dans notre{' '}
          <Link to="/vehicles" className="link-primary">
            catalogue complet
          </Link>
        </p>
      </div>
    </section>
  );
}
