// Session : portée par des cookies httpOnly (illisibles en JavaScript).
// Le navigateur ne conserve que la photo de profil, que le backend ne stocke pas.
import * as z from 'zod/mini';
import { storage } from '@/lib/storage';
import { safeImage as imageSchema, lenient } from '@/lib/validation';

const PROFILE_KEY = 'userProfile';
// Anciennes clés (tokens et profils en clair) à supprimer des navigateurs déjà utilisés
const LEGACY_KEYS = [
  'token',
  'user',
  'userProfiles',
  'pendingOrders',
  'mock_vehicles',
  'mock_orders',
];

export function purgeLegacyStorage() {
  for (const key of LEGACY_KEYS) storage.remove(key);
}

const lenientString = () => lenient(z.string(), '');
const email = z.string().check(z.regex(z.regexes.email));

const userSchema = z.object({
  id: z.coerce.string(),
  name: lenientString(),
  email,
  role: lenient(z.enum(['user', 'admin']), 'user'),
  phone: lenientString(),
  address: lenientString(),
  firstName: lenientString(),
  lastName: lenientString(),
  profileImage: imageSchema,
});

const profileSchema = z.object({ email, profileImage: imageSchema });

function getLocalPhoto(email) {
  const parsed = profileSchema.safeParse(storage.getJSON(PROFILE_KEY));
  return parsed.success && parsed.data.email === email ? parsed.data.profileImage : null;
}

export function saveLocalPhoto(user) {
  const parsed = profileSchema.safeParse({ email: user?.email, profileImage: user?.profileImage });
  if (parsed.success) storage.setJSON(PROFILE_KEY, parsed.data);
}

// Construit l'utilisateur à partir de la réponse du serveur (+ photo locale)
export function buildUser(data, extra = {}) {
  const [first = '', ...rest] = (data.name || extra.name || '').split(' ');
  return userSchema.parse({
    id: data.id || data._id,
    name: data.name || extra.name || '',
    email: data.email,
    role: data.role,
    phone: data.phone || extra.phone || '',
    address: data.address || extra.address || '',
    firstName: data.firstName || extra.firstName || first,
    lastName: data.lastName || extra.lastName || rest.join(' '),
    profileImage: data.profileImage || extra.profileImage || getLocalPhoto(data.email),
  });
}
