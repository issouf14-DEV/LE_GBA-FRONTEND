import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UserAvatar } from '@/components/common/UserAvatar';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { useOrderNotifications } from '@/features/notifications/hooks/useOrderNotifications';

export default function AdminLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  useOrderNotifications('admin');

  // Sur mobile, le menu se referme à chaque changement de page
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="admin-layout">
      <AdminSidebar open={menuOpen} />
      {menuOpen && (
        <button
          type="button"
          className="admin-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
        />
      )}
      <div className="admin-layout__main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
          >
            <Menu aria-hidden="true" />
          </button>
          <div className="admin-topbar__actions">
            <NotificationBell />
            <UserAvatar user={user} />
          </div>
        </header>
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
