import { LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '@/components/layout/header/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

export function MobileMenu({ open, onNavigate }) {
  const { isAuthenticated } = useAuth();

  // Bloque le défilement de la page tant que le menu est ouvert
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  if (!open) return null;

  return (
    <div className="mobile-menu">
      <nav className="mobile-menu__nav" aria-label="Navigation mobile">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn('mobile-menu__link', isActive && 'mobile-menu__link--active')
            }
          >
            {link.label}
          </NavLink>
        ))}
        {!isAuthenticated && (
          <Link to="/login" onClick={onNavigate} className="mobile-menu__login">
            <LogIn aria-hidden="true" />
            Connexion
          </Link>
        )}
      </nav>
    </div>
  );
}
