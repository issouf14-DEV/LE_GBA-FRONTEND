import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">Prêt à démarrer ?</h2>
        <p className="cta-banner__text">
          Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nous
          pouvons vous accompagner dans votre projet automobile.
        </p>
        <div className="cta-banner__actions">
          <Link to="/contact" className="hero__cta">
            Nous contacter <ArrowRight aria-hidden="true" />
          </Link>
          <Link to="/vehicles" className="hero__cta hero__cta--ghost">
            Voir nos véhicules
          </Link>
        </div>
      </div>
    </section>
  );
}
