import { ZoomIn } from 'lucide-react';
import { useState } from 'react';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { SafeImage } from '@/components/common/SafeImage';
import { cn } from '@/lib/utils';

export function VehicleGallery({ vehicle }) {
  const images = vehicle.images?.length ? vehicle.images : [vehicle.image];
  const [selected, setSelected] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);

  return (
    <div className="vehicle-gallery">
      <div className="vehicle-gallery__main">
        <button
          type="button"
          className="vehicle-gallery__zoom-btn"
          onClick={() => setZoomIndex(selected)}
          aria-label={`Agrandir la photo de ${vehicle.name}`}
        >
          <SafeImage
            src={images[selected]}
            alt={vehicle.name}
            className="vehicle-gallery__image"
            loading="eager"
            fetchPriority="high"
          />
          <ZoomIn className="vehicle-gallery__zoom" aria-hidden="true" />
        </button>
        <span className="vehicle-gallery__badge">{vehicle.year || 'Neuf'}</span>
        <span className="vehicle-gallery__badge vehicle-gallery__badge--right">
          {vehicle.mileage ? `${vehicle.mileage.toLocaleString('fr-FR')} km` : 'Neuf • 0 km'}
        </span>
      </div>

      {images.length > 1 && (
        <div className="vehicle-gallery__thumbs">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                'vehicle-gallery__thumb',
                index === selected && 'vehicle-gallery__thumb--active'
              )}
              aria-label={`Vue ${index + 1}`}
            >
              <SafeImage src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      <ImageLightbox
        images={images}
        index={zoomIndex}
        onIndexChange={setZoomIndex}
        onClose={() => setZoomIndex(null)}
        alt={vehicle.name}
      />
    </div>
  );
}
