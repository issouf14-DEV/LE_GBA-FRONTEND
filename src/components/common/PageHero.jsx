import { cn } from '@/lib/utils';

// Bandeau sombre en haut de page (titre + sous-titre)
export function PageHero({ title, subtitle, icon: Icon, className, children }) {
  return (
    <section className={cn('page-hero', className)}>
      <div className="page-hero__inner">
        {Icon && (
          <span className="page-hero__icon">
            <Icon aria-hidden="true" />
          </span>
        )}
        <h1 className="page-hero__title">{title}</h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
