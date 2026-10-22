import { AlertCircle, ArrowLeft, CarFront } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { VehicleDetailSkeleton } from '@/features/vehicles/components/VehicleDetailSkeleton';
import { VehicleGallery } from '@/features/vehicles/components/VehicleGallery';
import { VehicleInfo } from '@/features/vehicles/components/VehicleInfo';
import { useVehicle } from '@/features/vehicles/hooks/useVehicle';

function BackLink() {
  return (
    <Link to="/vehicles" className="back-link">
      <ArrowLeft aria-hidden="true" /> Retour aux véhicules
    </Link>
  );
}

export default function VehicleDetail() {
  const { id } = useParams();
  const { vehicle, loading, error } = useVehicle(id);

  return (
    <div className="page page--offset">
      <div className="page-container">
        <BackLink />
        {loading ? (
          <VehicleDetailSkeleton />
        ) : vehicle ? (
          <div className="vehicle-detail">
            <VehicleGallery vehicle={vehicle} />
            <VehicleInfo vehicle={vehicle} />
          </div>
        ) : (
          <EmptyState
            icon={error ? AlertCircle : CarFront}
            tone={error ? 'error' : undefined}
            title={error ? 'Erreur de chargement' : 'Véhicule non trouvé'}
            description={error || "Ce véhicule n'existe pas ou a été supprimé."}
          />
        )}
      </div>
    </div>
  );
}
