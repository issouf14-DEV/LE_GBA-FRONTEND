// Données réalistes pour la revue visuelle (captures d'écran)
const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format`;
const day = (offset) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);

export const USER = {
  _id: 'a1',
  name: 'Awa Koné',
  firstName: 'Awa',
  lastName: 'Koné',
  email: 'awa.kone@example.com',
  phone: '07 12 34 56 78',
  address: 'Cocody, Abidjan',
  role: 'admin',
};

const vehicle = (id, brand, model, type, price, photo, extra = {}) => ({
  _id: id,
  brand,
  model,
  type,
  price,
  year: 2024,
  fuel: { thermal: 'Essence', electric: 'Électrique', hybrid: 'Hybride' }[type],
  transmission: 'Automatique',
  power: '245 ch',
  mileage: 0,
  image: img(photo),
  description: `${brand} ${model} : confort, sécurité et performances pour tous vos trajets.`,
  available: true,
  ...extra,
});

export const VEHICLES = [
  vehicle('v1', 'Volkswagen', 'Golf GTI', 'thermal', 45000, '1622353219448-46a8f44ce528'),
  vehicle('v2', 'Audi', 'e-tron GT', 'electric', 95000, '1614200187524-dc4b892acf16'),
  vehicle('v3', 'BMW', 'iX', 'electric', 80000, '1555215695-3004980ad54e', { available: false }),
  vehicle('v4', 'Volkswagen', 'Golf eHybrid', 'hybrid', 55000, '1617469767053-d3b523a0b982'),
  vehicle('v5', 'Mercedes', 'AMG GT', 'thermal', 120000, '1618843479313-40f8afb4b4d8'),
  vehicle('v6', 'Porsche', '911 Carrera', 'thermal', 150000, '1503376780353-7e6692767b70'),
];

const order = (id, v, status, start, days, createdOffset) => ({
  _id: `66f1c0ffee0000000000000${id}`,
  vehicle: { _id: v._id, brand: v.brand, model: v.model, image: v.image },
  startDate: day(start),
  endDate: day(start + days),
  days,
  pricePerDay: v.price,
  totalPrice: v.price * days,
  status,
  contact: { fullName: 'Awa Koné', email: USER.email, phone: USER.phone, address: USER.address },
  notes: '',
  createdAt: new Date(Date.now() + createdOffset * 86_400_000).toISOString(),
});

export const ORDERS = [
  order(1, VEHICLES[0], 'en_attente', 3, 4, -1),
  order(2, VEHICLES[1], 'validee', 10, 2, -5),
  order(3, VEHICLES[3], 'terminee', -20, 3, -25),
  order(4, VEHICLES[4], 'rejetee', 5, 1, -40),
];

export const USERS = [
  { ...USER, createdAt: '2025-11-02T10:00:00Z' },
  {
    _id: 'u2',
    name: 'Yao Kouassi',
    email: 'yao@example.com',
    phone: '05 44 55 66 77',
    role: 'user',
    createdAt: '2026-02-14T10:00:00Z',
  },
  {
    _id: 'u3',
    name: 'Fatou Traoré',
    email: 'fatou@example.com',
    phone: '',
    role: 'user',
    createdAt: '2026-06-01T10:00:00Z',
  },
];
