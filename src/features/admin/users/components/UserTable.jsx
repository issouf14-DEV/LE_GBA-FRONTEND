import { Trash2 } from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROLES } from '@/features/admin/users/schemas';
import { formatDate } from '@/lib/format';
import { getDisplayName } from '@/lib/user';

const COLUMNS = ['Utilisateur', 'Email', 'Téléphone', 'Rôle', 'Inscription', 'Actions'];

export function UserTable({ users, currentUserId, onRoleChange, onDelete }) {
  return (
    <Table className="admin-table">
      <TableHeader>
        <TableRow>
          {COLUMNS.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const id = String(user._id ?? user.id);
          const isSelf = id === String(currentUserId);
          return (
            <TableRow key={id}>
              <TableCell>
                <div className="admin-table__user">
                  <UserAvatar user={user} />
                  <span className="admin-table__strong">{getDisplayName(user)}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || '-'}</TableCell>
              <TableCell>
                <select
                  value={user.role}
                  onChange={(event) => onRoleChange(id, event.target.value)}
                  disabled={isSelf}
                  aria-label={`Rôle de ${getDisplayName(user)}`}
                  className={`role-select role-select--${user.role}`}
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>{formatDate(user.createdAt, 'short')}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(user)}
                  disabled={isSelf}
                  title={isSelf ? 'Vous ne pouvez pas supprimer votre propre compte' : undefined}
                >
                  <Trash2 aria-hidden="true" /> Supprimer
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
