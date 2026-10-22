// Niveau 7 : logique métier (prix, commande, panier) face à un client malveillant
import { describe, expect, it } from 'vitest';
import { toCartItem } from '@/features/cart/lib/cartItem';
import { buildOrderPayload, computeQuote } from '@/features/checkout/lib/order';
import { MAX_RENTAL_DAYS } from '@/features/checkout/schemas';

const values = {
  fullName: 'Awa Koné',
  email: 'awa@example.com',
  phone: '0712345678',
  address: 'Cocody, Abidjan',
  startDate: '2030-01-10',
  endDate: '2030-01-13',
  notes: '',
  acceptTerms: true,
};

describe('Commande envoyée au serveur', () => {
  const vehicle = { _id: 'v1', id: 'v1', price: 50_000, available: true };
  const payload = buildOrderPayload({ vehicle, values });

  it('ne contient que la demande du client', () => {
    expect(Object.keys(payload).sort()).toEqual(
      ['contact', 'endDate', 'notes', 'startDate', 'vehicleId'].sort()
    );
  });

  it.each(['totalPrice', 'pricePerDay', 'status', 'userId', 'role', 'paymentStatus'])(
    'n’envoie jamais « %s » (calculé par le serveur)',
    (field) => {
      expect(JSON.stringify(payload)).not.toContain(`"${field}"`);
    }
  );

  it('n’envoie pas les champs parasites du formulaire', () => {
    const tampered = buildOrderPayload({
      vehicle,
      values: { ...values, totalPrice: 1, status: 'validee', role: 'admin' },
    });
    expect(tampered).toEqual(payload);
  });
});

describe('Estimation du prix affichée au client', () => {
  it('prix par jour × nombre de jours', () => {
    const quote = computeQuote({ price: 50_000 }, '2030-01-10', '2030-01-13');
    expect(quote).toEqual({ days: 3, perDay: 50_000, total: 150_000 });
  });

  it('pas de prix négatif ou textuel exploitable', () => {
    expect(computeQuote({ price: 'gratuit' }, '2030-01-10', '2030-01-13').total).toBe(0);
  });

  it('la durée maximale est bornée', () => {
    expect(MAX_RENTAL_DAYS).toBeLessThanOrEqual(90);
  });
});

describe('Ajout au panier', () => {
  it('ne recopie pas l’objet véhicule complet (données brutes, champs inconnus)', () => {
    const item = toCartItem({
      _id: 'v1',
      name: 'Golf',
      price: 30_000,
      source: { secret: 'x' },
      isAdmin: true,
      image: 'javascript:alert(1)',
    });
    expect(item).not.toHaveProperty('source');
    expect(item).not.toHaveProperty('isAdmin');
    expect(item.image).toBeNull();
    expect(item.quantity).toBe(1);
  });

  it('un prix absurde est ramené à zéro', () => {
    expect(toCartItem({ _id: 'v1', price: -10 }).price).toBe(0);
    expect(toCartItem({ _id: 'v1', price: 1e15 }).price).toBe(0);
  });
});
