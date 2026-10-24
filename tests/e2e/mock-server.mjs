// Sert dist/ avec les en-têtes de vercel.json et simule le backend (cookies httpOnly réels)

import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import * as PAYLOADS from './payloads.mjs';

const DIST = 'dist';
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
};
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const SECURITY_HEADERS = Object.entries(
  vercel.routes.find((route) => route.src === '/(.*)' && route.continue).headers
).map(([key, value]) => ({ key, value }));
const COOKIE = 'HttpOnly; Secure; SameSite=Strict';

export const requests = [];

const cookies = (req) =>
  Object.fromEntries(
    (req.headers.cookie || '')
      .split(/;\s*/)
      .filter(Boolean)
      .map((c) => c.split('='))
  );

function json(res, status, body, extraHeaders = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...extraHeaders });
  res.end(JSON.stringify(body));
}

// Pagination comme le vrai backend : ?page&limit (limit 100 maximum)
function paged(req, list, key) {
  const query = new URL(req.url, 'http://localhost').searchParams;
  const limit = Math.min(Math.max(Number(query.get('limit')) || 20, 1), 100);
  const page = Math.max(Number(query.get('page')) || 1, 1);
  const items = list.slice((page - 1) * limit, page * limit);
  const totalPages = Math.max(Math.ceil(list.length / limit), 1);
  return { [key]: items, total: list.length, page, limit, totalPages };
}

// Agrégats de GET /api/admin/stats calculés sur les données simulées
function stats({ ORDERS, USERS = [], VEHICLES }) {
  const byStatus = { en_attente: 0, validee: 0, rejetee: 0, annulee: 0, terminee: 0 };
  for (const order of ORDERS) if (Object.hasOwn(byStatus, order.status)) byStatus[order.status]++;
  const paid = ORDERS.filter((o) => o.status === 'validee' || o.status === 'terminee');
  const now = new Date();
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + i, 1));
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, revenus: 0, commandes: 0 };
  });
  return {
    totalOrders: ORDERS.length,
    pendingOrders: byStatus.en_attente,
    totalRevenue: paid.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0),
    totalUsers: USERS.length,
    totalVehicles: VEHICLES.length,
    byStatus,
    monthly,
    recentOrders: ORDERS.slice(0, 5),
  };
}

function api(req, res, path, data) {
  const { USER, VEHICLES, ORDERS, USERS = [] } = data;
  const jar = cookies(req);
  const logged = jar.gba_at === 'valid';
  requests.push({
    method: req.method,
    path,
    cookie: Boolean(jar.gba_at),
    ajax: req.headers['x-requested-with'],
  });

  // Règle CSRF attendue du vrai backend : en-tête obligatoire sur les écritures
  if (req.method !== 'GET' && req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return json(res, 403, { message: 'Requête refusée' });
  }
  if (path === '/api/auth/login' && req.method === 'POST') {
    return json(res, 200, USER, {
      'Set-Cookie': [
        `gba_at=valid; Path=/api; Max-Age=900; ${COOKIE}`,
        `gba_rt=refresh; Path=/api/auth; Max-Age=604800; ${COOKIE}`,
      ],
    });
  }
  if (path === '/api/auth/refresh') return json(res, 401, { message: 'Session expirée' });
  if (path === '/api/auth/profile') return logged ? json(res, 200, USER) : json(res, 401, {});
  if (path === '/api/vehicles') return json(res, 200, { vehicles: VEHICLES });
  if (path.startsWith('/api/vehicles/')) {
    const id = path.split('/').pop();
    return json(res, 200, VEHICLES.find((v) => v._id === id) || VEHICLES[0]);
  }
  if (path === '/api/orders/mine') return logged ? json(res, 200, ORDERS) : json(res, 401, {});
  if (path === '/api/orders' && req.method === 'GET') {
    return json(res, 200, paged(req, ORDERS, 'orders'));
  }
  if (path === '/api/admin/users') return json(res, 200, paged(req, USERS, 'users'));
  if (path === '/api/admin/stats') return json(res, 200, stats(data));
  return json(res, logged ? 200 : 401, {});
}

function serveFile(res, path) {
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
  let file = join(DIST, safe);
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html');
  const headers = { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' };
  for (const { key, value } of SECURITY_HEADERS) headers[key] = value;
  // En HTTP local, upgrade-insecure-requests casserait les requêtes : seul ce mot-clé est retiré
  headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace(
    '; upgrade-insecure-requests',
    ''
  );
  res.writeHead(200, headers);
  res.end(readFileSync(file));
}

export function startAppServer(port, data = PAYLOADS) {
  const server = createServer((req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (path.startsWith('/api/')) return api(req, res, path, data);
    return serveFile(res, path);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

// Site attaquant : tente une requête avec les cookies de la victime (CSRF)
export function startEvilServer(port, target) {
  const page = `<!doctype html><body><script>
    fetch('${target}/api/orders', { method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'text/plain' }, body: '{"vehicleId":"v1"}' })
      .then(r => { window.__status = r.status }, () => { window.__status = 'bloqué' });
    </script><form id="f" method="POST" action="${target}/api/auth/logout"></form>
    <script>document.getElementById('f').submit()</script></body>`;
  const server = createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(page);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}
