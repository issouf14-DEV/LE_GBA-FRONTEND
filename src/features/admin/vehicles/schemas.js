import * as z from 'zod/mini';
import { intField, optionalText, refine, requiredText, trimmed } from '@/lib/validation';

const CURRENT_YEAR = new Date().getFullYear();

export const TYPE_OPTIONS = [
  { value: 'thermal', label: 'Thermique' },
  { value: 'electric', label: 'Électrique' },
  { value: 'hybrid', label: 'Hybride' },
];
export const FUEL_OPTIONS = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'].map((v) => ({
  value: v,
  label: v,
}));
export const TRANSMISSION_OPTIONS = ['Manuelle', 'Automatique', 'CVT'].map((v) => ({
  value: v,
  label: v,
}));
export const DOOR_OPTIONS = ['2', '3', '4', '5'].map((v) => ({ value: v, label: `${v} portes` }));
export const SEAT_OPTIONS = ['2', '4', '5', '7', '8'].map((v) => ({
  value: v,
  label: `${v} places`,
}));

// Formats acceptés par le serveur : URL https, fichier encodé (image/jpg refusé) ou photo
// déjà hébergée par l'API (modification d'un véhicule sans changer sa photo)
const IMAGE_PATTERN = /^(https:\/\/|data:image\/(png|jpeg|webp);base64,)/;
const STORED_IMAGE = /^\/api\/vehicles\/[a-f0-9]{24}\/image(\?v=\d+)?$/;
const imageField = trimmed(
  z.maxLength(2_900_000, 'Image trop lourde (2 Mo maximum)'),
  refine(
    (value) => !value || IMAGE_PATTERN.test(value) || STORED_IMAGE.test(value),
    'Image invalide (URL https ou fichier JPEG/PNG/WebP)'
  )
);

export const vehicleSchema = z.object({
  brand: requiredText('La marque', 50),
  model: requiredText('Le modèle', 80),
  price: z.coerce
    .number({ message: 'Prix invalide' })
    .check(z.positive('Le prix doit être positif'), z.maximum(100_000_000, 'Prix invalide')),
  year: intField(1950, CURRENT_YEAR + 1, 'Année invalide'),
  type: z.enum(['thermal', 'electric', 'hybrid']),
  fuel: optionalText(30),
  transmission: optionalText(30),
  power: optionalText(30),
  engineSize: optionalText(30),
  color: optionalText(30),
  doors: intField(2, 5),
  seats: intField(2, 9),
  mileage: intField(0, 2_000_000, 'Kilométrage invalide'),
  available: z.boolean(),
  featured: z.boolean(),
  tags: optionalText(200),
  description: optionalText(1000),
  image: imageField,
});

export const EMPTY_VEHICLE = {
  brand: '',
  model: '',
  price: '',
  year: String(CURRENT_YEAR),
  type: 'thermal',
  fuel: '',
  transmission: '',
  power: '',
  engineSize: '',
  color: '',
  doors: '5',
  seats: '5',
  mileage: '0',
  available: true,
  featured: false,
  tags: '',
  description: '',
  image: '',
};

// Véhicule backend -> valeurs de formulaire (tout en texte)
export function toFormValues(normalized) {
  const vehicle = normalized.source || normalized;
  const values = { ...EMPTY_VEHICLE };
  for (const key of Object.keys(EMPTY_VEHICLE)) {
    const value = vehicle[key];
    if (value === undefined || value === null) continue;
    values[key] = typeof EMPTY_VEHICLE[key] === 'boolean' ? Boolean(value) : String(value);
  }
  values.tags = Array.isArray(vehicle.tags) ? vehicle.tags.join(', ') : values.tags;
  return values;
}

export const toPayload = (data) => ({
  ...data,
  tags: data.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean),
});
