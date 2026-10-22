import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Tuile chiffre clé (titre, valeur, lien optionnel)
export function StatCard({ title, value, icon: Icon, to, hint }) {
  return (
    <article className="stat-card">
      <div className="stat-card__head">
        <p className="stat-card__title">{title}</p>
        <span className="stat-card__icon">
          <Icon aria-hidden="true" />
        </span>
      </div>
      <p className="stat-card__value">{value}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
      {to && (
        <Link to={to} className="stat-card__link">
          Voir le détail <ArrowRight aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
