import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Carte en deux colonnes : visuel à gauche, formulaire à droite
export function AuthLayout({ variant = 'login', aside, title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className={cn('auth-card', `auth-card--${variant}`)}>
        <aside className={cn('auth-aside', `auth-aside--${variant}`)}>
          <div className="auth-aside__overlay" />
          <div className="auth-aside__content">
            <span className="auth-badge">
              {aside.badgeIcon && <aside.badgeIcon aria-hidden="true" />}
              {aside.badge}
            </span>
            <h2 className="auth-aside__title">{aside.title}</h2>
            {aside.text && <p className="auth-aside__text">{aside.text}</p>}
            {aside.points && (
              <ul className="auth-aside__list">
                {aside.points.map((point) => (
                  <li key={point}>
                    <CheckCircle2 aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="auth-aside__footer">{aside.footer}</p>
        </aside>

        <main className="auth-main">
          <header className="auth-header">
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

// Carte simple centrée (mot de passe oublié / réinitialisation)
export function AuthCard({ children }) {
  return (
    <div className="auth-page">
      <main className="auth-card auth-card--simple">{children}</main>
    </div>
  );
}
