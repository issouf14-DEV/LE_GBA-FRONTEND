import { SafeImage } from '@/components/common/SafeImage';
import { formatDate, formatPrice } from '@/lib/format';

const plural = (count, word) => `${count} ${word}${count > 1 ? 's' : ''}`;

export function CheckoutSummary({ vehicle, quote, startDate, endDate }) {
  return (
    <aside className="summary-card">
      <h3 className="summary-card__header">Récapitulatif</h3>
      <div className="summary-card__body">
        <div className="summary-vehicle">
          <SafeImage src={vehicle.image} alt={vehicle.name} className="summary-vehicle__image" />
          <div>
            <p className="summary-vehicle__name">
              {vehicle.brand} {vehicle.model}
            </p>
            <p className="summary-vehicle__meta">{vehicle.fuel}</p>
          </div>
        </div>

        <dl className="summary-lines">
          <div className="summary-line">
            <dt>Prix par jour</dt>
            <dd>{formatPrice(quote.perDay)}</dd>
          </div>
          {quote.days > 0 && (
            <>
              <div className="summary-line">
                <dt>Période</dt>
                <dd>
                  {formatDate(startDate, 'medium')} - {formatDate(endDate, 'medium')}
                </dd>
              </div>
              <div className="summary-line">
                <dt>Durée</dt>
                <dd>{plural(quote.days, 'jour')}</dd>
              </div>
            </>
          )}
          <div className="summary-line summary-line--total">
            <dt>Total</dt>
            <dd>
              {formatPrice(quote.days > 0 ? quote.total : quote.perDay)}
              <span className="summary-line__hint">
                {quote.days > 0
                  ? `${formatPrice(quote.perDay)} × ${plural(quote.days, 'jour')}`
                  : 'Prix par jour (sélectionnez les dates)'}
              </span>
            </dd>
          </div>
        </dl>

        <p className="summary-card__note">
          Une caution pourra être demandée lors de la récupération du véhicule.
        </p>
      </div>
    </aside>
  );
}
