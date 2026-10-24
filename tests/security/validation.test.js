// Niveau 2 : les formulaires rejettent les entrées hostiles
import { describe, expect, it } from 'vitest';
import { vehicleSchema } from '@/features/admin/vehicles/schemas';
import { loginSchema, registerSchema } from '@/features/auth/schemas';
import { MAX_RENTAL_DAYS, STEP_SCHEMAS } from '@/features/checkout/schemas';
import { contactSchema } from '@/features/contact/schemas';

const ok = (schema, data) => schema.safeParse(data).success;
const inDays = (days) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

const validRegister = {
  firstName: 'Awa',
  lastName: 'Koné',
  email: 'awa@example.com',
  phone: '07 12 34 56 78',
  address: 'Cocody',
  password: 'Secret123',
  confirmPassword: 'Secret123',
};

describe('Injection NoSQL : un objet ne remplace jamais un texte', () => {
  it.each([{ $gt: '' }, { $ne: null }, ['admin@gba.com'], 42, null])('email = %j', (email) => {
    expect(ok(loginSchema, { email, password: 'x' })).toBe(false);
  });

  it('mot de passe objet refusé', () => {
    expect(ok(loginSchema, { email: 'a@b.co', password: { $ne: '' } })).toBe(false);
  });
});

describe('Balisage HTML dans les champs de nom', () => {
  it.each(['<script>alert(1)</script>', '<img src=x onerror=alert(1)>', 'Awa<b>'])(
    'prénom = %s',
    (firstName) => {
      expect(ok(registerSchema, { ...validRegister, firstName })).toBe(false);
    }
  );

  it('un nom normal avec accents et tiret est accepté', () => {
    expect(ok(registerSchema, { ...validRegister, firstName: 'Jean-Éloi' })).toBe(true);
  });
});

describe('Tailles maximales (déni de service)', () => {
  it('mot de passe de connexion géant refusé', () => {
    expect(ok(loginSchema, { email: 'a@b.co', password: 'a'.repeat(10_000) })).toBe(false);
  });

  it('email de plus de 254 caractères refusé', () => {
    expect(ok(loginSchema, { email: `${'a'.repeat(250)}@b.co`, password: 'x' })).toBe(false);
  });

  it('message de contact de plus de 2000 caractères refusé', () => {
    const message = 'a'.repeat(2001);
    expect(
      ok(contactSchema, { name: 'A', email: 'a@b.co', phone: '', subject: 'S', message })
    ).toBe(false);
  });
});

describe('Mots de passe', () => {
  it.each(['court1', 'sanschiffre', '12345678', ''])('mot de passe faible « %s » refusé', (p) => {
    expect(ok(registerSchema, { ...validRegister, password: p, confirmPassword: p })).toBe(false);
  });

  it('confirmation différente refusée', () => {
    expect(ok(registerSchema, { ...validRegister, confirmPassword: 'Autre1234' })).toBe(false);
  });
});

describe('Téléphone', () => {
  it.each(['........', '+--------', 'abcdefghij', '1234567'])('« %s » refusé', (phone) => {
    expect(ok(registerSchema, { ...validRegister, phone })).toBe(false);
  });
});

describe('Dates de réservation', () => {
  const dates = STEP_SCHEMAS[2];
  const check = (startDate, endDate) => ok(dates, { startDate, endDate, notes: '' });

  it('réservation valide acceptée', () => expect(check(inDays(1), inDays(3))).toBe(true));
  it('date dans le passé refusée', () => expect(check(inDays(-2), inDays(3))).toBe(false));
  it('fin avant début refusée', () => expect(check(inDays(5), inDays(2))).toBe(false));
  it('durée excessive refusée', () =>
    expect(check(inDays(1), inDays(MAX_RENTAL_DAYS + 5))).toBe(false));
  it.each(['2026-02-30', '2026-13-01', `${inDays(1)}<script>`, '01/02/2027', ''])(
    'date mal formée « %s » refusée',
    (bad) => expect(check(bad, inDays(4))).toBe(false)
  );
});

describe('Formulaire véhicule (admin)', () => {
  const base = {
    brand: 'Toyota',
    model: 'Corolla',
    price: '25000',
    year: '2024',
    type: 'thermal',
    fuel: '',
    transmission: '',
    power: '',
    engineSize: '',
    color: '',
    doors: '5',
    seats: '5',
    mileage: '0',
    available: true,
    featured: false,
    tags: '',
    description: '',
    image: '',
  };

  it('véhicule valide accepté', () => expect(ok(vehicleSchema, base)).toBe(true));
  it.each([
    'javascript:alert(1)',
    'data:image/svg+xml;base64,PHN2Zz4=',
    'http://insecure.example/a.png',
    '//evil.example/a.png',
    'data:image/jpg;base64,/9j/',
    '/api/vehicles/../admin/image',
    '/api/vehicles/507f1f77bcf86cd799439011/image?v=1&x=2',
  ])('image « %s » refusée', (image) => expect(ok(vehicleSchema, { ...base, image })).toBe(false));
  it.each([
    'https://cdn.example/a.png',
    'data:image/jpeg;base64,/9j/',
    '/api/vehicles/507f1f77bcf86cd799439011/image',
    '/api/vehicles/507f1f77bcf86cd799439011/image?v=3',
  ])('image « %s » acceptée', (image) => expect(ok(vehicleSchema, { ...base, image })).toBe(true));
  it('prix négatif ou absurde refusé', () => {
    expect(ok(vehicleSchema, { ...base, price: '-5' })).toBe(false);
    expect(ok(vehicleSchema, { ...base, price: '1e12' })).toBe(false);
  });
  it('type de motorisation inconnu refusé', () =>
    expect(ok(vehicleSchema, { ...base, type: 'rocket' })).toBe(false));
});
