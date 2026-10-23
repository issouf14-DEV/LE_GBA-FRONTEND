import { AlertCircle, Plus, RefreshCw, Users } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchInput } from '@/components/common/SearchInput';
import { TableSkeleton } from '@/components/common/skeletons/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { CreateUserDialog } from '@/features/admin/users/components/CreateUserDialog';
import { UserTable } from '@/features/admin/users/components/UserTable';
import { useAdminUsers } from '@/features/admin/users/hooks/useAdminUsers';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getDisplayName } from '@/lib/user';

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const admin = useAdminUsers();
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Gestion des utilisateurs"
        subtitle={`${admin.total} utilisateur(s) inscrit(s)`}
      >
        <Button variant="outline" onClick={admin.reload} disabled={admin.loading}>
          {admin.loading ? <Spinner /> : <RefreshCw aria-hidden="true" />} Actualiser
        </Button>
        <Button onClick={() => setCreating(true)}>
          <Plus aria-hidden="true" /> Ajouter
        </Button>
      </AdminPageHeader>

      <div className="admin-card">
        <SearchInput
          value={admin.search}
          onChange={admin.setSearch}
          placeholder="Rechercher (nom, email, téléphone...)"
        />
        {admin.loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : admin.error ? (
          <EmptyState icon={AlertCircle} tone="error" title="Erreur" description={admin.error} />
        ) : admin.users.length === 0 ? (
          <EmptyState icon={Users} title="Aucun utilisateur trouvé" />
        ) : (
          <UserTable
            users={admin.users}
            currentUserId={currentUser?.id}
            onRoleChange={admin.changeRole}
            onDelete={setToDelete}
          />
        )}
      </div>

      <CreateUserDialog
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={admin.createUser}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer cet utilisateur ?"
        description={toDelete ? `${getDisplayName(toDelete)} sera définitivement supprimé.` : ''}
        confirmLabel="Supprimer"
        destructive
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          admin.deleteUser(String(toDelete._id ?? toDelete.id));
          setToDelete(null);
        }}
      />
    </div>
  );
}
