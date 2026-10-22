import { daysBetween } from '@/lib/format';

const pricePerDay = (vehicle) => Number(vehicle?.price || vehicle?.pricePerDay) || 0;

// Estimation affichée au client ; le montant facturé est calculé par le serveur
export function computeQuote(vehicle, startDate, endDate) {
  const days = startDate && endDate ? daysBetween(startDate, endDate) : 0;
  const perDay = pricePerDay(vehicle);
  return { days, perDay, total: days * perDay };
}

// Seule la demande du client est envoyée : ni prix, ni statut, ni identifiant utilisateur
// (le serveur les détermine lui-même à partir de la session et du véhicule)
export function buildOrderPayload({ vehicle, values }) {
  return {
    vehicleId: vehicle._id ?? vehicle.id,
    startDate: values.startDate,
    endDate: values.endDate,
    contact: {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      address: values.address,
    },
    notes: values.notes,
  };
}
