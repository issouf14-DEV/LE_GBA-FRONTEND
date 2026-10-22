import { cn } from '@/lib/utils';

// Champ de formulaire avec label, icône optionnelle et message d'erreur
export function TextField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  action,
  trailing,
  className,
  as: Control = 'input',
  ...inputProps
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('field', error && 'field--invalid', className)}>
      {(label || action) && (
        <div className="field__label-row">
          {label && (
            <label htmlFor={id} className="field__label">
              {label}
            </label>
          )}
          {action}
        </div>
      )}
      <div className="field__control">
        {Icon && <Icon className="field__icon" aria-hidden="true" />}
        <Control
          id={id}
          className="field__input"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...inputProps}
        />
        {trailing}
      </div>
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
