import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
];

export function VehicleToolbar({ search, onSearch, filters, onFilter, years }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="vehicle-toolbar">
      <div className="vehicle-toolbar__row">
        <label className="vehicle-toolbar__search">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Rechercher un véhicule..."
            maxLength={80}
            aria-label="Rechercher un véhicule"
          />
        </label>
        <Button
          className="btn-gradient vehicle-toolbar__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <SlidersHorizontal aria-hidden="true" />
          Filtres
        </Button>
      </div>

      {open && (
        <div className="vehicle-filters">
          <fieldset className="vehicle-filters__group">
            <legend>Prix (FCFA)</legend>
            <div className="vehicle-filters__range">
              <input
                type="number"
                min="0"
                placeholder="Min"
                aria-label="Prix minimum"
                value={filters.priceMin}
                onChange={(e) => onFilter('priceMin', e.target.value)}
              />
              <input
                type="number"
                min="0"
                placeholder="Max"
                aria-label="Prix maximum"
                value={filters.priceMax}
                onChange={(e) => onFilter('priceMax', e.target.value)}
              />
            </div>
          </fieldset>
          <label className="vehicle-filters__group">
            <span>Année</span>
            <select value={filters.year} onChange={(e) => onFilter('year', e.target.value)}>
              <option value="">Toutes</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label className="vehicle-filters__group">
            <span>Trier par</span>
            <select value={filters.sortBy} onChange={(e) => onFilter('sortBy', e.target.value)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
