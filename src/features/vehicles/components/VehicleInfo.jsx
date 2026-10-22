import { Calendar, CheckCircle2, Fuel, Gauge, Settings, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { formatPrice } from '@/lib/format';

const ADVANTAGES = [
  'Garantie 12 mois',
  'Service client 24/7',
  'Livraison gratuite',
  'Retour sans frais',
];

export function VehicleInfo({ vehicle }) {
  const addToCart = useAddToCart();
  const specs = [
    { icon: Calendar, label: 'Année', value: vehicle.year || 'Non précisée' },
    { icon: Gauge, label: 'Kilométrage', value: `${vehicle.mileage.toLocaleString('fr-FR')} km` },
    { icon: Fuel, label: 'Carburant', value: vehicle.fuel },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
  ];

  return (
    <div className="vehicle-info">
      <p className="vehicle-info__brand">{vehicle.brand}</p>
      <h1 className="vehicle-info__title">{vehicle.model}</h1>
      <p className="vehicle-info__description">
        {vehicle.description || 'Véhicule disponible à la location.'}
      </p>

      <dl className="spec-grid">
        {specs.map(({ icon: Icon, label, value }) => (
          <div key={label} className="spec-tile">
            <Icon className="spec-tile__icon" aria-hidden="true" />
            <dt className="spec-tile__label">{label}</dt>
            <dd className="spec-tile__value">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="vehicle-info__price-card">
        <p className="vehicle-info__price-label">Prix</p>
        <p className="vehicle-info__price">{formatPrice(vehicle.price)}</p>
        <Button
          className="btn-gradient"
          onClick={() => addToCart(vehicle)}
          disabled={!vehicle.available}
        >
          <ShoppingCart aria-hidden="true" />
          {vehicle.available ? 'Ajouter au panier' : 'Indisponible'}
        </Button>
      </div>

      <div className="vehicle-info__advantages">
        <p className="vehicle-info__advantages-title">
          <CheckCircle2 aria-hidden="true" /> Caractéristiques principales
        </p>
        <ul>
          {ADVANTAGES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
