import { normalizeStatus } from '@/features/orders/lib/orderStatus';
import { daysBetween } from '@/lib/format';
import { safeImageUrl } from '@/lib/safeUrl';

// Le backend renvoie des formats variés : on les ramène à une forme unique
export function normalizeOrder(raw = {}) {
  const first = raw.vehicles?.[0];
  const vehicle = raw.vehicle || first?.vehicle || first || {};
  const contact = raw.contact || {};
  const user = typeof raw.user === 'object' && raw.user ? raw.user : {};
  const id = String(raw._id ?? raw.id ?? raw.orderId ?? '');
  const vehicleName =
    raw.vehicleName ||
    `${vehicle.brand || ''} ${vehicle.model || vehicle.name || ''}`.trim() ||
    'Véhicule';
  const startDate = raw.startDate || raw.reservation?.startDate;
  const endDate = raw.endDate || raw.reservation?.endDate;

  return {
    id,
    reference: raw.orderId || id.slice(-8).toUpperCase(),
    vehicleName,
    vehicleImage: safeImageUrl(vehicle.image),
    startDate,
    endDate,
    duration: Number(raw.days || raw.duration) || daysBetween(startDate, endDate),
    pricePerDay: Number(raw.pricePerDay || vehicle.price) || 0,
    totalPrice: Number(raw.totalPrice || raw.reservation?.totalPrice) || 0,
    status: normalizeStatus(raw.status),
    createdAt: raw.createdAt,
    validatedAt: raw.validatedAt,
    completedAt: raw.completedAt,
    userName: contact.fullName || raw.userName || user.name || '',
    userEmail: contact.email || raw.userEmail || user.email || '',
    userPhone: contact.phone || raw.userPhone || user.phone || '',
    address: contact.address || raw.address || '',
    notes: raw.notes || '',
  };
}

export const sortByNewest = (orders) =>
  [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
