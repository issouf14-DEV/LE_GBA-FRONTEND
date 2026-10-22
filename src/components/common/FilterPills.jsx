import { cn } from '@/lib/utils';

// Groupe de boutons bascule « pilule » : options = [{ id, label, count?, icon? }]
// (aria-pressed indique l'option active aux lecteurs d'écran)
export function FilterPills({ options, value, onChange, label = 'Filtrer', className }) {
  return (
    <fieldset className={cn('filter-pills', className)} aria-label={label}>
      {options.map(({ id, label: text, count, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={cn('filter-pill', value === id && 'filter-pill--active')}
        >
          {Icon && <Icon aria-hidden="true" />}
          {text}
          {count !== undefined && <span className="filter-pill__count">{count}</span>}
        </button>
      ))}
    </fieldset>
  );
}
