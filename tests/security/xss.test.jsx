// Niveau 3 : des données hostiles venant de l'API ou du navigateur ne deviennent jamais du code
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EmptyState } from '@/components/common/EmptyState';
import { CartItem } from '@/features/cart/components/CartItem';
import { loadCart } from '@/features/cart/lib/cartItem';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { normalizeOrder } from '@/features/orders/lib/normalizeOrder';
import { VehicleCard } from '@/features/vehicles/components/VehicleCard';
import { VehicleGallery } from '@/features/vehicles/components/VehicleGallery';
import { normalizeVehicle } from '@/features/vehicles/lib/vehicle';
import { expectNoInjectedMarkup, renderWithProviders, XSS } from '../helpers/render';

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete window.__xss;
});

const evilVehicle = () =>
  normalizeVehicle({
    _id: 'v1',
    brand: XSS.img,
    model: XSS.script,
    description: XSS.svg,
    price: 1000,
    image: XSS.jsUrl,
    photos: [XSS.svgData, 'https://cdn.example.com/ok.jpg', XSS.jsUrl],
  });

describe('Véhicule piégé renvoyé par l’API', () => {
  it('la carte affiche le texte brut sans l’interpréter', () => {
    const { container } = renderWithProviders(<VehicleCard vehicle={evilVehicle()} />);
    expectNoInjectedMarkup(container);
    expect(screen.getByText(XSS.script)).toBeTruthy();
    expect(window.__xss).toBeUndefined();
  });

  it('l’image javascript: est remplacée par une image sûre', () => {
    const vehicle = evilVehicle();
    expect(vehicle.image.startsWith('https://')).toBe(true);
  });

  it('la galerie ne garde que les images sûres', () => {
    const vehicle = evilVehicle();
    expect(vehicle.images).toEqual(['https://cdn.example.com/ok.jpg']);
    const { container } = renderWithProviders(<VehicleGallery vehicle={vehicle} />);
    expectNoInjectedMarkup(container);
  });
});

describe('Commande piégée', () => {
  it('nom, véhicule et notes restent du texte', () => {
    const order = normalizeOrder({
      _id: 'o1',
      status: '<b>validee</b>',
      vehicle: { brand: XSS.img, model: 'X', image: XSS.jsUrl },
      contact: { fullName: XSS.script, email: XSS.svg, phone: '1', address: XSS.img },
      notes: XSS.script,
      totalPrice: 10,
    });
    const { container } = renderWithProviders(
      <OrderCard order={order} onDetails={() => {}} onCancel={() => {}} onResend={() => {}} />
    );
    expectNoInjectedMarkup(container);
    expect(order.status).toBe('en_attente');
    expect(screen.getByText('En attente')).toBeTruthy();
    expect(window.__xss).toBeUndefined();
  });
});

describe('Panier falsifié dans le localStorage', () => {
  it('les articles invalides sont écartés et les champs nettoyés', () => {
    localStorage.setItem(
      'cart_u1',
      JSON.stringify([
        { id: 'v1', name: XSS.img, price: 'gratuit', image: XSS.jsUrl, quantity: 9999 },
        { name: 'sans identifiant' },
        { id: { $ne: null } },
        { id: 'v2', name: 'Golf', price: 5000, __proto__: { isAdmin: true } },
      ])
    );
    const items = loadCart('cart_u1');
    expect(items.map((item) => item.id)).toEqual(['v1', 'v2']);
    expect(items[0]).toMatchObject({ price: 0, image: null, quantity: 1 });
    expect({}.isAdmin).toBeUndefined();

    const { container } = renderWithProviders(
      <CartItem item={items[0]} onRemove={() => {}} onQuantity={() => {}} />
    );
    expectNoInjectedMarkup(container);
  });

  it('un JSON corrompu donne un panier vide sans planter', () => {
    localStorage.setItem('cart_u1', '{"pas du json');
    expect(loadCart('cart_u1')).toEqual([]);
  });
});

describe('Notifications et messages d’erreur', () => {
  it('une notification piégée reste du texte', () => {
    const notification = {
      id: 'n1',
      type: XSS.jsUrl,
      title: XSS.img,
      message: XSS.script,
      read: false,
    };
    const { container } = renderWithProviders(
      <NotificationItem notification={notification} onRead={() => {}} onDelete={() => {}} />
    );
    expectNoInjectedMarkup(container);
  });

  it('un message d’erreur du serveur reste du texte', () => {
    const { container } = renderWithProviders(<EmptyState title="Erreur" description={XSS.img} />);
    expectNoInjectedMarkup(container);
    expect(screen.getByText(XSS.img)).toBeTruthy();
  });
});
