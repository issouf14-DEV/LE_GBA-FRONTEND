import { cn } from '@/lib/utils';

// Carte « icône + titre + texte » (services, valeurs, avantages…)
export function FeatureCard({ icon: Icon, title, children, variant, className }) {
  return (
    <article className={cn('feature-card', variant && `feature-card--${variant}`, className)}>
      <span className="feature-card__icon">
        <Icon aria-hidden="true" />
      </span>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__text">{children}</p>
    </article>
  );
}

export function FeatureGrid({ items, variant, columns = 3 }) {
  return (
    <div className={cn('feature-grid', `feature-grid--${columns}`)}>
      {items.map((item) => (
        <FeatureCard key={item.title} icon={item.icon} title={item.title} variant={variant}>
          {item.text}
        </FeatureCard>
      ))}
    </div>
  );
}
