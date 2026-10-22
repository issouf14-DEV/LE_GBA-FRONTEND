import { Ban, CheckCircle2, CircleCheckBig, Clock, Truck, XCircle } from 'lucide-react';
import { ownValue } from '@/lib/object';

// Source unique des statuts de commande (le backend mélange français et anglais)
export const ORDER_STATUSES = {
  en_attente: {
    label: 'En attente',
    variant: 'warning',
    icon: Clock,
    description: 'Votre commande est en cours de traitement',
  },
  validee: {
    label: 'Validée',
    variant: 'success',
    icon: CheckCircle2,
    description: "Votre commande a été validée par l'équipe",
  },
  en_cours: {
    label: 'En cours',
    variant: 'info',
    icon: Truck,
    description: 'Votre véhicule est en cours de préparation',
  },
  terminee: {
    label: 'Terminée',
    variant: 'success',
    icon: CircleCheckBig,
    description: 'Location terminée avec succès',
  },
  rejetee: {
    label: 'Rejetée',
    variant: 'destructive',
    icon: Ban,
    description: 'Cette commande a été rejetée',
  },
  annulee: {
    label: 'Annulée',
    variant: 'secondary',
    icon: XCircle,
    description: 'Cette commande a été annulée',
  },
};

const ALIASES = {
  pending: 'en_attente',
  validated: 'validee',
  confirmed: 'validee',
  approved: 'validee',
  in_progress: 'en_cours',
  completed: 'terminee',
  fulfilled: 'terminee',
  rejected: 'rejetee',
  cancelled: 'annulee',
  canceled: 'annulee',
};

// Un statut inconnu (ou forgé) n'est jamais conservé tel quel
export const normalizeStatus = (status) => {
  const key = ownValue(ALIASES, status, status);
  return typeof key === 'string' && Object.hasOwn(ORDER_STATUSES, key) ? key : 'en_attente';
};

export function getOrderStatus(status) {
  const key = normalizeStatus(status);
  return { key, ...(ORDER_STATUSES[key] || ORDER_STATUSES.en_attente) };
}
