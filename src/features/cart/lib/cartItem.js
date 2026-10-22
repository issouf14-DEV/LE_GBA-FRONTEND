// Le panier vit dans le localStorage, donc modifiable par n'importe qui sur l'appareil :
// chaque article est réduit aux champs utiles et revalidé à chaque lecture.
import * as z from 'zod/mini';
import { storage } from '@/lib/storage';
import { lenient, safeImage, safeText as text } from '@/lib/validation';

const MAX_ITEMS = 20;

const cartItemSchema = z.object({
  id: z.string().check(z.minLength(1), z.maxLength(64)),
  name: text(120),
  brand: text(60),
  model: text(80),
  fuel: text(30),
  type: lenient(z.enum(['thermal', 'electric', 'hybrid']), 'thermal'),
  // Prix indicatif uniquement : le checkout relit toujours le prix sur le serveur
  price: lenient(z.coerce.number().check(z.minimum(0), z.maximum(100_000_000)), 0),
  image: safeImage,
  available: lenient(z.boolean(), true),
  quantity: lenient(
    z.coerce.number().check(z.refine(Number.isInteger), z.minimum(1), z.maximum(10)),
    1
  ),
  options: lenient(z.record(z.string(), z.unknown()), {}),
  addedAt: text(40),
});

export function toCartItem(vehicle, options = {}) {
  return cartItemSchema.parse({
    id: String(vehicle._id ?? vehicle.id),
    name: vehicle.name,
    brand: vehicle.brand,
    model: vehicle.model,
    fuel: vehicle.fuel,
    type: vehicle.type,
    price: vehicle.price,
    image: vehicle.image,
    available: vehicle.available,
    quantity: 1,
    options,
    addedAt: new Date().toISOString(),
  });
}

export function loadCart(key) {
  const stored = storage.getJSON(key, []);
  if (!Array.isArray(stored)) return [];
  return stored
    .slice(0, MAX_ITEMS)
    .map((item) => cartItemSchema.safeParse(item))
    .filter((result) => result.success)
    .map((result) => result.data);
}
