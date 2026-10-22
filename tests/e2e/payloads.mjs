// Données piégées renvoyées par le faux backend (simule une base de données compromise)
export const XSS = '<img src=x onerror="window.__xss=1;alert(1)">';
export const SCRIPT = '<script>window.__xss=1;alert(1)</script>';

export const USER = {
  _id: 'u1',
  name: `Awa ${XSS}`,
  email: 'awa@example.com',
  role: 'user',
  profileImage: 'javascript:window.__xss=1',
};

export const VEHICLES = [
  {
    _id: 'v1',
    brand: XSS,
    model: SCRIPT,
    year: 2024,
    price: 50000,
    type: 'thermal',
    description: SCRIPT,
    image: 'javascript:window.__xss=1',
    photos: ['data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9ImFsZXJ0KDEpIj48L3N2Zz4='],
    available: true,
  },
  { _id: 'v2', brand: 'Toyota', model: 'Corolla', year: 2023, price: 30000, available: true },
];

export const ORDERS = [
  {
    _id: 'o1',
    status: '<b onmouseover=alert(1)>validee</b>',
    vehicle: VEHICLES[0],
    startDate: '2030-01-10',
    endDate: '2030-01-13',
    totalPrice: 150000,
    contact: { fullName: SCRIPT, email: XSS, phone: '0700000000', address: XSS },
    notes: SCRIPT,
    createdAt: '2026-01-01T00:00:00Z',
  },
];
