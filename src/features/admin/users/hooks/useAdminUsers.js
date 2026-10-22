import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminAPI } from '@/api/admin';
import { getErrorMessage } from '@/api/client';
import { useToast } from '@/components/common/toast/useToast';
import { normalizeText } from '@/lib/text';

export function useAdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await adminAPI.getUsers());
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de charger les utilisateurs'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = useMemo(() => {
    const query = normalizeText(search);
    if (!query) return users;
    return users.filter((user) =>
      normalizeText(
        `${user.name} ${user.firstName} ${user.lastName} ${user.email} ${user.phone}`
      ).includes(query)
    );
  }, [users, search]);

  // Exécute une action admin puis recharge la liste, avec un retour visuel
  const run = async (action, successMessage) => {
    try {
      await action();
      toast.success(successMessage);
      await reload();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    }
  };

  return {
    users: filtered,
    total: users.length,
    loading,
    error,
    search,
    setSearch,
    reload,
    createUser: (data) => run(() => adminAPI.createUser(data), 'Utilisateur créé'),
    changeRole: (id, role) => run(() => adminAPI.updateUserRole(id, role), 'Rôle mis à jour'),
    deleteUser: (id) => run(() => adminAPI.deleteUser(id), 'Utilisateur supprimé'),
  };
}
