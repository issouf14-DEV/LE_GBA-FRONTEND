import { useState } from 'react';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { VehicleCard } from '@/features/vehicles/components/VehicleCard';
import { cn } from '@/lib/utils';

export function VehicleGrid({ vehicles, className }) {
  const [zoomed, setZoomed] = useState(null);

  return (
    <>
      <div className={cn('vehicle-grid', className)}>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onZoom={setZoomed} />
        ))}
      </div>
      <ImageLightbox
        images={zoomed ? [zoomed] : []}
        index={zoomed ? 0 : null}
        onIndexChange={() => {}}
        onClose={() => setZoomed(null)}
      />
    </>
  );
}
