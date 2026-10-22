import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from '@/components/common/SafeImage';
import { OFFERS } from '@/features/home/content';

export function OffersSection() {
  return (
    <section className="section section--muted">
      <div className="page-container">
        <header className="section-header">
          <h2 className="section-title">Les offres du moment</h2>
          <p className="section-subtitle">
            Profitez d'offres exceptionnelles sur l'ensemble de la gamme.{' '}
            <Link to="/vehicles" className="link-primary">
              Je profite des offres*
            </Link>
          </p>
        </header>

        <div className="offer-grid">
          {OFFERS.map((offer) => (
            <article key={offer.id} className="offer-card">
              <div className="offer-card__media">
                <SafeImage src={offer.image} alt={offer.title} loading="lazy" />
                {offer.badge && <span className="offer-card__badge">{offer.badge}</span>}
              </div>
              <div className="offer-card__body">
                <h3 className="offer-card__title">{offer.title}</h3>
                <p className="offer-card__price">
                  à partir de <strong>{offer.monthlyPrice}</strong>*
                </p>
                <Link
                  to={`/vehicles?search=${encodeURIComponent(offer.search)}`}
                  className="offer-card__cta"
                >
                  Voir l'offre <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
