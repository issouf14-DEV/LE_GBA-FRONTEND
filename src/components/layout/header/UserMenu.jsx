import { LogIn, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAvatar } from '@/components/common/UserAvatar';
import { USER_LINKS } from '@/components/layout/header/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getDisplayName } from '@/lib/user';

export function UserMenu() {
  const { user, isAuthenticated, isAdmin, sessionStatus, logout } = useAuth();
  const canAdmin = isAdmin && sessionStatus === 'verified';
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="header-login">
        <LogIn aria-hidden="true" />
        Connexion
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-avatar-btn">
        <span className="sr-only">Menu de {getDisplayName(user)}</span>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="user-menu">
        <DropdownMenuLabel className="user-menu__header">
          <span className="user-menu__name">{getDisplayName(user)}</span>
          <span className="user-menu__email">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {USER_LINKS.filter((link) => !link.adminOnly || canAdmin).map(
          ({ to, label, icon: Icon }) => (
            <DropdownMenuItem key={to} asChild>
              <Link to={to} className="user-menu__item">
                <Icon aria-hidden="true" />
                {label}
              </Link>
            </DropdownMenuItem>
          )
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} className="user-menu__item user-menu__logout">
          <LogOut aria-hidden="true" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
