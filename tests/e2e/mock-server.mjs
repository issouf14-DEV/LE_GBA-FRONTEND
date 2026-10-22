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
const SECURITY_HEADERS = vercel.headers[0].headers;
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
  if (path === '/api/orders' && req.method === 'GET') return json(res, 200, { orders: ORDERS });
  if (path === '/api/admin/users') return json(res, 200, { users: USERS });
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
