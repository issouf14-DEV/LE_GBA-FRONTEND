import { Car, Home, LayoutDashboard, Package, Users } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MENU = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/admin/vehicles', label: 'Véhicules', icon: Car },
  { to: '/admin/orders', label: 'Commandes', icon: Package },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
];

export function AdminSidebar({ open = false }) {
  return (
    <aside className={cn('admin-sidebar', open && 'admin-sidebar--open')}>
      <div className="admin-sidebar__top">
        <p className="admin-sidebar__title">Administration</p>
        <nav className="admin-sidebar__nav" aria-label="Navigation administration">
          {MENU.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn('admin-sidebar__link', isActive && 'admin-sidebar__link--active')
              }
            >
              <Icon aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Link to="/" className="admin-sidebar__link admin-sidebar__back">
        <Home aria-hidden="true" />
        Retour au site
      </Link>
    </aside>
  );
}
