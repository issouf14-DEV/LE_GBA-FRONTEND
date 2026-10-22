import { AlertCircle, RefreshCw, SearchX } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { FilterPills } from '@/components/common/FilterPills';
import { PageHero } from '@/components/common/PageHero';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { VehicleGrid } from '@/features/vehicles/components/VehicleGrid';
import { VehicleGridSkeleton } from '@/features/vehicles/components/VehicleGridSkeleton';
import { VehicleToolbar } from '@/features/vehicles/components/VehicleToolbar';
import { useVehicleFilters } from '@/features/vehicles/hooks/useVehicleFilters';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import { VEHICLE_TYPES } from '@/features/vehicles/lib/vehicle';

function RefreshButton({ loading, onClick, variant }) {
  return (
    <Button
      variant={variant}
      className={variant ? undefined : 'btn-gradient btn-auto'}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : <RefreshCw aria-hidden="true" />}
      {loading ? 'Chargement...' : 'Actualiser'}
    </Button>
  );
}

export default function Vehicles() {
  const { vehicles, loading, error, reload } = useVehicles();
  const view = useVehicleFilters(vehicles);
  const tabs = VEHICLE_TYPES.map((t) => ({ ...t, count: view.counts[t.id] }));

  return (
    <div className="page page--muted">
      <PageHero title="Nos véhicules" subtitle="Trouvez le véhicule parfait pour vous" />

      <div className="page-container page-container--overlap">
        <FilterPills options={tabs} value={view.type} onChange={view.setType} />
        <VehicleToolbar
          search={view.search}
          onSearch={view.setSearch}
          filters={view.filters}
          onFilter={view.setFilter}
          years={view.years}
        />

        {loading && vehicles.length === 0 ? (
          <VehicleGridSkeleton />
        ) : error ? (
          <EmptyState
            icon={AlertCircle}
            tone="error"
            title="Impossible de charger les véhicules"
            description={error}
          >
            <RefreshButton loading={loading} onClick={reload} />
          </EmptyState>
        ) : (
          <>
            <div className="results-bar">
              <p className="results-bar__count">
                <strong>{view.results.length}</strong> sur {vehicles.length} véhicule
                {vehicles.length > 1 ? 's' : ''}
              </p>
              <RefreshButton loading={loading} onClick={reload} />
            </div>

            {view.results.length > 0 ? (
              <>
                <h2 className="sr-only">Liste des véhicules</h2>
                <VehicleGrid vehicles={view.results} />
              </>
            ) : (
              <EmptyState
                icon={SearchX}
                title="Aucun véhicule trouvé"
                description="Aucun véhicule ne correspond à vos critères de recherche."
              >
                <Button className="btn-gradient btn-auto" onClick={view.reset}>
                  Réinitialiser les filtres
                </Button>
              </EmptyState>
            )}
          </>
        )}
      </div>
    </div>
  );
}
