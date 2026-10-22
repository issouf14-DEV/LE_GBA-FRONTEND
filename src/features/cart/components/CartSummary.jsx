import { Lock, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

export function CartSummary({ total }) {
  return (
    <aside className="summary-card summary-card--sticky">
      <h2 className="summary-card__header">Résumé</h2>
      <div className="summary-card__body">
        <dl className="summary-lines">
          <div className="summary-line">
            <dt>Total par jour</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="summary-line">
            <dt>Livraison</dt>
            <dd className="text-success">Gratuite</dd>
          </div>
        </dl>
        <p className="summary-card__note">
          Le montant final dépend de la durée de location, choisie à l'étape suivante.
        </p>
        <Button asChild className="btn-gradient">
          <Link to="/checkout">Réserver</Link>
        </Button>
        <ul className="summary-card__perks">
          <li>
            <Lock aria-hidden="true" /> Paiement sécurisé
          </li>
          <li>
            <Truck aria-hidden="true" /> Livraison gratuite
          </li>
        </ul>
      </div>
    </aside>
  );
}
