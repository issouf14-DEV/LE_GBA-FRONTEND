// Les notifications sont relues depuis le stockage du navigateur : on les revalide toujours
import * as z from 'zod/mini';
import { lenient, safeText } from '@/lib/validation';

export const MAX_NOTIFICATIONS = 50;

const notificationSchema = z.object({
  id: z.string().check(z.minLength(1), z.maxLength(64)),
  type: lenient(z.string().check(z.maxLength(40)), 'info'),
  title: safeText(200),
  message: safeText(500),
  timestamp: safeText(40),
  read: lenient(z.boolean(), false),
});

export function parseNotifications(stored) {
  if (!Array.isArray(stored)) return [];
  return stored
    .slice(0, MAX_NOTIFICATIONS)
    .map((item) => notificationSchema.safeParse(item))
    .filter((result) => result.success)
    .map((result) => result.data);
}

export function createNotification({ type = 'info', title = '', message = '' }) {
  return notificationSchema.parse({
    id: crypto.randomUUID(),
    type: String(type),
    title: String(title).slice(0, 200),
    message: String(message).slice(0, 500),
    timestamp: new Date().toISOString(),
    read: false,
  });
}
