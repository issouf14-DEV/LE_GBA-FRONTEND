import { Check, CreditCard, Eye, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Boutons d'action d'une commande (liste et fenêtre de détail)
export function AdminOrderActions({ order, onDetails, onAction, onReminder, onSummary }) {
  return (
    <div className="admin-order__actions">
      {onDetails && (
        <Button size="sm" variant="secondary" onClick={() => onDetails(order)}>
          <Eye aria-hidden="true" /> Détails
        </Button>
      )}
      {order.status === 'en_attente' && (
        <>
          <Button size="sm" className="btn-success" onClick={() => onAction(order, 'validate')}>
            <Check aria-hidden="true" /> Valider
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onAction(order, 'reject')}>
            <X aria-hidden="true" /> Rejeter
          </Button>
        </>
      )}
      {order.status === 'validee' && (
        <>
          <Button size="sm" variant="outline" onClick={() => onReminder(order)}>
            <CreditCard aria-hidden="true" /> Rappel de paiement
          </Button>
          <Button size="sm" variant="outline" onClick={() => onSummary(order)}>
            <FileText aria-hidden="true" /> Récapitulatif
          </Button>
        </>
      )}
    </div>
  );
}
