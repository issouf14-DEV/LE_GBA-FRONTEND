import { AlertCircle, CarFront, Plus, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { SearchInput } from '@/components/common/SearchInput';
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { VehicleFormDialog } from '@/features/admin/vehicles/components/VehicleFormDialog';
import { VehicleTable } from '@/features/admin/vehicles/components/VehicleTable';
import { useAdminVehicles } from '@/features/admin/vehicles/hooks/useAdminVehicles';

export default function ManageVehicles() {
  const admin = useAdminVehicles();
  const [editor, setEditor] = useState({ open: false, vehicle: null });
  const [toDelete, setToDelete] = useState(null);
  const [preview, setPreview] = useState(null);

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Gestion des véhicules"
        subtitle={`${admin.total} véhicule(s) • ${admin.availableCount} disponible(s)`}
      >
        <Button variant="outline" onClick={admin.reload} disabled={admin.loading}>
          {admin.loading ? <Spinner /> : <RefreshCw aria-hidden="true" />} Actualiser
        </Button>
        <Button onClick={() => setEditor({ open: true, vehicle: null })}>
          <Plus aria-hidden="true" /> Ajouter
        </Button>
      </AdminPageHeader>

      <div className="admin-card">
        <SearchInput
          value={admin.search}
          onChange={admin.setSearch}
          placeholder="Rechercher un véhicule..."
        />
        {admin.loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : admin.error ? (
          <EmptyState icon={AlertCircle} tone="error" title="Erreur" description={admin.error} />
        ) : admin.vehicles.length === 0 ? (
          <EmptyState icon={CarFront} title="Aucun véhicule trouvé" />
        ) : (
          <VehicleTable
            vehicles={admin.vehicles}
            onEdit={(vehicle) => setEditor({ open: true, vehicle })}
            onDelete={setToDelete}
            onPreview={setPreview}
          />
        )}
      </div>

      <VehicleFormDialog
        open={editor.open}
        vehicle={editor.vehicle}
        onClose={() => setEditor({ open: false, vehicle: null })}
        onSave={admin.save}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer ce véhicule ?"
        description={toDelete ? `${toDelete.name} sera définitivement supprimé.` : ''}
        confirmLabel="Supprimer"
        destructive
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          admin.remove(toDelete.id);
          setToDelete(null);
        }}
      />
      <ImageLightbox
        images={preview ? [preview] : []}
        index={preview ? 0 : null}
        onIndexChange={() => {}}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
