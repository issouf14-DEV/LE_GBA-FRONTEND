import { Plus, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '@/components/common/SafeImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { typeLabel } from '@/features/vehicles/lib/vehicle';
import { formatPrice } from '@/lib/format';

export function VehicleCard({ vehicle, onZoom }) {
  const addToCart = useAddToCart();
  const specs = [
    ['Année', vehicle.year || 'Non précisée'],
    ['Transmission', vehicle.transmission],
    ['Puissance', vehicle.power],
  ];

  return (
    <article className="vehicle-card">
      <div className="vehicle-card__media">
        <button
          type="button"
          className="vehicle-card__zoom-btn"
          onClick={() => onZoom?.(vehicle.image)}
          aria-label={`Agrandir la photo de ${vehicle.name}`}
        >
          <SafeImage
            src={vehicle.image}
            alt={vehicle.name}
            loading="lazy"
            className="vehicle-card__image"
          />
          <span className="vehicle-card__zoom">
            <ZoomIn aria-hidden="true" />
          </span>
        </button>
        <Badge variant="secondary" className="vehicle-card__type">
          {typeLabel(vehicle.type)}
        </Badge>
        {!vehicle.available && (
          <Badge variant="destructive" className="vehicle-card__status">
            Indisponible
          </Badge>
        )}
      </div>

      <div className="vehicle-card__body">
        <p className="vehicle-card__brand">{vehicle.brand}</p>
        <h3 className="vehicle-card__title">
          <Link to={`/vehicles/${vehicle.id}`}>{vehicle.model}</Link>
        </h3>
        <dl className="vehicle-card__specs">
          {specs.map(([label, value]) => (
            <div key={label} className="vehicle-card__spec">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="vehicle-card__price-block">
          <p className="vehicle-card__price-label">Prix</p>
          <p className="vehicle-card__price">{formatPrice(vehicle.price)}</p>
        </div>
        <Button
          className="btn-gradient vehicle-card__cta"
          onClick={() => addToCart(vehicle)}
          disabled={!vehicle.available}
        >
          <Plus aria-hidden="true" />
          Ajouter au panier
        </Button>
      </div>
    </article>
  );
}
