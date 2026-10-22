import { Archive, ListChecks } from 'lucide-react';
import { FilterPills } from '@/components/common/FilterPills';
import { SearchInput } from '@/components/common/SearchInput';
import { STATUS_FILTERS } from '@/features/admin/orders/lib/adminOrders';

const VIEWS = [
  { id: 'active', label: 'Commandes actives', icon: ListChecks },
  { id: 'history', label: 'Historique', icon: Archive },
];

export function OrdersToolbar({ filters, onChange }) {
  return (
    <div className="orders-toolbar">
      <FilterPills
        className="orders-toolbar__pills"
        label="Vue des commandes"
        options={VIEWS}
        value={filters.view}
        onChange={(view) => {
          onChange('view', view);
          onChange('status', 'all');
        }}
      />
      <SearchInput
        value={filters.search}
        onChange={(value) => onChange('search', value)}
        placeholder="Rechercher (nom, email, téléphone, véhicule, ID...)"
      />
      {filters.view === 'active' && (
        <FilterPills
          className="orders-toolbar__pills"
          label="Filtrer par statut"
          options={STATUS_FILTERS}
          value={filters.status}
          onChange={(status) => onChange('status', status)}
        />
      )}
    </div>
  );
}
