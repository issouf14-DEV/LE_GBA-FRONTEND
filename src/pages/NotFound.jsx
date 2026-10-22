import { Car, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__inner">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">Page introuvable</h1>
        <p className="not-found__text">
          La page que vous recherchez semble avoir pris la route. Retournons ensemble vers nos
          véhicules premium !
        </p>
        <div className="not-found__actions">
          <Link to="/" className="hero__cta">
            <Home aria-hidden="true" /> Retour à l'accueil
          </Link>
          <Link to="/vehicles" className="hero__cta hero__cta--ghost">
            <Car aria-hidden="true" /> Voir nos véhicules
          </Link>
        </div>
      </div>
    </div>
  );
}
