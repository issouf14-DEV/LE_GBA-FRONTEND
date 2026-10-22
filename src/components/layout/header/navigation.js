import { ClipboardList, LayoutDashboard, ShoppingCart, User } from 'lucide-react';

export const NAV_LINKS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/vehicles', label: 'Modèles', children: true },
  { to: '/about', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

export const MODEL_CATEGORIES = [
  { to: '/vehicles', label: 'Tous les modèles' },
  { to: '/vehicles?type=electric', label: 'Électriques' },
  { to: '/vehicles?type=hybrid', label: 'Hybrides' },
  { to: '/vehicles?type=thermal', label: 'Thermiques' },
];

export const USER_LINKS = [
  { to: '/profile', label: 'Mon profil', icon: User },
  { to: '/profile/orders', label: 'Mes commandes', icon: ShoppingCart },
  { to: '/order-history', label: 'Historique', icon: ClipboardList },
  { to: '/admin/dashboard', label: 'Administration', icon: LayoutDashboard, adminOnly: true },
];
