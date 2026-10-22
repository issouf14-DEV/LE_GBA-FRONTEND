import { ChevronDown } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MODEL_CATEGORIES, NAV_LINKS } from '@/components/layout/header/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const linkClass = ({ isActive }) => cn('nav-link', isActive && 'nav-link--active');

function ModelsMenu({ label }) {
  const { pathname } = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn('nav-link', pathname.startsWith('/vehicles') && 'nav-link--active')}
      >
        {label}
        <ChevronDown className="nav-link__chevron" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="nav-dropdown">
        {MODEL_CATEGORIES.map((category) => (
          <DropdownMenuItem key={category.to} asChild>
            <Link to={category.to} className="nav-dropdown__item">
              {category.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DesktopNav() {
  return (
    <nav className="desktop-nav" aria-label="Navigation principale">
      {NAV_LINKS.map((link) =>
        link.children ? (
          <ModelsMenu key={link.to} label={link.label} />
        ) : (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            {link.label}
          </NavLink>
        )
      )}
    </nav>
  );
}
