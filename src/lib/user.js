// Nom et initiales d'un utilisateur, quel que soit le format renvoyé par le backend
export function getDisplayName(user) {
  if (!user) return 'Utilisateur';
  return (
    user.name ||
    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
    user.email ||
    'Utilisateur'
  );
}

export function getInitials(user) {
  const name = getDisplayName(user);
  const parts = name.split(/[\s@.]+/).filter(Boolean);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return initials.toUpperCase();
}
