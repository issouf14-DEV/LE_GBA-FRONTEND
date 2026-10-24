import { Ban, CheckCircle2, CircleCheckBig, Clock, XCircle } from 'lucide-react';

// Source unique des statuts de commande (les seules valeurs utilisées par le backend)
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

// Un statut inconnu (ou forgé) n'est jamais conservé tel quel
export const normalizeStatus = (status) =>
  typeof status === 'string' && Object.hasOwn(ORDER_STATUSES, status) ? status : 'en_attente';

export function getOrderStatus(status) {
  const key = normalizeStatus(status);
  return { key, ...(ORDER_STATUSES[key] || ORDER_STATUSES.en_attente) };
}
