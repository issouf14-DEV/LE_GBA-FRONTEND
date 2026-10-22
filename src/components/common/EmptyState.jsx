import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

// Message centré quand une liste est vide ou en erreur, avec actions optionnelles
export function EmptyState({ icon: Icon = Inbox, title, description, children, tone, className }) {
  return (
    <div className={cn('empty-state', tone && `empty-state--${tone}`, className)}>
      <span className="empty-state__icon">
        <Icon aria-hidden="true" />
      </span>
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__text">{description}</p>}
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  );
}
