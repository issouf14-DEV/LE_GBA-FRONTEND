import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = { success: CheckCircle2, error: AlertCircle, warning: TriangleAlert, info: Info };

export function Alert({ variant = 'info', title, children, className }) {
  if (!children && !title) return null;
  const Icon = ICONS[variant];

  return (
    <div
      className={cn('alert', `alert--${variant}`, className)}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon className="alert__icon" aria-hidden="true" />
      <div>
        {title && <p className="alert__title">{title}</p>}
        {children && <div className="alert__text">{children}</div>}
      </div>
    </div>
  );
}
