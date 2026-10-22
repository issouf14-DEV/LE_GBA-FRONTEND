import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchInput({ value, onChange, placeholder = 'Rechercher...', className }) {
  return (
    <div className={cn('search-input', className)}>
      <Search className="search-input__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={100}
        aria-label={placeholder}
        className="search-input__field"
      />
      {value && (
        <button
          type="button"
          className="search-input__clear"
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
