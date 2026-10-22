import { carImages } from '@/features/vehicles/lib/carImages';
import { safeImageUrl } from '@/lib/safeUrl';
import { normalizeText } from '@/lib/text';

export const VEHICLE_TYPES = [
  { id: 'all', label: 'Tous' },
  { id: 'thermal', label: 'Thermiques', single: 'Thermique' },
  { id: 'hybrid', label: 'Hybrides', single: 'Hybride' },
  { id: 'electric', label: 'Électriques', single: 'Électrique' },
];

const FALLBACK_IMAGES = {
  electric: carImages.electric1,
  hybrid: carImages.family1,
  thermal: carImages.sport1,
};

// Le backend n'a pas toujours de champ "type" : on le déduit du carburant / catégorie
function resolveType(vehicle) {
  if (['thermal', 'electric', 'hybrid'].includes(vehicle?.type)) return vehicle.type;
  const hint = normalizeText(
    [vehicle?.type, vehicle?.category, vehicle?.fuelType, vehicle?.fuel, vehicle?.energy].join(' ')
  );
  if (hint.includes('elect')) return 'electric';
  if (hint.includes('hybr')) return 'hybrid';
  return 'thermal';
}

export const typeLabel = (type) => VEHICLE_TYPES.find((t) => t.id === type)?.single || 'Thermique';

export function normalizeVehicle(raw = {}) {
  const type = resolveType(raw);
  const name = raw.name || `${raw.brand || ''} ${raw.model || ''}`.trim() || 'Véhicule';
  return {
    ...raw,
    id: raw.id ?? raw._id,
    name,
    brand: raw.brand || name.split(' ')[0],
    model: raw.model || name,
    type,
    fuel: raw.fuel || typeLabel(type),
    transmission: raw.transmission || 'Non précisée',
    power: raw.power || 'Non précisée',
    year: raw.year || null,
    mileage: Number(raw.mileage) || 0,
    price: Number(raw.price) || 0,
    available: raw.available !== false,
    image: safeImageUrl(raw.image, FALLBACK_IMAGES[type]),
    // Galerie : uniquement des URL d'images sûres
    images: (Array.isArray(raw.images) ? raw.images : Array.isArray(raw.photos) ? raw.photos : [])
      .map((url) => safeImageUrl(url))
      .filter(Boolean)
      .slice(0, 12),
    description: raw.description || '',
    // Données brutes du backend (pour l'édition admin, sans valeurs d'affichage par défaut)
    source: raw,
  };
}

export const toVehicleList = (data) =>
  (Array.isArray(data) ? data : data?.vehicles || []).map(normalizeVehicle);

export const DEFAULT_FILTERS = { priceMin: '', priceMax: '', year: '', sortBy: 'recent' };

export function filterVehicles(vehicles, { type, search, filters }) {
  const query = normalizeText(search);
  const min = Number(filters.priceMin) || 0;
  const max = Number(filters.priceMax) || Number.POSITIVE_INFINITY;

  return vehicles
    .filter((vehicle) => type === 'all' || vehicle.type === type)
    .filter((vehicle) => !filters.year || String(vehicle.year) === filters.year)
    .filter((vehicle) => vehicle.price >= min && vehicle.price <= max)
    .filter(
      (vehicle) =>
        !query ||
        normalizeText(
          `${vehicle.name} ${vehicle.brand} ${vehicle.model} ${vehicle.description}`
        ).includes(query)
    )
    .sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
}

export const countByType = (vehicles) =>
  Object.fromEntries(
    VEHICLE_TYPES.map(({ id }) => [
      id,
      id === 'all' ? vehicles.length : vehicles.filter((v) => v.type === id).length,
    ])
  );

export const availableYears = (vehicles) =>
  [...new Set(vehicles.map((v) => v.year).filter(Boolean))].sort((a, b) => b - a);
