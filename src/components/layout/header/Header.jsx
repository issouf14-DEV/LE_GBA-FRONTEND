import { Menu, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DesktopNav } from '@/components/layout/header/DesktopNav';
import { HeaderSearch } from '@/components/layout/header/HeaderSearch';
import { MobileMenu } from '@/components/layout/header/MobileMenu';
import { TopBar } from '@/components/layout/header/TopBar';
import { UserMenu } from '@/components/layout/header/UserMenu';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { useOrderNotifications } from '@/features/notifications/hooks/useOrderNotifications';
import { cn } from '@/lib/utils';

export function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const cartCount = getCartCount();

  useOrderNotifications(isAdmin ? 'admin' : 'user');

  // Le menu mobile se ferme à chaque changement de page
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const MenuIcon = mobileOpen ? X : Menu;

  return (
    <header className={cn('site-header', scrolled && 'site-header--scrolled')}>
      <TopBar />
      <div className="main-nav">
        <div className="main-nav__inner">
          <Link to="/" className="brand">
            LE-GBA
          </Link>
          <DesktopNav />
          <div className="header-actions">
            <HeaderSearch />
            {isAuthenticated && <NotificationBell />}
            <Link
              to="/cart"
              className="header-icon-btn header-cart"
              aria-label={cartCount > 0 ? `Panier : ${cartCount} article(s)` : 'Panier'}
            >
              <ShoppingCart aria-hidden="true" />
              {cartCount > 0 && (
                <span className="header-cart__count" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>
            <UserMenu />
            <button
              type="button"
              className="header-menu-btn"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <MenuIcon aria-hidden="true" />
            </button>
          </div>
        </div>
        <MobileMenu open={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      </div>
    </header>
  );
}
